const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');
const Producto = require('./producto');

const Categoria = sequelize.define('Categoria', {
    idcategoria: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    nombre: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: "categoria_nombre_key"
    },
    descripcion: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    estado: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    }
  }, {
    sequelize,
    tableName: 'categoria',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "categoria_nombre_key",
        unique: true,
        fields: [
          { name: "nombre" },
        ]
      },
      {
        name: "categoria_pkey",
        unique: true,
        fields: [
          { name: "idcategoria" },
        ]
      },
    ]
  });

  Categoria.hasMany(Producto, { foreignKey: 'idcategoria', as: 'productos' });

  module.exports = Categoria;
