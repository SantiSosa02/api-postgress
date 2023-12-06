// categoryController.js
const  Abono  = require('../models/abono');  
const Venta = require ('../models/venta')

const estadosPermitidos = [true, false];

const getAllPayments = async (req, res) => {
  try {
    const abonos = await Abono.findAll();  

    if (abonos.length === 0 ){
      return res.status(404).json({message: "No hay abonos registrados"})
    }
    res.json(abonos);
  } catch (error) {
    console.error('Error fetching abonos:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Obtener un usuario por ID
async function getPaymentById(req, res) {
  const { id } = req.params;
  try {
    const abono = await Abono.findByPk(id);
    if (!abono) {
      return res.status(404).json({ error: 'Abono no encontrado.' });
    }
    res.json(categoria);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener la categoria.' });
  }
}

const getActivePayments =  async (req, res) => {
  try{
     const abonos =  await Abono.findAll({where : {estado: true}});

     if (abonos.length === 0 ){
      return res.status(400).json({error : "No hay abonos activos"});
     }
     res.json(abonos);
  }catch{
    console.error(error);
    res.status(500).json({error: "Error al obtener los abonos activos"})
  }
}

const getInactivePayments =  async (req, res) => {
  try{
     const abonos =  await Abono.findAll({where : {estado: false}});

     if (abonos.length === 0 ){
      return res.status(400).json({error : "No hay abonos inactivos"});
     }
     res.json(abonos);
  }catch{
    console.error(error);
    res.status(500).json({error: "Error al obtener los abonos inactivos"})
  }
}



async function createPayment(req, res) {
  const { idventa, fechaabono, valorabono, valorrestante, estado } = req.body;

  if(valorabono < 1000 || valorabono > 2000000){
    return res.status(400).json({ error: 'El abono no puede ser menor a 1.000 ni mayor a 2.000.000.' });
  }

  try {
    // Obtener la venta asociada al idventa proporcionado
    const venta = await Venta.findByPk(idventa);

    if (!venta) {
      return res.status(404).json({ error: 'Venta no encontrada.' });
    }

    // Calcular el valorrestante
    let valorRestante = venta.valortotal;

    // Calcular el valor restante considerando los abonos anteriores
    const abonosAnteriores = await Abono.findAll({
      where: { idventa },
      attributes: ['valorabono']
    });

    if (abonosAnteriores && abonosAnteriores.length > 0) {
      const abonosSumados = abonosAnteriores.reduce((total, abono) => total + abono.valorabono, 0);
      valorRestante -= abonosSumados;
    }

    // Validar que el abono no supere el valor restante
    if (valorabono > valorRestante) {
      return res.status(400).json({ error: 'El abono excede el valor restante de la venta.' });
    }

    const feachaActual =new Date().toISOString().split('T')[0];

    // Actualizar el valor restante en la venta
    valorRestante -= valorabono;
    await venta.update({ valorrestante: valorRestante });

    // Crear el abono
    const abono = await Abono.create({
      idventa,
      fechaabono: feachaActual,
      valorabono,
      valorrestante: valorRestante,
      estado
    });

    // Verificar si el valor restante total de la venta es igual a 0 y cambiar el estado de la venta
    if (valorRestante <= 0) {
      // Cambiar el estado de la venta a "Pagado"
      await venta.update({ estadopago: 'Credito' });
    }

    res.status(201).json(abono);
  } catch (error) {
    res.status(400).json({ error: 'Error al crear el abono.' });
    console.error('Error al crear el abono:', error);
  }
}


async function updatePaymentState(req, res) {
    const { id } = req.params;
    const { estado } = req.body;
  
    try {
      const abono = await Abono.findByPk(id);
  
      if (!abono) {
        return res.status(404).json({ error: 'Abono no encontrado.' });
      }
  
      // Verificar si el nuevo estado es permitido para cambios
      if (!estadosPermitidos.includes(estado)) {
        return res.status(400).json({ error: 'No se permite cambiar a este estado.' });
      }
  
      // Verificar si el abono ya está en el nuevo estado
      if (abono.estado === estado) {
        return res.status(400).json({ error: 'El abono ya está en este estado.' });
      }
  
      // Obtener el valor del abono
      const valorAbono = abono.valorabono;
  
      // Calcular el nuevo valor restante
      let nuevoValorRestante = abono.valorrestante;
  
      if (estado === false) {
        // Si se anula el abono, sumar su valor al valor restante
        nuevoValorRestante += valorAbono;
      } else {
        // Si se activa el abono, restar su valor al valor restante
        nuevoValorRestante -= valorAbono;
      }
      if (abono.estado === false && estado === true) {
        return res.status(400).json({ error: 'No se puede cambiar de inactivo a activo.' });
      }
  
      // Actualizar el estado y el valor restante
      await abono.update({ estado, valorrestante: nuevoValorRestante });
  
      res.json({ message: 'Estado del abono actualizado exitosamente.' });
    } catch (error) {
      console.error('Error al actualizar el estado del abono:', error);
      res.status(500).json({ error: 'Error interno del servidor.' });
    }
  }
  
  async function searchPayment( req, res){
    const {idventa,idabono} = req.body;
    const valorBuscar={};
  
    const cantidadValidacion= /^[0-9]+$/;
  
    if(idventa){
    if(!cantidadValidacion.test(idventa)){
      return res.status(400).json({error: "El id de la venta solo permite numeros."})
    }
    valorBuscar.idventa = idventa;
  }

  if(idabono){
    if(!cantidadValidacion.test(idabono)){
      return res.status(400).json({error: "El id de el abono solo permite numeros."})
    }
    valorBuscar.idabono = idabono;
  }
  
    try{
  
      const abono= await Abono.findAll({where: valorBuscar});
      if(abono.length === 0){
        return res.status(404).json({error:"No se encontraron abonos con los parametros proporcionados" })
      }
  
      res.json(abono)
    }catch(error){
      console.log(error)
      res.status(500).json({error: "Error al buscar el abono"})
    }
  }

  // Añade este método al final de tu controlador

async function getPaymentsByVentaId(req, res) {
  const { idventa } = req.params;

  try {
    // Verifica si el idventa proporcionado es un número válido
    const cantidadValidacion = /^[0-9]+$/;
    if (!cantidadValidacion.test(idventa)) {
      return res.status(400).json({ error: "El id de la venta solo permite números." });
    }

    // Busca la venta por id
    const venta = await Venta.findByPk(idventa);

    if (!venta) {
      return res.status(404).json({ error: 'Venta no encontrada.' });
    }

    // Busca los abonos asociados a la venta
    const abonos = await Abono.findAll({
      where: { idventa },
    });

    if (abonos.length === 0) {
      return res.status(404).json({ message: 'No hay abonos registrados para esta venta.' });
    }

    res.json(abonos);
  } catch (error) {
    console.error('Error al obtener los abonos por venta:', error);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
}

module.exports = {
  getAllPayments,
  getPaymentById,
  createPayment,
  updatePaymentState,
  getActivePayments,
  getInactivePayments,
  searchPayment,
  getPaymentsByVentaId, 
  getPaymentsByVentaId
};
