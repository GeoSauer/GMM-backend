const pool = require('../utils/pool');
const Spell = require('./Spell');

module.exports = class KnownSpell {
  id;
  userId;
  charId;
  spellId;
  prepared;

  constructor({ id, user_id, char_id, spell_id, prepared }) {
    this.id = id;
    this.userId = user_id;
    this.charId = char_id;
    this.spellId = spell_id;
    this.prepared = prepared;
  }

  static async insertKnownSpell({ userId, charId, spellId }) {
    // const spell = await Spell.getSpellById(spellId);
    // const character = await Character.getCharacterById(userId, charId);
    // const newAttributes = {};
    // if (spell.level === 0) {
    //   newAttributes.cantripsKnown = character.cantripsKnown + 1;
    // } else {
    //   newAttributes.spellsKnown = character.spellsKnown + 1;
    // }
    // await Character.updateCharacterInfo(userId, charId, newAttributes);
    const { rows } = await pool.query(
      `INSERT INTO known_spells (user_id, char_id, spell_id, prepared)
      VALUES ($1, $2, $3, false)
      RETURNING *
      `,
      [userId, charId, spellId]
    );
    return new KnownSpell(rows[0]);
  }

  static async getKnownSpells(userId, charId) {
    const { rows } = await pool.query(
      `SELECT spells.id, spells.index, spells.name, spells.level, spells.school
      FROM spells
      LEFT JOIN known_spells
      ON spells.id = known_spells.spell_id
      LEFT JOIN characters
      ON characters.id = known_spells.char_id
      WHERE known_spells.user_id = $1 AND known_spells.char_id = $2
      `,
      [userId, charId]
    );
    if (!rows[0]) return;
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
      `SELECT spells.id, spells.index, spells.name, spells.level, spells.school
      FROM spells
      LEFT JOIN known_spells
      ON spells.id = known_spells.spell_id
      WHERE known_spells.user_id = $1 AND known_spells.char_id = $2 AND prepared = true
      `,
      [userId, charId]
    );
    if (!rows[0]) return;
    return rows.map((row) => new Spell(row));
  }
};
