// categoryController.js
const  Venta  = require('../models/venta');  
const  DetalleVentaProducto = require ('../models/detalleventaproducto');
const  DetalleVentaServicio = require ('../models/detalleventaservicio');
const Producto = require ('../models/producto')
const Cliente = require('../models/cliente');
const Abono = require('../models/abono');


//definimos los estados permitidos tipo boolean
const estadosPermitidos = [true, false];


//obtenemos todas las ventas
const getAllSales = async (req, res) => {
  try {
    const ventas = await Venta.findAll({
      include:[DetalleVentaProducto, DetalleVentaServicio]
    });  

    if (ventas.length === 0 ){
      return res.status(404).json({message: "No hay ventas registradas"})
    }
    res.json(ventas);
  } catch (error) {
    console.error('Error fetching sales:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

//obtenemos las ventas por id
async function getSaleById(req, res) {
  const { id } = req.params;
  try {
    const venta = await Venta.findByPk(id, {
      include: [DetalleVentaProducto, DetalleVentaServicio] 
    });

    if (!venta) {
      return res.status(404).json({ error: 'Venta no encontrada.' });
    }

    // Accede a los detalles de productos y servicios a través de las relaciones
    const detallesProductos = venta.DetalleVentaProductos;
    const detallesServicios = venta.DetalleVentaServicios;

    res.json({
      venta,
      detallesProductos,
      detallesServicios
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener la venta.' });
  }
}

const getActiveSales = async (req, res) => {
  try {
    const ventas = await Venta.findAll({where: {estado:true},
      include:[DetalleVentaProducto, DetalleVentaServicio]
    });  

    if (ventas.length === 0 ){
      return res.status(404).json({message: "No hay ventas activas"})
    }
    res.json(ventas);
  } catch (error) {
    console.error('Error fetching sales:', error);
    res.status(500).json({ error: 'Error al obtener las ventas activas' });
  }
};

const getInactiveSales = async (req, res) => {
  try {
    const ventas = await Venta.findAll({where: {estado:false},
      include:[DetalleVentaProducto, DetalleVentaServicio]
    });  

    if (ventas.length === 0 ){
      return res.status(404).json({message: "No hay ventas inactivas"})
    }
    res.json(ventas);
  } catch (error) {
    console.error('Error fetching sales:', error);
    res.status(500).json({ error: 'Error al obtener las ventas inactivas' });
  }
};

//creamos una venta
async function createSale(req, res) {
  const { idcliente, numerofactura, fecha, metodopago, tipopago,observacion, valortotal, estado, estadopago, detalleProductos, detalleServicios } = req.body;

  // Validaciones
  const validacionNumeroFactura = /^[0-9]+$/;
  const metodos_pago = ["Efectivo", "Transferencia"];
  const estados_pago = ["Pendiente", "En proceso", "Pagado"];
  const tipo_pago = ["Contado", "Credito"]

  if (!metodos_pago.includes(metodopago)) {
    return res.status(400).json({ error: "Los métodos de pago son: Efectivo y Transferencia" });
  }

  if (!estados_pago.includes(estadopago)) {
    return res.status(400).json({ error: "Los estados de pago son: Pendiente, En proceso y Pagado" });
  }

  if (!tipo_pago.includes(tipopago)) {
    return res.status(400).json({ error: "Los tipos de pago son: Contado y Credito" });
  }

  if (!validacionNumeroFactura.test(numerofactura)) {
    return res.status(400).json({ error: "El numero de factura solo acepta valores numericos" });
  }

  const numero_factura_existente = await Venta.findOne({ where: { numerofactura } });
  if (numero_factura_existente) {
    return res.status(400).json({ error: "El número de factura ya existe." });
  }

  try {
    // Calcular valortotal_venta sumando los valores de los productos
    let valortotal_venta = 0;

    for (const detalleProducto of detalleProductos) {
      const producto = await Producto.findByPk(detalleProducto.idproducto);

      if (!producto) {
        throw new Error(`Producto con ID ${detalleProducto.idproducto} no encontrado.`);
      }

      if (detalleProducto.cantidadproducto > producto.cantidad) {
        throw new Error("No hay suficientes unidades");
      }

      const precio_producto = detalleProducto.cantidadproducto * producto.precio_venta;
      valortotal_venta += precio_producto;

      const nuevaCantidad = producto.cantidad - detalleProducto.cantidadproducto;
      if (nuevaCantidad < 0) {
        throw new Error("No hay suficientes unidades");
      }

      await producto.update({ cantidad: nuevaCantidad });
    }

    for (const detalleServicio of detalleServicios) {
      valortotal_venta += detalleServicio.precio;
    }

    const fechaActual = new Date().toISOString().split('T')[0];

    // Crear la venta
    const venta = await Venta.create({
      idcliente,
      numerofactura,
      fecha: fechaActual,
      metodopago,
      estadopago,
      tipopago,
      observacion:null,
      valortotal: valortotal_venta,
      estado
    });

    // Crear detalles de productos
    await Promise.all(
      detalleProductos.map(async (detalleProducto) => {
        const validacion_cantidad = /^[0-9]+$/;

        if (!validacion_cantidad.test(detalleProducto.cantidadproducto)) {
          throw new Error("La cantidad del producto solo acepta valores numéricos");
        }

        const producto = await Producto.findByPk(detalleProducto.idproducto);
        if (!producto) {
          throw new Error(`Producto con ID ${detalleProducto.idproducto} no encontrado.`);
        }

        await DetalleVentaProducto.create({
          idventa: venta.idventa,
          idproducto: detalleProducto.idproducto,
          cantidadproducto: detalleProducto.cantidadproducto,
          precio: producto.precio_venta
        });
      })
    );

    // Crear detalles de servicios
    await Promise.all(
      detalleServicios.map(async (detalleServicio) => {
        await DetalleVentaServicio.create({
          idventa: venta.idventa,
          idservicio: detalleServicio.idservicio,
          precio: detalleServicio.precio,
          // Elimina la siguiente línea para no enviar la descripción
          // descripcion: detalleServicio.descripcion
        });
      })
    );

    res.status(201).json({ venta, detalleProductos, detalleServicios });
  } catch (error) {
    console.error('Error al crear la venta:', error.message);
    console.error('Detalles:', error);
    res.status(400).json({ error: 'Error al crear la venta. Detalles: ' + error.message });
  }
}


//actualizar el estado de la venta 
async function updateSaleState(req, res) {
  const { id } = req.params;
  const { estado } = req.body;


  try {

    //buscamos la venta por id
    const venta = await Venta.findByPk(id, {
      include: [DetalleVentaProducto,Abono],
    });

    //si la veta no existe mostranos un mensaje
    if (!venta) {
      return res.status(404).json({ error: 'Venta no encontrada.' });
    }

        // Verificar si hay abonos relacionados a la venta
        const abonosRelacionados = venta.Abonos;
        if (abonosRelacionados.length > 0) {
          return res.status(400).json({ error: 'No se puede cambiar el estado, hay abonos relacionados.' });
        }

    // Verificar si el nuevo estado es permitido para cambios
    if (!estadosPermitidos.includes(estado)) {
      return res.status(400).json({ error: 'No se permite cambiar a este estado.' });
    }

    // Verificar si la venta ya está en el nuevo estado
    if (venta.estado === estado) {
      return res.status(400).json({ error: 'La venta ya está en este estado.' });
    }

    //si el estado ya esta en false no se permite cambiar a tru de nuevo
    if (venta.estado === false && estado === true) {
      return res.status(400).json({ error: 'No se puede cambiar de false a true.' });
    }

    // Actualizar el estado
    await venta.update({ estado });

    // Si la venta se inactiva, revertir las cantidades de productos vendidos
    if (estado === false) {
      const detallesProductos = venta.DetalleVentaProductos;
      await Promise.all(
        detallesProductos.map(async (detalleProducto) => {
          const { idproducto, cantidadproducto } = detalleProducto;

          const producto = await Producto.findByPk(idproducto);
          if (producto) {
            const nuevaCantidad = producto.cantidad + cantidadproducto;
            await producto.update({ cantidad: nuevaCantidad });
          }
        })
      );
    }

    res.json({ message: 'Estado de venta actualizado exitosamente.' });
  }catch (error) {
    console.error('Error interno del servidor:', error);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
}

async function searchSale(req, res) {
  const { idcliente } = req.body;
  const valorBuscar = {};
  
  const validacionNumeroFactura = /^[0-9]+$/;
  
  if (idcliente) {
    // Validar que idcliente sea un valor numérico
    if (!validacionNumeroFactura.test(idcliente)) {
      return res.status(400).json({ error: "El idcliente debe ser un valor numérico." });
    }
  
    // Realizar la búsqueda por idcliente
    const clientesEncontrados = await Cliente.findAll({
      where: { idcliente },
    });
  
    if (clientesEncontrados.length === 0) {
      return res.status(404).json({ message: "No se encontraron clientes con el idcliente proporcionado." });
    }
  
    // Establecer idcliente para la búsqueda
    valorBuscar.idcliente = idcliente;
  }
  
  try {
    const venta = await Venta.findAll({
      where: valorBuscar,
    });
  
    if (venta.length === 0) {
      return res.status(404).json({ message: "No se encontraron ventas con los parámetros proporcionados." });
    }
  
    res.json(venta);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error al buscar la venta." });
  }
}

async function abonosRelacionados(req, res) {
  const { id } = req.params;

  try {
    // Buscamos la venta por ID
    const venta = await Venta.findByPk(id);

    // Si la venta no existe, retornamos un mensaje de error
    if (!venta) {
      return res.status(404).json({ error: 'Venta no encontrada.' });
    }

    // Verificamos si hay abonos relacionados a la venta
    const abonosRelacionados = await Abono.findAll({
      where: { idventa: id }
    });

    // Devolvemos los abonos directamente
    res.json(abonosRelacionados);
  } catch (error) {
    console.error('Error al verificar abonos relacionados:', error);
    res.status(500).json({ error: 'Error al verificar abonos relacionados.' });
  }
}

async function guardarObservacionVenta(req, res) {
  const { id } = req.params; // Obtén el ID de la venta de los parámetros de la solicitud
  const { observacion } = req.body; // Obtén la observación del cuerpo de la solicitud

  try {
    // Busca la venta por su ID
    const venta = await Venta.findByPk(id);

    // Si no se encuentra la venta, devuelve un error
    if (!venta) {
      return res.status(404).json({ error: 'Venta no encontrada.' });
    }

    // Guarda la observación en la venta
    venta.observacion = observacion;
    await venta.save();

    // Si la observación se guarda correctamente, devuelve una respuesta exitosa
    res.status(200).json({ message: 'Observación guardada correctamente.' });
  } catch (error) {
    // Si ocurre algún error, devuelve un error interno del servidor
    console.error('Error al guardar la observación de la venta:', error);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
}

module.exports = {
    getAllSales,
    getSaleById,
    createSale,
    updateSaleState,
    getActiveSales,
    getInactiveSales,
    searchSale,
    abonosRelacionados,
    guardarObservacionVenta

};
