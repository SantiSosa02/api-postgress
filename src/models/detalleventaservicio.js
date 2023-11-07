const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const DetalleVentaServicio = sequelize.define('DetalleVentaServicio', {
    iddetalleventaservicio: {
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
    idservicio: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'servicio',
        key: 'idservicio'
      }
    },
    precio: {
      type: DataTypes.DOUBLE,
      allowNull: false
    },
    descripcion: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
  }, {
    sequelize,
    tableName: 'detalleventaservicio',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "detalleventaservicio_pkey",
        unique: true,
        fields: [
          { name: "iddetalleventaservicio" },
        ]
      },
    ]
  });

  module.exports = DetalleVentaServicio;
