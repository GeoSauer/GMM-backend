const pool = require('../utils/pool');

module.exports = class Spellslot {
  id;
  userId;
  cantrips;
  level1;
  level2;
  level3;
  level4;
  level5;
  level6;
  level7;
  level8;
  level9;

  constructor({
    id,
    user_id,
    cantrips,
    level_1,
    level_2,
    level_3,
    level_4,
    level_5,
    level_6,
    level_7,
    level_8,
    level_9,
  }) {
    this.id = id;
    this.userId = user_id;
    this.cantrips = cantrips;
    this.level1 = level_1;
    this.level2 = level_2;
    this.level3 = level_3;
    this.level4 = level_4;
    this.level5 = level_5;
    this.level6 = level_6;
    this.level7 = level_7;
    this.level8 = level_8;
    this.level9 = level_9;
  }

  static async insert({
    userId,
    cantrips,
    level1,
    level2,
    level3,
    level4,
    level5,
    level6,
    level7,
    level8,
    level9,
  }) {
    const { rows } = await pool.query(
      `INSERT INTO spellslots (user_id, cantrips, level_1, level_2, level_3, level_4, level_5, level_6, level_7, level_8, level_9)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *
      `,
      [
        userId,
        cantrips,
        level1,
        level2,
        level3,
        level4,
        level5,
        level6,
        level7,
        level8,
        level9,
      ]
    );

    return new Spellslot(rows[0]);
  }

  static async getAvailableSpellslots(charClass, charLvl) {}
};
