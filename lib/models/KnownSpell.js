const pool = require('../utils/pool');
const Spell = require('./Spell');

module.exports = class KnownSpell {
  constructor({ id, user_id, char_id, spell_id, known, prepared, from_all }) {
    this.id = id;
    this.userId = user_id;
    this.charId = char_id;
    this.spellId = spell_id;
    this.known = known;
    this.prepared = prepared;
    this.fromAll = from_all;
  }

  static async insertSpell(userId, { charId, spellId, fromAll }) {
    const { rows } = await pool.query(
      `INSERT INTO known_spells (user_id, char_id, spell_id, known, prepared, from_all)
      VALUES ($1, $2, $3, true, false, $4)
      RETURNING *
      `,
      [userId, charId, spellId, fromAll]
    );
    return new KnownSpell(rows[0]);
  }

  static async insertCantrip(userId, { charId, spellId, fromAll }) {
    const { rows } = await pool.query(
      `INSERT INTO known_spells (user_id, char_id, spell_id, known, prepared, from_all)
      VALUES ($1, $2, $3, true, true, $4)
      RETURNING *
      `,
      [userId, charId, spellId, fromAll]
    );
    return new KnownSpell(rows[0]);
  }

  static async getKnownSpells(userId, charId) {
    const { rows } = await pool.query(
      `SELECT spells.*, known_spells.prepared, known_spells.known, known_spells.from_all
      FROM spells
      LEFT JOIN known_spells
      ON spells.id = known_spells.spell_id
      LEFT JOIN characters
      ON characters.id = known_spells.char_id
      WHERE known_spells.user_id = $1 AND known_spells.char_id = $2
      ORDER BY spells.level ASC, spells.name ASC
      `,
      [userId, charId]
    );
    if (!rows[0]) return [];
    return rows.map((row) => new Spell(row));
  }

  static async deleteKnownSpell(charId, spellId) {
    const { rows } = await pool.query(
      `DELETE
      FROM known_spells
      WHERE char_id = $1 AND spell_id = $2
      RETURNING *
      `,
      [charId, spellId]
    );
    return new KnownSpell(rows[0]);
  }

  static async getKnownSpellById(charId, spellId) {
    const { rows } = await pool.query(
      `SELECT *
        FROM known_spells
        WHERE char_id = $1 AND spell_id = $2
        `,
      [charId, spellId]
    );
    if (!rows[0]) return null;
    return new KnownSpell(rows[0]);
  }

  static async updateSpellPreparation(userId, { charId, spellId, prepared }) {
    const spell = await KnownSpell.getKnownSpellById(charId, spellId);
    if (!spell) return null;
    const updatedInfo = { ...spell, prepared };
    const { rows } = await pool.query(
      `UPDATE known_spells
      SET prepared = $4
      WHERE user_id = $1 AND char_id = $2 AND spell_id = $3
      RETURNING *`,
      [userId, charId, spellId, updatedInfo.prepared]
    );
    return new KnownSpell(rows[0]);
  }

  static async getPreparedSpells(userId, charId) {
    const { rows } = await pool.query(
      `SELECT spells.*, known_spells.prepared
      FROM spells
      LEFT JOIN known_spells
      ON spells.id = known_spells.spell_id
      WHERE known_spells.user_id = $1 AND known_spells.char_id = $2 AND known_spells.prepared = true
      ORDER BY spells.level ASC, spells.name ASC
      `,
      [userId, charId]
    );
    if (!rows[0]) return [];
    return rows.map((row) => new Spell(row));
  }
};
