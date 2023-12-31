const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Cliente = sequelize.define('Cliente', {
    idcliente: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    nombre: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    apellido: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    telefono: {
      type: DataTypes.STRING(10),
      allowNull: false,
      unique: "cliente_telefono_key"
    },
    correo: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: "cliente_correo_key"
    },
    estado: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    }
  }, {
    sequelize,
    tableName: 'cliente',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "cliente_correo_key",
        unique: false,
        fields: [
          { name: "correo" },
        ]
      },
      {
        name: "cliente_pkey",
        unique: true,
        fields: [
          { name: "idcliente" },
        ]
      },
      {
        name: "cliente_telefono_key",
        unique: false,
        fields: [
          { name: "telefono" },
        ]
      },
    ]
  });

module.exports = Cliente;