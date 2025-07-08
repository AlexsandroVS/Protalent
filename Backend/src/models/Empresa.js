// src/models/Empresa.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Empresa', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    usuarioId: { type: DataTypes.INTEGER, allowNull: false },
    nombreEmpresa: { type: DataTypes.STRING, allowNull: false },
    descripcion: { type: DataTypes.TEXT },
    createdAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    updatedAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW }
  });
};
