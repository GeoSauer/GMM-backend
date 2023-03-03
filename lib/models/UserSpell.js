const pool = require('../utils/pool');

module.exports = class UserSpell {
  id;
  userId;
  spellId;
  known;
  prepared;

  constructor({ id, user_id, spell_id, known, prepared }) {
    this.id = id;
    this.userId = user_id;
    this.spellId = spell_id;
    this.known = known;
    this.prepared = prepared;
  }

  static async insertKnownSpell(id) {
    const { rows } = await pool.query();
  }

  static async getKnownSpells(id) {
    const { rows } = await pool.query(
      `SELECT spells.index
      FROM spells
      LEFT JOIN users_spells
      ON spells.id = users_spells.spell_id
      LEFT JOIN users 
      ON users.id = users_spells.user_id
      WHERE user_id = $1 AND known = true 
      `,
      [id]
    );
    if (!rows[0]) return;
    return rows.map((row) => new Spell(row));
  }

  static async insertPreparedSpell(id) {
    const { rows } = await pool.query();
  }

  static async getPreparedSpells(id) {
    const { rows } = await pool.query(
      `SELECT spells.index
      FROM spells
      LEFT JOIN users_spells
      ON spells.id = users_spells.spell_id
      LEFT JOIN users 
      ON users.id = users_spells.user_id
      WHERE user_id = $1 AND known = true AND prepared = true
      `,
      [id]
    );
    if (!rows[0]) return;
    return rows.map((row) => new Spell(row));
  }
};
