const pool = require('../utils/pool');

const dbCleanup = async () => {
  try {
    await pool.query('DELETE FROM spells');
  } catch (error) {
    console.error('Error deleting test spells', error);
  }
};

module.exports = dbCleanup;
