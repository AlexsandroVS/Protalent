// src/models/Estudiante.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Estudiante', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    usuarioId: { type: DataTypes.INTEGER, allowNull: false },
    carrera: { type: DataTypes.STRING, allowNull: false },
    anioIngreso: { type: DataTypes.INTEGER, allowNull: true },
    cv: { type: DataTypes.STRING, allowNull: true },
    createdAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    updatedAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW }
  });
};
