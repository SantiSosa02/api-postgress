const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Servicio = sequelize.define('Servicio', {
    idservicio: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    nombre: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: "servicio_nombre_key"
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
    tableName: 'servicio',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "servicio_nombre_key",
        unique: true,
        fields: [
          { name: "nombre" },
        ]
      },
      {
        name: "servicio_pkey",
        unique: true,
        fields: [
          { name: "idservicio" },
        ]
      },
    ]
  });
 module.exports = Servicio;
