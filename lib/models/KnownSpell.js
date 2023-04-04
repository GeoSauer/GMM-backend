const pool = require('../utils/pool');
const Spell = require('./Spell');

module.exports = class KnownSpell {
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

  static async insertKnownSpell({ userId, spellId }) {
    const { rows } = await pool.query(
      `INSERT INTO known_spells (user_id, spell_id, prepared)
      VALUES ($1, $2, false)
      RETURNING *
      `,
      [userId, spellId]
    );
    return new KnownSpell(rows[0]);
  }

  static async getKnownSpells(id) {
    const { rows } = await pool.query(
      `SELECT spells.id, spells.index, spells.name, spells.level, spells.school
      FROM spells
      LEFT JOIN known_spells
      ON spells.id = known_spells.spell_id
      LEFT JOIN users
      ON users.id = known_spells.user_id
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
      FROM known_spells
      WHERE user_id = $1 AND spell_id = $2
      RETURNING *
      `,
      [userId, spellId]
    );
    return new KnownSpell(rows[0]);
  }

  static async getKnownSpellById(userId, spellId) {
    const { rows } = await pool.query(
      `SELECT *
        FROM known_spells
        WHERE user_id = $1 AND spell_id = $2
        `,
      [userId, spellId]
    );
    if (!rows[0]) return null;
    return new KnownSpell(rows[0]);
  }

  static async updateSpellPreparation({ userId, spellId, prepared }) {
    const spell = await KnownSpell.getKnownSpellById(userId, spellId);
    if (!spell) return null;
    const updatedInfo = { ...spell, prepared };
    const { rows } = await pool.query(
      `UPDATE known_spells
      SET prepared = $3
      WHERE user_id = $1 AND spell_id = $2
      RETURNING *`,
      [userId, spellId, updatedInfo.prepared]
    );
    return new KnownSpell(rows[0]);
  }

  static async getPreparedSpells(id) {
    const { rows } = await pool.query(
      `SELECT spells.id, spells.index, spells.name, spells.level, spells.school
      FROM spells
      LEFT JOIN known_spells
      ON spells.id = known_spells.spell_id
      WHERE known_spells.user_id = $1 AND prepared = true
      `,
      [id]
    );
    if (!rows[0]) return;
    return rows.map((row) => new Spell(row));
  }
};
