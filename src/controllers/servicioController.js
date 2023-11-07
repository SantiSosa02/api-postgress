// categoryController.js
const  Servicio  = require('../models/servicio');  

const getAllServices = async (req, res) => {
  try {
    const servicios = await Servicio.findAll();  

    if (servicios.length === 0 ){
      return res.status(404).json({message: "No hay servicios registrados"})
    }
    res.json(servicios);
  } catch (error) {
    console.error('Error fetching services:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getActiveServices =  async (req, res) => {
  try{
     const servicios =  await Servicio.findAll({where : {estado: true}});

     if (servicios.length === 0 ){
      return res.status(400).json({error : "No hay servicio activos"});
     }
     res.json(servicios);
  }catch{
    console.error(error);
    res.status(500).json({error: "Error al obtener los servicios activos"})
  }
}

const getInactiveServices =  async (req, res) => {
  try{
     const servicios =  await Servicio.findAll({where : {estado:false}});

     if (servicios.length === 0 ){
      return res.status(400).json({error : "No hay servicio inactivos"});
     }
     res.json(servicios);
  }catch{
    res.status(500).json({error: "Error al obtener los servicios activos"})
  }
}

// Obtener un usuario por ID
async function getServiceById(req, res) {
  const { id } = req.params;
  try {
    const servicio = await Servicio.findByPk(id);
    if (!servicio) {
      return res.status(404).json({ error: 'Servicio no encontrado.' });
    }
    res.json(servicio);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el servicio.' });
  }
}

async function createService(req, res) {
  const { nombre, descripcion, estado  } = req.body;

  const validacion=/^[a-zA-Z]+(\s[a-zA-Z]+)?$/;

  if(!validacion.test(nombre)){
    return res.status(400).json({error: "El nombre solo puede contener letras."})
  }

  if( nombre.length > 100 ){
    return res.status(400).json({error: "El nombre excede la longitud mixima permitida '100' "})
  }

  if( descripcion.length > 100 ){
    return res.status(400).json({error: "La descripcion excede la longitud mixima permitida '100' "})
  }

  const nombreExistente= await Servicio.findOne({where: {nombre}});

  if(nombreExistente){
    return res.status(400).json({ error: "El nombre ya esta en uso."})
  }

  try {

    const servicio = await Servicio.create({ nombre, descripcion, estado   });

    res.status(201).json({ status: 'success', message: 'Categoría creada con éxito', servicio });

  } catch (error) {
    res.status(400).json({ error: 'Error al crear la categoria.' });
  }
}

async function updateService(req, res) {
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
    const servicio = await Servicio.findByPk(id);

    if(!servicio){
      return res.status(404).json({error: "Servicio no encontrado"});
    }

    if(nombre !== servicio.nombre){
      const existingNombre= await Servicio.findOne({where: {nombre}});
      if(existingNombre){
        return res.status(400).json({error:"El nuevo nombre ya esta en uso por otro servicio"});
      }
    }

    if(nombre){
      servicio.nombre = nombre;
    }

    if(descripcion){
      servicio.descripcion = descripcion;
    }

    if (estado !== undefined) {
      servicio.estado = estado;
    }

    await servicio.save();

    res.json(servicio);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el servicio.' });
  }
}

async function deleteService(req, res) {
  const { id } = req.params;

  try{
    const servicio = await Servicio.findByPk(id);

    if(!servicio){
      return res.status(404).json({error: "Servicio no encontrado"})
    }

    await servicio.destroy();

    res.status(204).send(servicio);
  }catch(error){
    res.status(500).json({error : "Error al eliminar el servicio."})
  }
}


async function updateServiceState(req, res) {
  const { id } = req.params;
  const { estado } = req.body;

  try {
    const servicio = await Servicio.findByPk(id);

    if (!servicio) {
      return res.status(404).json({ error: 'Servicio no encontrado.' });
    }

    // Validar el estado
    if (typeof estado !== 'boolean') {
      return res.status(400).json({ error: 'El estado proporcionado no es válido.' });
    }

    // Si el estado es el mismo, no es necesario actualizar
    if (servicio.estado === estado) {
      return res.json({ message: 'El estado del servicio ya está actualizado.' });
    }

    // Actualizar el estado del cliente
    await servicio.update({ estado });

  } catch (error) {
    console.error('Error al actualizar el estado del servicio:', error);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
}

async function searchService( req, res){
  const {nombre} = req.body;
  const valorBuscar={};

  const validacion=/^[a-zA-Z]+(\s[a-zA-Z]+)?$/;

if(nombre){
  if(!validacion.test(nombre)){
    return res.status(400).json({error: "El nombre solo puede contener letras."})
  }
  valorBuscar.nombre = nombre;
}

  try{

    const servicio= await Servicio.findAll({where: valorBuscar});
    if(servicio.length === 0){
      return res.status(404).json({error:"No se encontraron servicios con los parametros proporcionados" })
    }

    res.json(servicio)
  }catch(error){
    console.log(error)
    res.status(500).json({error: "Error al buscar el servicio"})
  }
}

async function verificarNombreExistente(req, res) {
  const { nombre } = req.query;

  try {
    const nombreExistente = await Servicio.findOne({ where: { nombre } });
    res.json({ existe: !!nombreExistente }); // Devuelve un objeto con la propiedad 'existe'
  } catch (error) {
    console.error('Error al verificar el nombre:', error);
    res.status(500).json({ error: 'Error al verificar el correo.' });
  }
}

module.exports = {
   getAllServices,
   getServiceById,
   createService,
   updateService,
   deleteService,
   updateServiceState,
   getActiveServices,
   getInactiveServices,
   searchService,
   verificarNombreExistente
};
