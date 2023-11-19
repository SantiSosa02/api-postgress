// clienController.js
const  Cliente  = require('../models/cliente');  

const getAllClients = async (req, res) => {
  try {
    const clientes = await Cliente.findAll();  

    if (clientes.length === 0 ){
      return res.status(404).json({message: "No hay clientes registrados"})
    }
    res.json(clientes);
  } catch (error) {
    console.error('Error fetching clients:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Obtener un cliente por ID
async function getClientById(req, res) {
  const { id } = req.params;
  try {
    const cliente = await Cliente.findByPk(id);
    if (!cliente) {
      return res.status(404).json({ error: 'Cliente no encontrado.' });
    }
    res.json(cliente);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el cliente.' });
  }
}

const getActiveClients =  async (req, res) => {
  try{
     const clientes =  await Cliente.findAll({where : {estado: true}});

     if (clientes.length === 0 ){
      return res.status(400).json({error : "No hay clientes activos"});
     }
     res.json(clientes);
  }catch{
    console.error(error);
    res.status(500).json({error: "Error al obtener los clientes activos"})
  }
}

const getInactiveClients =  async (req, res) => {
  try{
     const clientes =  await Cliente.findAll({where : {estado: false}});

     if (clientes.length === 0 ){
      return res.status(400).json({error : "No hay clientes inactivos"});
     }
     res.json(clientes);
  }catch{
    console.error(error);
    res.status(500).json({error: "Error al obtener los clientes inactivos"})
  }
}

async function createClient(req, res) {
  const { nombre, apellido, telefono, correo, estado  } = req.body;

   const validacion=/^[a-zA-ZñÑáéíóúÁÉÍÓÚ\s]+$/;
   const validacionTelefono=  /^[1-9][0-9]{9}$/;
   const validacionCorreo= /^[a-zA-Z0-9._%-ñÑáéíóúÁÉÍÓÚ]+@[a-zA-Z0-9.-]+\.(com|co|org|net|edu)$/;

  if(!validacion.test(nombre)){
    return res.status(400).json({error: "El nombre solo puede contener letras."})
  }

  if(nombre > 50){
    return res.status(400).json({error: "El nombre no puedo puede superar los 50 caracteres."})
  }

  if(!validacion.test(apellido)){
    return res.status(400).json({error: "El apellido solo puede contener letras."})
  }

  if(apellido > 50){
    return res.status(400).json({error: "El apellido no puedo puede superar los 50 caracteres."})
  }


  if(!validacionTelefono.test(telefono)){
    return res.status(400).json({error: "El telefono debe tener exactamente 10 dígitos."})
  }

  if(!validacionCorreo.test(correo)){
    return res.status(400).json({error: "El correo debe tener una estructura válida (usuario123@dominio.com)."})
  }

  if(correo > 100){
    return res.status(400).json({error: "El correo no puedo puede superar los 100 caracteres."})
  }


  const correoExistente= await Cliente.findOne({where: {correo}});

  if(correoExistente){
    return res.status(400).json({ error: "El correo ya esta en uso."})
  }

  const telefonoExistente = await Cliente.findOne({where: {telefono:telefono.toString()}});

  if(telefonoExistente){
    return res.status(400).json({error: "El telefono ya esta en uso"})
  }

  try {

    const cliente = await Cliente.create({ nombre, apellido, telefono, correo, estado   });
    // Devuelve una respuesta exitosa
    res.status(201).json({ status: 'success', message: 'Cliente creado con éxito', cliente });
  } catch (error) {
    // Manejar errores en la creación de categoría
    console.error('Error al crear la categoría:', error);
    res.status(500).json({ error: 'Error al crear el cliente.' });
  }
}

async function updateClient(req, res) {
  const { id } = req.params;
  const { nombre, apellido, telefono, correo, estado } = req.body;

  if (!id) {
    return res.status(400).json({ error: 'Falta el ID del cliente en la solicitud.' });
  }

  const validacion =/^[a-zA-ZñÑáéíóúÁÉÍÓÚ\s]+$/;

  if (!validacion.test(nombre)) {
    return res.status(400).json({ error: 'El nombre solo puede contener letras.' });
  }

  if (!validacion.test(apellido)) {
    return res.status(400).json({ error: 'El apellido solo puede contener letras.' });
  }

  if (nombre.length > 100) {
    return res.status(400).json({ error: 'El nombre excede la longitud máxima permitida (100 caracteres).' });
  }

  if (apellido.length > 100) {
    return res.status(400).json({ error: 'El apellido excede la longitud máxima permitida (100 caracteres).' });
  }

  try {
    const cliente = await Cliente.findByPk(id);

    if (!cliente) {
      return res.status(404).json({ error: 'Cliente no encontrado.' });
    }

    if (correo !== cliente.correo) {
      const existingCorreo = await Cliente.findOne({ where: { correo } });
      if (existingCorreo) {
        return res.status(400).json({ error: 'El nuevo correo ya está en uso.' });
      }
    }

    if (telefono !== cliente.telefono) {
      const existingTelefono = await Cliente.findOne({ where: { telefono } });
      if (existingTelefono) {
        return res.status(400).json({ error: 'El nuevo teléfono ya está en uso.' });
      }
    }

    // Actualiza los campos del cliente
    if (nombre) {
      cliente.nombre = nombre;
    }

    if (apellido) {
      cliente.apellido = apellido;
    }

    if (correo) {
      cliente.correo = correo;
    }

    if (telefono) {
      cliente.telefono = telefono;
    }

    if (estado !== undefined) {
      cliente.estado = estado;
    }

    await cliente.save();

    res.json(cliente);
  } catch (error) {
    console.error('Error al actualizar el cliente:', error);
    res.status(500).json({ error: 'Error interno del servidor al actualizar el cliente.' });
  }
}

async function deleteClient(req, res) {
  const { id } = req.params;

  try{
    const cliente= await Cliente.findByPk(id);

    if(!cliente){
      return res.status(404).json({error: "Cliente no encontrado"})
    }

    await cliente.destroy();


    res.status(204).send(cliente);
  }catch(error){
    res.status(500).json({error : "Error al eliminar el cliente."})
  }
}


async function updateClientState(req, res) {
  const { id } = req.params;
  const { estado } = req.body;

  try {
    const cliente = await Cliente.findByPk(id);

    if (!cliente) {
      return res.status(404).json({ error: 'Cliente no encontrado.' });
    }

    // Validar el estado
    if (typeof estado !== 'boolean') {
      return res.status(400).json({ error: 'El estado proporcionado no es válido.' });
    }

    // Si el estado es el mismo, no es necesario actualizar
    if (cliente.estado === estado) {
      return res.json({ message: 'El estado del cliente ya está actualizado.' });
    }

    // Actualizar el estado del cliente
    await cliente.update({ estado });

    res.json({ message: 'Estado del cliente actualizado exitosamente.' });
  } catch (error) {
    console.error('Error al actualizar el estado del cliente:', error);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
}

async function searchClient( req, res){
  const {nombre, apellido, telefono, correo} = req.body;
  const valorBuscar={};

  const validacion=/^[a-zA-Z]+(\s[a-zA-Z]+)?$/;
  const validacionCorreo=/^([a-zA-Z][a-zA-Z0-9._%-]*)@[a-zA-Z0-9.-]+\.(com|co|org)$/;
  const validacionTelefono=/^\d{10}$/

if(nombre){
  if(!validacion.test(nombre)){
    return res.status(400).json({error: "El nombre solo puede contener letras."})
  }
  valorBuscar.nombre= nombre;
}

if(apellido){
  if(!validacion.test(apellido)){
    return res.status(400).json({error: "El apellido solo puede contener letras."})
  }
  valorBuscar.apellido= apellido;
}

if(correo){
  if(!validacionCorreo.test(correo)){
    return res.status(500).json({error: "El correo debe una estructura, ejemplo usuario123@dominio.com,mi.correo@dominio.co "})
  }
  valorBuscar.correo= correo;
}

if(telefono){
  if(!validacionTelefono.test(telefono)){
    return res.status(500).json({error: "El telefono solo puede contener numero, maximo 10"});
  }
  valorBuscar.telefono= telefono;
}

  try{

    const cliente= await Cliente.findAll({where: valorBuscar});
    if(cliente.length === 0){
      return res.status(404).json({message:"No se encontraron clientes con los parametros proporcionados" })
    }

    res.json(cliente)
  }catch(error){
    console.log(error)
    res.status(500).json({error: "Error al buscar el cliente"})
  }
}

async function verificarCorreoExistente(req, res) {
  const { correo } = req.query;

  try {
    const correoExistente = await Cliente.findOne({ where: { correo } });
    res.json({ existe: !!correoExistente }); // Devuelve un objeto con la propiedad 'existe'
  } catch (error) {
    console.error('Error al verificar el correo:', error);
    res.status(500).json({ error: 'Error al verificar el correo.' });
  }
}


async function verificarTelefonoExistente(req, res) {
  const { telefono } = req.query;

  try {
    const telefonoExistente = await Cliente.findOne({ where: { telefono } });
    res.json({ existe: !!telefonoExistente }); // Devuelve un objeto con la propiedad 'existe'
  } catch (error) {
    console.error('Error al verificar el correo:', error);
    res.status(500).json({ error: 'Error al verificar el correo.' });
  }
}

module.exports = {
getAllClients,
getClientById,
createClient,
updateClient,
deleteClient,
updateClientState,
getActiveClients,
getInactiveClients,
searchClient,
verificarCorreoExistente,
verificarTelefonoExistente

};
