// src/models/Postulacion.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Postulacion', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    mensaje: { type: DataTypes.TEXT },
    estado: {
      type: DataTypes.ENUM('pendiente', 'aceptada', 'rechazada'),
      defaultValue: 'pendiente',
    },
    usuarioId: { type: DataTypes.INTEGER, allowNull: false },
    ofertaId: { type: DataTypes.INTEGER, allowNull: false },
    createdAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    updatedAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW }
  });
};
