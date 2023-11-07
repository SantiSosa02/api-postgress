const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const DetalleVentaProducto = sequelize.define('DetalleVentaProducto', {
    iddetalleventaproducto: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    idventa: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'venta',
        key: 'idventa'
      }
    },
    idproducto: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    cantidadproducto: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    precio: {
      type: DataTypes.DOUBLE,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'detalleventaproducto',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "detalleventaproducto_pkey",
        unique: true,
        fields: [
          { name: "iddetalleventaproducto" },
        ]
      },
    ]
  });

  module.exports = DetalleVentaProducto;