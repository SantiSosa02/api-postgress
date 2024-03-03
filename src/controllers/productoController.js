// clienController.js
const  Producto  = require('../models/producto');  
const Categoria = require ('../models/categoria')

const getAllProducts = async (req, res) => {
  try {
    const productos = await Producto.findAll();  

    if (productos.length === 0 ){
      return res.status(404).json({message: "No hay prodcutos registrados"})
    }
    res.json(productos);
  } catch (error) {
    console.error('Error fetching services:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

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

const getActiveProducts =  async (req, res) => {
  try{
     const productos =  await Producto.findAll({where : {estado: true}});

     if (productos.length === 0 ){
      return res.status(500).json({error : "No hay productos activos"});
     }
     res.json(productos);
  }catch{
    console.error(error);
    res.status(500).json({error: "Error al obtener los productos activos"})
  }
}


const getInactiveProducts =  async (req, res) => {
  try{
     const productos =  await Producto.findAll({where : {estado: false}});

     if (productos.length === 0 ){
      return res.status(400).json({error : "No hay productos inactivos"});
     }
     res.json(productos);
  }catch{
    console.error(error);
    res.status(500).json({error: "Error al obtener los productos inactivos"})
  }
}

async function createProduct(req, res) {
  const { nombre, idcategoria, stock_minimo, cantidad, precio_venta, estado } = req.body;

  const nombreValidacion = /^[a-zA-ZñÑáéíóúÁÉÍÓÚ0-9\s]+$/;;
  const cantidadValidacion = /^[0-9]+/;

  if (!nombreValidacion.test(nombre)) {
    return res.status(400).json({ error: "El nombre solo acepta letras, espacios, números y letras con acentos (á, é, í, ó, ú)." });
  }

  if (nombre.length > 50) {
    return res.status(400).json({ error: "El nombre excede la longitud máxima permitida (50 caracteres)." });
  }

  if (!cantidadValidacion.test(cantidad)) {
    return res.status(400).json({ error: "La cantidad solo permite números." });
  }

  if (!cantidadValidacion.test(stock_minimo)) {
    return res.status(400).json({ error: "El stock mínimo solo permite números." });
  }

  if (stock_minimo < 1) {
    return res.status(400).json({ error: "El stock mínimo no puede ser menor a 1." });
  }

  if (cantidad < 1 || cantidad > 100) {
    return res.status(400).json({ error: "La cantidad mínimo no puede ser menor a 1 ni mayor a 100" });
  }

  if (stock_minimo > 50) {
    return res.status(400).json({ error: "El stock mínimo no puede ser mayor a 50." });
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

async function getProductosByCategoria(req, res) {
  const { idcategoria } = req.params;

  try {
    // Busca los productos que tienen la categoría correspondiente y estado activo
    const productos = await Producto.findAll({
      where: {
        idcategoria: idcategoria,
        estado: true // Ajusta esto según la estructura de tu modelo y el valor booleano para el estado activo
      }
    });

    if (productos.length === 0) {
      return res.status(404).json({ message: 'No hay productos activos en esta categoría.' });
    }

    res.json(productos);
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
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
    getCantidadActual,
    getProductosByCategoria
};
