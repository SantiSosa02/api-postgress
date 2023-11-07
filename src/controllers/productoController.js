// clienController.js
const  Producto  = require('../models/producto');  
const Categoria = require ('../models/categoria')

const getAllProducts = async (req, res)=>{
  try{
    const productos =  await Producto.findAll();

    if(productos.length === 0){
      return res.status(404).json({message: ' No hay productos registrados.'})
    }

    const productosConCategoria = await Promise.all(productos.map(async (producto) => {
      const categoria = await Categoria.findByPk(producto.idcategoria);
      return{
        idproducto: producto.idproducto,
        idcategoria: producto.idcategoria,
        nombre:producto.nombre,
        stock_minimo: producto.stock_minimo,
        cantidad:producto.cantidad,
        precio_venta: producto.precio_venta,
        estado:producto.estado,
        categoria: categoria ? categoria.nombre : null,
      };
    }));
    res.json(productosConCategoria);
  }catch(error){
    console.error('Error fetching productos:' , error);
    res.status(500).json({erro:'Internal server error'})
  }
}

// Obtener un producto por ID
async function getProductById(req, res) {
  const { id } = req.params;
  try {
    const producto = await Producto.findByPk(id);
    if (!producto) {
      return res.status(404).json({ error: 'Producto no encontrado.' });
    }
    res.json(producto);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el producto.' });
  }
}

