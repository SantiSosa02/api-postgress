const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');
const DetalleVentaProducto = require('./detalleventaproducto'); 
const DetalleVentaServicio = require('./detalleventaservicio');
const Abono = require('./abono')

const Venta = sequelize.define('Venta', {
    idventa: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    idcliente: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'cliente',
        key: 'idcliente'
      }
    },
    numerofactura: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique : true
    },
    fecha: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: sequelize.Sequelize.literal('CURRENT_DATE')
    },
    metodopago: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    estadopago: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    tipopago: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    valortotal: {
      type: DataTypes.DOUBLE,
      allowNull: false
    },
    observacion: {
      type: DataTypes.STRING(200),
      allowNull: false
    },
    estado: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    }
  }, {
    sequelize,
    tableName: 'venta',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "venta_pkey",
        unique: true,
        fields: [
          { name: "idventa" },
        ]
      },
    ]
  });
  
  Venta.hasMany(DetalleVentaProducto, { foreignKey: 'idventa' });
  Venta.hasMany(DetalleVentaServicio, { foreignKey: 'idventa' });
  Venta.hasMany(Abono, { foreignKey: 'idventa' });

  module.exports = Venta;
