const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Abono = sequelize.define('Abono', {
    idabono: {
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
    fechaabono: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: sequelize.Sequelize.literal('CURRENT_DATE')
    },
    valorabono: {
      type: DataTypes.DOUBLE,
      allowNull: false
    },
    valorrestante: {
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
    tableName: 'abono',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "abono_pkey",
        unique: true,
        fields: [
          { name: "idabono" },
        ]
      },
    ]
  });

  module.exports = Abono;