const getActiveProducts = async (req, res) => {
  try {
    const productos = await Producto.findAll({ where: { estado: true } });

    if (productos.length === 0) {
      return res.status(404).json({ message: 'No hay productos activos.' });
    }

    const productosConCategoria = await Promise.all(productos.map(async (producto) => {
      const categoria = await Categoria.findByPk(producto.idcategoria);
      return {
        idproducto: producto.idproducto,
        idcategoria: producto.idcategoria,
        nombre: producto.nombre,
        stock_minimo: producto.stock_minimo,
        cantidad: producto.cantidad,
        precio_venta: producto.precio_venta,
        estado: producto.estado,
        categoria: categoria ? categoria.nombre : null,
      };
    }));

    res.json(productosConCategoria);
  } catch (error) {
    console.error('Error fetching active products:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}


const getInactiveProducts = async (req, res) => {
  try {
    const productos = await Producto.findAll({ where: { estado: false } });

    if (productos.length === 0) {
      return res.status(404).json({ message: 'No hay productos inactivos.' });
    }

    const productosConCategoria = await Promise.all(productos.map(async (producto) => {
      const categoria = await Categoria.findByPk(producto.idcategoria);
      return {
        idproducto: producto.idproducto,
        idcategoria: producto.idcategoria,
        nombre: producto.nombre,
        stock_minimo: producto.stock_minimo,
        cantidad: producto.cantidad,
        precio_venta: producto.precio_venta,
        estado: producto.estado,
        categoria: categoria ? categoria.nombre : null,
      };
    }));

    res.json(productosConCategoria);
  } catch (error) {
    console.error('Error fetching inactive products:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

async function createProduct(req, res) {
  const { nombre, idcategoria, stock_minimo, cantidad, precio_venta, estado } = req.body;

  const nombreValidacion = /^[a-zA-ZñÑ\s]+$/;
  const cantidadValidacion = /^[0-9]+/;

  if (!nombreValidacion.test(nombre)) {
    return res.status(400).json({ error: "El nombre solo puede contener letras." });
  }

  if (nombre.length > 100) {
    return res.status(400).json({ error: "El nombre excede la longitud máxima permitida (100 caracteres)." });
  }

  if (!cantidadValidacion.test(cantidad)) {
    return res.status(400).json({ error: "La cantidad solo permite números." });
  }

  if (!cantidadValidacion.test(stock_minimo)) {
    return res.status(400).json({ error: "El stock mínimo solo permite números." });
  }

  if (stock_minimo < 2) {
    return res.status(400).json({ error: "El stock mínimo no puede ser menor a 5." });
  }

  const nombreExistente = await Producto.findOne({ where: { nombre } });

  if (nombreExistente) {
    // El nombre ya existe, devuelve un error
    return res.status(400).json({ status: 'error', message: 'El nombre ya está en uso por otro producto.' });
  }

  try {
    const producto = await Producto.create({
      nombre,
      idcategoria,
      stock_minimo,
      cantidad,
      precio_venta,
      estado,
    });

    // Envía una respuesta JSON con el producto creado
    res.status(201).json({ status: 'success', message: 'Producto registrado exitosamente.', producto });
  } catch (error) {
    console.error('Error al crear el producto:', error);
    res.status(400).json({ status: 'error', message: 'Error al crear el producto' });
  }
}



async function updateProduct(req, res) {
  const { id } = req.params;
  const {  nombre, idcategoria, stock_minimo, cantidad, precio_venta, estado } = req.body;

  if( nombre.length > 100 ){
    return res.status(400).json({error: "El nombre excede la longitud mixima permitida '100' "})
  }

  try {
    const producto = await Producto.findByPk(id);

    if (!producto) {
      return res.status(404).json({ error: 'Producto no encontrado.' });
    }

    // Verifica si el nuevo nombre ya está en uso por otro producto
    if (nombre !== producto.nombre) {
      const existingProduct = await Producto.findOne({ where: { nombre } });
      if (existingProduct) {
        return res.status(400).json({ error: 'El nuevo nombre ya está en uso por otro producto.' });
      }
    }

    if (nombre) {
      producto.nombre = nombre;
    }

    if (idcategoria) {
      producto.idcategoria = idcategoria;
    }

    if (stock_minimo !== undefined) {
      producto.stock_minimo = stock_minimo;
    }

    if (cantidad !== undefined) {
      producto.cantidad = cantidad;
    }

    if (precio_venta !== undefined) {
      producto.precio_venta = precio_venta;
    }

    if (estado !== undefined) {
      producto.estado = estado;
    }

    await producto.save();

    res.json(producto);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el producto.' });
  }
}

async function deleteProduct(req, res) {
  const { id } = req.params;

  try{
    const producto= await Producto.findByPk(id);

    if(!producto){
      return res.status(404).json({error: "Producto no encontrado"})
    }

    await producto.destroy();


    res.status(204).send(producto);
  }catch(error){
    res.status(500).json({error : "Error al eliminar el producto."})
  }
}

async function updateProductState(req, res) {
  const { id } = req.params;
  const { estado } = req.body;

  try {
    const producto = await Producto.findByPk(id);

    if (!producto) {
      return res.status(404).json({ error: 'Producto no encontrado.' });
    }

    // Validar el estado
    if (typeof estado !== 'boolean') {
      return res.status(400).json({ error: 'El estado proporcionado no es válido.' });
    }

    // Si el estado es el mismo, no es necesario actualizar
    if (producto.estado === estado) {
      return res.json({ message: 'El estado del producto ya está actualizado.' });
    }

    // Actualizar el estado del cliente
    await producto.update({ estado });

    res.json({ message: 'Estado del producto actualizado exitosamente.' });
  } catch (error) {
    console.error('Error al actualizar el estado del producto:', error);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
}

async function searchProduct( req, res){
  const {nombre} = req.body;
  const valorBuscar={};

  const nombreValidacion= /^[a-zA-ZñÑ\s]+$/

  if(nombre){
  if(!nombreValidacion.test(nombre)){
    return res.status(400).json({error: "El nombre solo puede contener letras. "})
  }
  valorBuscar.nombre= nombre;
}

  try{

    const producto= await Producto.findAll({where: valorBuscar});
    if(producto.length === 0){
      return res.status(404).json({message:"No se encontraron productos con los parametros proporcionados" })
    }

    res.json(producto)
  }catch(error){
    console.log(error)
    res.status(500).json({error: "Error al buscar el producto"})
  }
}

async function verificarNombreExistente(req, res) {
  const { nombre } = req.query;

  try {
    const nombreExistente = await Producto.findOne({ where: { nombre } });
    res.json({ existe: !!nombreExistente }); // Devuelve un objeto con la propiedad 'existe'
  } catch (error) {
    console.error('Error al verificar el nombre:', error);
    res.status(500).json({ error: 'Error al verificar el correo.' });
  }
}


async function agregarCantidad(req, res) {
  const { id } = req.params;
  const { cantidadSumar } = req.body;

  try {
    // Busca el producto por su ID
    const producto = await Producto.findByPk(id);

    if (!producto) {
      return res.status(404).json({ error: 'Producto no encontrado.' });
    }

    // Verifica si la cantidad a sumar es un número positivo mayor o igual a 1
    const cantidadSumarNum = parseInt(cantidadSumar, 10);

    if (isNaN(cantidadSumarNum) || cantidadSumarNum < 1) {
      return res.status(400).json({ error: 'La cantidad a sumar debe ser un número positivo mayor o igual a 1.' });
    }

    // Suma la cantidad nueva a la cantidad existente
    producto.cantidad += cantidadSumarNum;

    // Guarda los cambios en la base de datos
    await producto.save();
    res.json({ message: 'Cantidad sumada exitosamente.', producto });

  } catch (error) {
    console.error('Error al sumar cantidad al producto:', error);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
}


async function getCantidadActual(req, res) {
  const { id } = req.params;
  try {
    const producto = await Producto.findByPk(id);
    if (!producto) {
      return res.status(404).json({ error: 'Producto no encontrado.' });
    }
    
    const cantidadActual = producto.cantidad;
    
    res.json( cantidadActual );
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el producto.' });
  }
}

module.exports = {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    updateProductState,
    getActiveProducts,
    getInactiveProducts,
    searchProduct,
    verificarNombreExistente,
    agregarCantidad,
    getCantidadActual
};
