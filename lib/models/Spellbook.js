const pool = require('../utils/pool');

module.exports = class Spellbook {
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

  static async learnSpell({ userId, spellId, known, prepared }) {
    const { rows } = await pool.query(
      `
      INSERT INTO spellbook (user_id, spell_id, known, prepared)
      VALUES ($1, $2, $3, $4)
      RETURNING *
      `,
      [userId, spellId, known, prepared]
    );
    return new Spellbook(rows[0]);
  }

  static async unlearnSpell(id) {
    const { rows } = await pool.query(
      `
    DELETE
    FROM spellbook
    WHERE id = $1
    RETURNING *
    `,
      [id]
    );
    return new Spellbook(rows[0]);
  }

  static async getById(id) {
    const { rows } = await pool.query(
      `
    SELECT *
    FROM spellbook
    WHERE id = $1
    `,
      [id]
    );
    if (!rows[0]) return null;
    return new Spellbook(rows[0]);
  }

  static async getKnownSpells(id) {
    const { rows } = await pool.query(
      `SELECT spells.index
      FROM spells
      LEFT JOIN spellbook
      ON spells.id = spellbook.spell_id
      LEFT JOIN users 
      ON users.id = spellbook.user_id
      WHERE user_id = $1 
      `,
      [id]
    );
    if (!rows[0]) return;
    return rows.map((row) => new Spell(row));
  }

  static async updateSpellPreparation(id, newAttribute) {
    const spell = await Spellbook.getSpellbookById(id);
    if (!spell) return null;
    const updatedInfo = { ...spell, ...newAttribute };
    const { rows } = await pool.query(
      `UPDATE spellbook
      SET prepared = $2
      WHERE id = $1
      RETURNING *`,
      [id, updatedInfo.prepared]
    );
    return new Spellbook(rows[0]);
  }

  static async getPreparedSpells(id) {
    const { rows } = await pool.query(
      `SELECT spells.index
      FROM spells
      LEFT JOIN spellbook
      ON spells.id = spellbook.spell_id
      LEFT JOIN users 
      ON users.id = spellbook.user_id
      WHERE user_id = $1 AND prepared = true
      `,
      [id]
    );
    if (!rows[0]) return;
    return rows.map((row) => new Spell(row));
  }
};
