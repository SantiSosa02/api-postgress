// categoryController.js
const  Venta  = require('../models/venta');  
const  DetalleVentaProducto = require ('../models/detalleventaproducto');
const  DetalleVentaServicio = require ('../models/detalleventaservicio');
const Producto = require ('../models/producto')

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
  const { idcliente, numerofactura, fecha, metodopago, valortotal, estado, detalleProductos, detalleServicios } = req.body;

  const validacionNumeroFactura = /^[0-9]+$/;

  //definimos los metodos de pago 
  const metodos_pago = ["Efectivo", "Transferencia bancaria"];

  //validamos que se coloque un metodo de pago que este definido
  if (!metodos_pago.includes(metodopago)) {
    return res.status(400).json({ error: "Los métodos de pago son: Efectivo, Tarjeta de crédito, Transferencia bancaria" });
  }

  if(!validacionNumeroFactura.test(numerofactura)){
    return res.status(400).json({ error: "El numero de factura solo acepta valores numericos"});
  }

  //definimo una variable para verificar que el neumero de la factura no exista 
  const numero_factura_existente = await Venta.findOne({ where: { numerofactura } });

  //si el numero de factura existe mostramos un mensaje
  if (numero_factura_existente) {
    return res.status(400).json({ error: "El número de factura ya existe." });
  }

  try {
    
    //creamos la variable para poder obtener el valor total de la venta
    let valortotal_venta = 0;  

    // Calcular valortotal_venta sumando los valores de los productos
    for (const detalleProducto of detalleProductos) {
      const producto = await Producto.findByPk(detalleProducto.idproducto);
      if (!producto) {
        return res.status(404).json({ error: `Producto con ID ${detalleProducto.idproducto} no encontrado.` });
      }

      //validamos que la cantidad a vender no sea mayor a la cantidad de existencias 
      if (detalleProducto.cantidadproducto > producto.cantidad) {
        return res.status(400).json({ error: "No hay suficientes unidades" });
      }

      // Calcular el precio del producto en detalleProducto
      const precio_producto = detalleProducto.cantidadproducto * producto.precio_venta;

      // Sumar al valortotal_venta
      valortotal_venta += precio_producto;

      // Restar la cantidad vendida al producto
      const nuevaCantidad = producto.cantidad - detalleProducto.cantidadproducto;

      // Asegúrate de que la cantidad no sea negativa
      if (nuevaCantidad < 0) {
        return res.status(400).json({ error: "No hay suficientes unidades" });
      }

      //actualizamos la cantidad en la tabla de productos , restando la cantidad que se coloco en la venta
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
      fecha:fechaActual,
      metodopago,
      valortotal: valortotal_venta,
      estado
    });

    // Crear detalles de productos
    await Promise.all(
      detalleProductos.map(async (detalleProducto) => {
        const validacion_cantidad = /^[0-9]+$/;

        if (!validacion_cantidad.test(detalleProducto.cantidadproducto)) {
          return res.status(400).json({ error: "La cantidad del producto solo acepta valores numéricos" });
        }

        // Obtener el producto asociado al detalle
        const producto = await Producto.findByPk(detalleProducto.idproducto);
        if (!producto) {
          return res.status(404).json({ error: `Producto con ID ${detalleProducto.idproducto} no encontrado.` });
        }

        // Crear el detalle de venta de producto asociado a la venta
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
        if (detalleServicio.descripcion.length > 100) {
          return res.status(400).json({ error: "La descripción excede la longitud máxima permitida (100)" });
        }
        await DetalleVentaServicio.create({
          idventa: venta.idventa,
          idservicio: detalleServicio.idservicio,
          precio: detalleServicio.precio,
          descripcion: detalleServicio.descripcion
        });
      })
    );

    res.status(201).json({ venta, detalleProductos, detalleServicios });
  } catch (error) {
    console.error('Error al crear la venta:', error);
    res.status(400).json({ error: 'Error al crear la venta.' });
  }
}

//actualizar el estado de la venta 
async function updateSaleState(req, res) {
  const { id } = req.params;
  const { estado } = req.body;


  try {

    //buscamos la venta por id
    const venta = await Venta.findByPk(id, {
      include: [DetalleVentaProducto],
    });

    //si la veta no existe mostranos un mensaje
    if (!venta) {
      return res.status(404).json({ error: 'Venta no encontrada.' });
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
  } catch (error) {
    console.error('Error al actualizar el estado de la venta:', error);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
}

async function searchSale( req, res){

  const {numerofactura, metodopago} = req.body;
  const valorBuscar={};

  //definimos los metodos de pago 
  const metodos_pago = ["Efectivo", "Tarjeta de crédito", "Transferencia bancaria"];
  const validacionNumeroFactura = /^[0-9]+$/;

  if (metodopago) {
    if (!metodos_pago.includes(metodopago)) {
      return res.status(400).json({ error: "Los métodos de pago son: Efectivo, Tarjeta de crédito, Transferencia bancaria" });
    }
    valorBuscar.metodopago = metodopago;
  }

  // Validamos que si se proporciona un número de factura, este sea numérico
  if (numerofactura) {
    if (!validacionNumeroFactura.test(numerofactura)) {
      return res.status(400).json({ error: "El número de factura solo acepta valores numéricos." });
    }
    valorBuscar.numerofactura = numerofactura;
  }

  try{

    const venta= await Venta.findAll({ include:[
      DetalleVentaProducto, DetalleVentaServicio],
       where: valorBuscar});

    if(!venta){
      return res.status(404).json({message:"No se encontraron ventas con los parametros proporcionados" })
    }

    res.json(venta)
  }catch(error){
    console.log(error)
    res.status(500).json({error: "Error al buscar la venta"})
  }
}


module.exports = {
    getAllSales,
    getSaleById,
    createSale,
    updateSaleState,
    getActiveSales,
    getInactiveSales,
    searchSale
};
