const cron = require('node-cron');
const pool = require('../utils/pool');

cron.schedule('0 0 * * *', async () => {
  try {
    const currentDate = new Date();
    await pool.query(
      `
			DELETE
			FROM users
			WHERE expiration_date < $1
			`,
      [currentDate]
    );
  } catch (error) {
    console.error('Error deleting expired Demo users', error);
  }
});
