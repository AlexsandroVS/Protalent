const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
const { sequelize } = require('../models');

(async () => {
  try {
    console.log('⏳ Sincronizando modelos con la base de datos...');
    await sequelize.sync({ force: true }); // ¡CUIDADO! Esto elimina y recrea todas las tablas
    console.log('✅ Modelos sincronizados correctamente.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error al sincronizar modelos:', error);
    process.exit(1);
  }
})(); 