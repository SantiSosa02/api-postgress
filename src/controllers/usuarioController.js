// userController.js
const  Usuario  = require('../models/usuario'); 
const nodemailer = require ('nodemailer') ;
const jwt = require ('jsonwebtoken');
const bcrypt = require('bcrypt');
const { generarJWT } = require('../helpers/generar-jwt');


const getAllUsers = async (req, res) => {
  try {
    const usuarios = await Usuario.findAll();  // Aquí es donde se produce el error

    if (usuarios.length === 0 ){

    }
    res.json(usuarios);
  } catch (error) {
    console.error('Error fetching usuarios:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Obtener un usuario por ID
async function getUserById(req, res) {
  const { id } = req.params;
  try {
    const usuario = await Usuario.findByPk(id);
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado.' });
    }
    res.json(usuario);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el usuario.' });
  }
}

const getActiveUsers =  async (req, res) => {
  try{
     const usuarios =  await Usuario.findAll({where : {estado: true}});

     if (usuarios.length === 0 ){
      return res.status(400).json({error : "No hay usuarios activos"});
     }
     res.json(usuarios);
  }catch{
    console.error(error);
    res.status(500).json({error: "Error al obtener los usuarios activos"})
  }
}

const getInactiveUsers =  async (req, res) => {
  try{
     const usuarios =  await Usuario.findAll({where : {estado: false}});

     if (usuarios.length === 0 ){
      return res.status(400).json({error : "No hay usuarios inactivos"});
     }
     res.json(usuarios);
  }catch{
    console.error(error);
    res.status(500).json({error: "Error al obtener los usuarios inactivos"})
  }
}

async function createUser(req, res) {
  const { nombre, apellido, correo, contrasena, estado } = req.body;

  const validacion = /^[a-zA-ZñÑáéíóúÁÉÍÓÚ\s]+$/;
  const validacionCorreo = /^[a-zA-Z0-9._%-ñÑáéíóúÁÉÍÓÚ]+@[a-zA-Z0-9.-]+\.(com|co|org|net|edu)$/;

  if (!validacion.test(nombre)) {
    return res.status(400).json({ error: "El nombre solo puede contener letras." });
  }

  if (!validacion.test(apellido)) {
    return res.status(400).json({ error: "El apellido solo puede contener letras." });
  }

  if (!validacionCorreo.test(correo)) {
    return res.status(400).json({ error: "El correo debe tener una estructura válida." });
  }

  if (nombre.length > 100) {
    return res.status(400).json({ error: "El nombre excede la longitud máxima permitida '100' " });
  }

  if (apellido.length > 100) {
    return res.status(400).json({ error: "El apellido excede la longitud máxima permitida '100' " });
  }

  const usuarioExistente = await Usuario.findOne({ where: { correo } });

  if (usuarioExistente) {
    // El correo ya existe, devuelve un error
    return res.json({ status: 'error', message: 'El correo ya está en uso por otro usuario.' });
  }

  try {

    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);

    // Aplica un hash a la contraseña con el salt
    const hash = bcrypt.hashSync(contrasena, salt);
    // Si el correo no existe, intenta crear el usuario
    const usuario = await Usuario.create({ nombre, apellido, correo, contrasena:hash, salt, estado });
  
    // Devuelve una respuesta exitosa
    res.status(201).json({ status: 'success', message: 'Registro exitoso', usuario });
  } catch (error) {
    // Resto del código para manejar errores
  }
}


async function updateUser(req, res) {
  const { id } = req.params;
  const { nombre, apellido, correo, contrasena, estado } = req.body;

  const validacion= /^[a-zA-ZñÑáéíóúÁÉÍÓÚ\s]+$/;
  const validacionCorreo=/^[a-zA-Z0-9._%-ñÑáéíóúÁÉÍÓÚ]+@[a-zA-Z0-9.-]+\.(com|co|org|net|edu)$/;

  if(!validacion.test(nombre)){
    return res.status(400).json({error: "El nombre solo puede contener letras."})
  }

  if(!validacion.test(apellido)){
    return res.status(400).json({error: "El apellido solo puede contener letras."})
  }

  try {
    const usuario = await Usuario.findByPk(id);

    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado.' });
    }

      // Actualiza solo el campo nombre si se proporciona un nuevo valor
      if (nombre) {
        usuario.nombre = nombre;
      }
  
      // Actualiza otros campos si se proporcionan nuevos valores
      if (apellido) {
        usuario.apellido = apellido;
      }
  
      if (correo !== undefined) {
        // Se proporcionó un valor para 'correo', entonces realizamos la validación.
        if (correo !== usuario.correo) {
          const existingUser = await Usuario.findOne({ where: { correo } });
          if (existingUser) {
            return res.status(400).json({ error: 'El nuevo correo ya está en uso por otro usuario.' });
          }
          if (!validacionCorreo.test(correo)) {
            return res.status(400).json({ error: "El correo debe tener una estructura válida." });
          }
          usuario.correo = correo;
        }
      }
      
  
      if (contrasena) {
        usuario.contrasena = contrasena;
      }
  
      if (estado !== undefined) {
        usuario.estado = estado;
      }
  
      // Guarda los cambios
      await usuario.save();
    
    res.json(usuario);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Error al actualizar el usuario.' });
  }
}

