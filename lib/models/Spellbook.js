const pool = require('../utils/pool');
const Spell = require('./Spell');

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

  static async insertKnownSpell({ userId, spellId, known, prepared }) {
    const { rows } = await pool.query(
      `INSERT INTO spellbooks (user_id, spell_id, known, prepared)
      VALUES ($1, $2, $3, $4)
      RETURNING *
      `,
      [userId, spellId, known, prepared]
    );
    return new Spellbook(rows[0]);
  }

  static async getKnownSpells(id) {
    const { rows } = await pool.query(
      `SELECT *
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

  static async getById({ userId, spellId }) {
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

  static async deleteKnownSpell({ userId, spellId }) {
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

  static async updateSpellPreparation(id, newAttribute) {
    const spell = await Spellbook.getById(id);
    if (!spell) return null;
    const updatedInfo = { ...spell, ...newAttribute };
    const { rows } = await pool.query(
      `UPDATE spellbooks
      SET prepared = $2
      WHERE id = $1
      RETURNING *`,
      [id, updatedInfo.prepared]
    );
    return new Spellbook(rows[0]);
  }

  // static async getPreparedSpells(id) {
  //   const { rows } = await pool.query(
  //     `SELECT *
  //     FROM spells
  //     LEFT JOIN spellbooks
  //     ON spells.id = spellbooks.spell_id
  //     LEFT JOIN users
  //     ON users.id = spellbooks.user_id
  //     WHERE users.id = $1 AND prepared = true
  //     `,
  //     [id]
  //   );
  //   if (!rows[0]) return;
  //   return rows.map((row) => new Spell(row));
  // }
};
