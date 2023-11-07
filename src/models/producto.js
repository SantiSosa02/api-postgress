const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');


const Producto = sequelize.define('Producto', {
    idproducto: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    idcategoria: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'categoria',
        key: 'idcategoria'
      }
    },
    nombre: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: "producto_nombre_key"
    },
    stock_minimo: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    cantidad: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    precio_venta: {
      type: DataTypes.DOUBLE,
      allowNull: false
    },
    estado: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    }
  }, {
    sequelize,
    tableName: 'producto',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "producto_nombre_key",
        unique: true,
        fields: [
          { name: "nombre" },
        ]
      },
      {
        name: "producto_pkey",
        unique: true,
        fields: [
          { name: "idproducto" },
        ]
      },
    ]
  });

  module.exports = Producto;