async function deleteUser(req, res) {
  const { id } = req.params;

  try{
    const usuario= await Usuario.findByPk(id);

    if(!usuario){
      return res.status(404).json({error: "Usuario no encontrado"})
    }

    await usuario.destroy();


    res.status(204).send(usuario);
  }catch(error){
    res.status(500).json({error : "Error al eliminar el usuario."})
  }
}

async function loginUser(req, res) {
  const { correo, contrasena } = req.body;

  try {
    const usuario = await Usuario.findOne({ where: { correo } });

    if (!usuario) {
      return res.status(401).json({ error: "Credenciales incorrectas." });
    }

    if (usuario.estado === false) {
      return res.status(400).json({ error: "El usuario está inactivo." });
    }

    // Compara la contraseña proporcionada con la contraseña almacenada en la base de datos
    const isPasswordValid = await bcrypt.compare(contrasena, usuario.contrasena);

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Credenciales incorrectas." });
    }

    const token  =await generarJWT(usuario.id)

    res.json({
      message: "Inicio de sesión exitoso.",
      usuario,
      token
    });

  } catch (error) {
    console.error("Error al iniciar sesión: ", error);
    res.status(500).json({ error: "Error al iniciar sesión." });
  }
}


async function updateUserState(req, res) {
  const { id } = req.params;
  const { estado } = req.body;

  try {
    const usuario = await Usuario.findByPk(id);

    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado.' });
    }

    // Validar el estado
    if (typeof estado !== 'boolean') {
      return res.status(400).json({ error: 'El estado proporcionado no es válido.' });
    }

    // Actualizar el estado del clientehuser
    await usuario.update({ estado });

    res.json({ message: 'Estado del usuario actualizado exitosamente.' });
  } catch (error) {
    console.error('Error al actualizar el estado del usuario:', error);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
}

function generateResetToken() {
  // Implementa la generación de un token único aquí
  // Puedes utilizar alguna librería para generar tokens o implementar tu propia lógica
  // Por ejemplo, puedes generar un token aleatorio de longitud 20
  const token = Math.random().toString(36).substring(2, 12) + Math.random().toString(36).substring(2, 12);
  return token;
}

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'visor6183@gmail.com',
    pass: 'xawg nhbz zesd spwf'
  }
});

async function sendEmail(correo, mailOptions) {
  try {
    // Verifica si el usuario con el correo proporcionado existe
    const usuario = await Usuario.findOne({ where: { correo } });

    if (!usuario) {
      return { success: false, message: 'Usuario no encontrado.' };
    }
    const resetToken = generateResetToken();

    await transporter.sendMail(mailOptions);

    return { success: true, message: 'Se ha enviado un enlace para restablecer la contraseña por correo electrónico.' };
  } catch (error) {
    console.error('Error al recuperar la contraseña:', error);
    return { success: false, message: 'Error al recuperar la contraseña.' };
  }
}

