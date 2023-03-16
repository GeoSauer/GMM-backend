const pool = require('../utils/pool');
const Spell = require('./Spell');

module.exports = class Spellbook {
  id;
  userId;
  spellId;
  prepared;

  constructor({ id, user_id, spell_id, prepared }) {
    this.id = id;
    this.userId = user_id;
    this.spellId = spell_id;
    this.prepared = prepared;
  }

  static async insertKnownSpell({ userId, spellId, prepared }) {
    const { rows } = await pool.query(
      `INSERT INTO spellbooks (user_id, spell_id, prepared)
      VALUES ($1, $2, $3)
      RETURNING *
      `,
      [userId, spellId, prepared]
    );
    return new Spellbook(rows[0]);
  }

  static async getKnownSpells(id) {
    const { rows } = await pool.query(
      `SELECT spells.id, spells.index, spells.level, spells.school
      FROM spells
      LEFT JOIN spellbooks
      ON spells.id = spellbooks.spell_id
      LEFT JOIN users
      ON users.id = spellbooks.user_id
      WHERE users.id = $1
      `,
      [id]
    );
    if (!rows[0]) return;
    return rows.map((row) => new Spell(row));
  }

  static async deleteKnownSpell(userId, spellId) {
    const { rows } = await pool.query(
      `DELETE
      FROM spellbooks
      WHERE user_id = $1 AND spell_id = $2
      RETURNING *
      `,
      [userId, spellId]
    );
    return new Spellbook(rows[0]);
  }

  static async getSpellbookById(userId, spellId) {
    const { rows } = await pool.query(
      `SELECT *
        FROM spellbooks
        WHERE user_id = $1 AND spell_id = $2
        `,
      [userId, spellId]
    );
    if (!rows[0]) return null;
    return new Spellbook(rows[0]);
  }

  static async updateSpellPreparation({ userId, spellId, prepared }) {
    const spell = await Spellbook.getSpellbookById(userId, spellId);
    if (!spell) return null;
    const updatedInfo = { ...spell, prepared };
    const { rows } = await pool.query(
      `UPDATE spellbooks
      SET prepared = $3
      WHERE user_id = $1 AND spell_id = $2
      RETURNING *`,
      [userId, spellId, updatedInfo.prepared]
    );
    return new Spellbook(rows[0]);
  }

  static async getPreparedSpells(id) {
    const { rows } = await pool.query(
      `SELECT spells.id, spells.index, spells.level, spells.school
      FROM spells
      LEFT JOIN spellbooks
      ON spells.id = spellbooks.spell_id
      WHERE spellbooks.user_id = $1 AND prepared = true
      `,
      [id]
    );
    if (!rows[0]) return;
    return rows.map((row) => new Spell(row));
  }
};
