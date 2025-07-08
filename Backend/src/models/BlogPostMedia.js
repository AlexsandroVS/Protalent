const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('BlogPostMedia', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    blogPostId: { type: DataTypes.INTEGER, allowNull: false },
    ruta: { type: DataTypes.STRING, allowNull: false },
    tipo: { type: DataTypes.STRING, allowNull: false }, // imagen, video, etc.
    tamano: { type: DataTypes.INTEGER, allowNull: false },
    createdAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    updatedAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW }
  });
}; 