let resetTokens = {}; 

async function forgotPassword(req, res) {
  const { correo } = req.body;

  try {
    // Busca al usuario por el correo proporcionado
    const usuario = await Usuario.findOne({ where: { correo } });

    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado.' });
    }

    // Genera un token único para el restablecimiento de contraseña
    const resetToken = generateResetToken();

    // Almacena el token en la variable temporalt
    resetTokens[resetToken] = usuario;

    // Construye el objeto mailOptions con la información necesaria, incluyendo el token en el enlace
    const mailOptions = {
      from: 'visor6183@gmail.com',
      to: correo,
      subject: 'Recuperación de Contraseña',
      text: `Haga clic en el siguiente enlace para restablecer su contraseña: https://proyecto-visor.web.app/#/cambiar-contrasena/${resetToken}`,
    };

    // Enviar correo con el enlace de restablecimiento de contraseña
    await sendEmail(correo, mailOptions);

    res.json({ message: 'Se ha enviado un enlace para restablecer la contraseña por correo electrónico.' });
  } catch (error) {
    console.error('Error al recuperar la contraseña:', error);
    res.status(500).json({ error: 'Error al recuperar la contraseña.' });
  }
}

async function changePassword(req, res) {
  const { token } = req.params
  const { newPassword } = req.body;

  try {
    
    // Busca al usuario por el token de reseteo
    const usuario = resetTokens[token];

    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado.' });
    }

    const saltRounds = 10;
    const hashedPassword = bcrypt.hashSync(newPassword, saltRounds);

    // Actualiza la contraseña
    usuario.contrasena = hashedPassword;
    await usuario.save();

    // Elimina el token de la memoria
    delete resetTokens[token];

    res.json({ message: 'Contraseña actualizada exitosamente.' });
  } catch (error) {
    console.error('Error al cambiar la contraseña:', error);
    res.status(500).json({ error: 'Error al cambiar la contraseña.' });
  }
}

async function searchUser(req, res) {
  const { correo, nombre, apellido } = req.body;
  const valorBuscar = {};

  const validacion = /^[a-zA-Z]+(\s[a-zA-Z]+)?$/;
  const validacionCorreo = /^([a-zA-Z][a-zA-Z0-9._%-]*)@[a-zAZ0-9.-]+\.(com|co|org)$/;

  if (nombre) {
    if (!validacion.test(nombre)) {
      return res.status(400).json({ error: "El nombre solo puede contener letras." });
    }
    valorBuscar.nombre = nombre;
  }

  if (apellido) {
    if (!validacion.test(apellido)) {
      return res.status(400).json({ error: "El apellido solo puede contener letras." });
    }
    valorBuscar.apellido = apellido;
  }

  if (correo) {
    if (!validacionCorreo.test(correo)) {
      return res.status(500).json({ error: "El correo debe tener una estructura válida." });
    }
    valorBuscar.correo = correo;
  }

  try {
    const usuario = await Usuario.findOne({ where: valorBuscar });

    if (!usuario) {
      return res.status(404).json({ message: "No se encontraron usuarios con los parámetros proporcionados" });
    }

    res.json(usuario);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error al buscar el usuario" });
  }
}

async function verificarCorreoExistente(req, res) {
  const { correo } = req.query;

  try {
    const correoExistente = await Usuario.findOne({ where: { correo } });
    res.json({ existe: !!correoExistente }); // Devuelve un objeto con la propiedad 'existe'
  } catch (error) {
    console.error('Error al verificar el correo:', error);
    res.status(500).json({ error: 'Error al verificar el correo.' });
  }
}


module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  loginUser,
  updateUserState,
  forgotPassword,
  changePassword,
  getActiveUsers,
  getInactiveUsers,
  searchUser,
  verificarCorreoExistente
};
