var DataTypes = require("sequelize").DataTypes;
var _abono = require("./abono");
var _categoria = require("./categoria");
var _cliente = require("./cliente");
var _detalleventaproducto = require("./detalleventaproducto");
var _detalleventaservicio = require("./detalleventaservicio");
var _producto = require("./producto");
var _servicio = require("./servicio");
var _usuario = require("./usuario");
var _venta = require("./venta");

function initModels(sequelize) {
  var abono = _abono(sequelize, DataTypes);
  var categoria = _categoria(sequelize, DataTypes);
  var cliente = _cliente(sequelize, DataTypes);
  var detalleventaproducto = _detalleventaproducto(sequelize, DataTypes);
  var detalleventaservicio = _detalleventaservicio(sequelize, DataTypes);
  var producto = _producto(sequelize, DataTypes);
  var servicio = _servicio(sequelize, DataTypes);
  var usuario = _usuario(sequelize, DataTypes);
  var venta = _venta(sequelize, DataTypes);

  producto.belongsTo(categoria, { as: "idcategoria_categorium", foreignKey: "idcategoria"});
  categoria.hasMany(producto, { as: "productos", foreignKey: "idcategoria"});
  venta.belongsTo(cliente, { as: "idcliente_cliente", foreignKey: "idcliente"});
  cliente.hasMany(venta, { as: "venta", foreignKey: "idcliente"});
  detalleventaservicio.belongsTo(servicio, { as: "idservicio_servicio", foreignKey: "idservicio"});
  servicio.hasMany(detalleventaservicio, { as: "detalleventaservicios", foreignKey: "idservicio"});
  abono.belongsTo(venta, { as: "idventa_ventum", foreignKey: "idventa"});
  venta.hasMany(abono, { as: "abonos", foreignKey: "idventa"});
  detalleventaproducto.belongsTo(venta, { as: "idventa_ventum", foreignKey: "idventa"});
  venta.hasMany(detalleventaproducto, { as: "detalleventaproductos", foreignKey: "idventa"});
  detalleventaservicio.belongsTo(venta, { as: "idventa_ventum", foreignKey: "idventa"});
  venta.hasMany(detalleventaservicio, { as: "detalleventaservicios", foreignKey: "idventa"});

  return {
    abono,
    categoria,
    cliente,
    detalleventaproducto,
    detalleventaservicio,
    producto,
    servicio,
    usuario,
    venta,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
