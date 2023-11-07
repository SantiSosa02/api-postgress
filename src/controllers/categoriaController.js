// categoryController.js
const  Categoria  = require('../models/categoria');  


//otenemos todas las categorias
const getAllCategories = async (req, res) => {
  try {
    const categorias = await Categoria.findAll();  

    if (categorias.length === 0 ){
      return res.status(404).json({message: "No hay categorias registradas"})
    }
    res.json(categorias);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Obtenemos ctageorias por id
async function getCategoryById(req, res) {
  const { id } = req.params;
  try {
    const categoria = await Categoria.findByPk(id);
    if (!categoria) {
      return res.status(404).json({ error: 'Categoria no encontrada.' });
    }
    res.json(categoria);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener la categoria.' });
  }
}

const getActiveCategory =  async (req, res) => {
  try{
     const categorias =  await Categoria.findAll({where : {estado: true}});

     if (categorias.length === 0 ){
      return res.status(400).json({error : "No hay categorias activas"});
     }
     res.json(categorias);
  }catch{
    console.error(error);
    res.status(500).json({error: "Error al obtener las categorias activas"})
  }
}

const getInactiveCategory =  async (req, res) => {
  try{
     const categorias =  await Categoria.findAll({where : {estado: false}});

     if (categorias.length === 0 ){
      return res.status(400).json({error : "No hay categorias inactivas"});
     }
     res.json(categorias);
  }catch{
    console.error(error);
    res.status(500).json({error: "Error al obtener las categorias inactivas"})
  }
}

//creamos una cateoria
async function createCategory(req, res) {
  const { nombre, descripcion, estado } = req.body;

  // Expresión regular para validar el nombre
  const validacion = /^[a-zA-Z]+(\s[a-zA-Z]+)?$/;

  // Validamos que el nombre cumpla con la expresión regular
  if (!validacion.test(nombre)) {
    return res.status(400).json({ error: "El nombre solo puede contener letras." });
  }

  if (nombre.length > 100) {
    return res.status(400).json({ error: "El nombre excede la longitud máxima permitida '100' " });
  }

  if (descripcion && descripcion.length > 100) {
    return res.status(400).json({ error: "La descripción excede la longitud máxima permitida '100' " });
  }

  // Verificar si el nombre de la categoría ya existe
  const nombreExistente = await Categoria.findOne({ where: { nombre } });

  if (nombreExistente) {
    return res.status(400).json({ error: 'El nombre ya está en uso por otra categoría.' });
  }

  try {
    // Si el nombre no existe, intenta crear la categoría
    const categoria = await Categoria.create({ nombre, descripcion, estado });

    // Devuelve una respuesta exitosa
    res.status(201).json({ status: 'success', message: 'Categoría creada con éxito', categoria });
  } catch (error) {
    // Manejar errores en la creación de categoría
    console.error('Error al crear la categoría:', error);
    res.status(500).json({ error: 'Error al crear la categoría.' });
  }
}


//actualizamos la categoria
async function updateCategory(req, res) {
  const { id } = req.params;
  const { nombre, descripcion, estado } = req.body;

  const validacion=/^[a-zA-Z]+(\s[a-zA-Z]+)?$/;

  if(!validacion.test(nombre)){
    return res.status(400).json({error: "El nombre solo puede contener letras."})
  }
  if( nombre.length > 100 ){
    return res.status(400).json({error: "El nombre excede la longitud mixima permitida '100' "})
  }

  try {
    const categoria = await Categoria.findByPk(id);

    if(!categoria){
      return res.status(404).json({error: "Categoria no encontrada"});
    }

    if(nombre !== categoria.nombre){
      const existingCategory = await Categoria.findOne({where: {nombre}})
      if(existingCategory){
        return res.status(400).json({error: "El nuevo ya esta en uso."})
      }
    }

    if(nombre){
      categoria.nombre = nombre;
    }

    if(descripcion){
      categoria.descripcion = descripcion;
    }

    if (estado !== undefined) {
      categoria.estado = estado;
    }

    await categoria.save();

    res.json(categoria);
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Error al actualizar la categoria.' });
  }
}


//eliminamos la categoria
async function deleteCategory(req, res) {
  const { id } = req.params;

  try{
    const categoria= await Categoria.findByPk(id);

    if(!categoria){
      return res.status(404).json({error: "Categoria no encontrada"})
    }

    await category.destroy();

    res.status(204).send(categoria);
  }catch(error){
    res.status(500).json({error : "Error al eliminar la categoria."})
  }
}


//actualiamos la categoria 
async function updateCategoryState(req, res) {
  const { id } = req.params;
  const { estado } = req.body;

  try {
    const categoria = await Categoria.findByPk(id);

    if (!categoria) {
      return res.status(404).json({ error: 'Categoria no encontrada.' });
    }

    // Validar el estado
    if (typeof estado !== 'boolean') {
      return res.status(400).json({ error: 'El estado proporcionado no es válido.' });
    }

    // Si el estado es el mismo, no es necesario actualizar
    if (categoria.estado === estado) {
      return res.json({ message: 'El estado de la categoria ya está actualizado.' });
    }

    // Actualizar el estado del cliente
    await categoria.update({ estado });

    res.status(201).json({ status: 'success', message: 'Categoria actualizada exitosamente.', categoria })
  } catch (error) {
    console.error('Error al actualizar el estado de la categoria:', error);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
}

async function searchCategory( req, res){
  const {nombre} = req.body;
  const valorBuscar={};

   //cremamos una validacion con epresion regaular
   const validacion=/^[a-zA-Z]+(\s[a-zA-Z]+)?$/;

 if(nombre){
   if(!validacion.test(nombre)){
     return res.status(400).json({error: "El nombre solo puede contener letras."})
   }
   valorBuscar.nombre= nombre;
  }

  try{

    const categoria= await Categoria.findAll({where: valorBuscar});
    if(categoria.length === 0){
      return res.status(404).json({message:"No se encontraron categorias con los parametros proporcionados" })
    }

    res.json(categoria)
  }catch(error){
    console.log(error)
    res.status(500).json({error: "Error al buscar la categoria"})
  }
}

async function verificarNombreExistente(req, res) {
  const { nombre } = req.query;

  try {
    const nombreExistente = await Categoria.findOne({ where: { nombre } });
    res.json({ existe: !!nombreExistente }); // Devuelve un objeto con la propiedad 'existe'
  } catch (error) {
    console.error('Error al verificar el nombre:', error);
    res.status(500).json({ error: 'Error al verificar el correo.' });
  }
}

module.exports = {
    getAllCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory,
    updateCategoryState,
    getActiveCategory,
    getInactiveCategory,
    searchCategory,
    verificarNombreExistente
};
