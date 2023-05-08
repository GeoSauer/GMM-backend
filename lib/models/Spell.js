const pool = require('../utils/pool');

module.exports = class Spell {
  id;
  index;
  name;
  level;
  school;
  classes;
  prepared;
  known;

  constructor({ id, index, name, level, school, classes, prepared, known }) {
    this.id = id;
    this.index = index;
    this.name = name;
    this.level = level;
    this.school = school;
    this.classes = classes;
    this.prepared = prepared;
    this.known = known;
  }

  static async insert({ index, name, level, school, classes }) {
    const { rows } = await pool.query(
      `
      INSERT INTO spells (index, name, level, school, classes)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
      `,
      [index, name, level, school, classes]
    );

    return new Spell(rows[0]);
  }

  static async getAvailableSpells(charClass, casterLvl) {
    const { rows } = await pool.query(
      `SELECT spells.id, spells.index, spells.name, spells.level, spells.school, known_spells.known
      FROM spells
      LEFT JOIN known_spells
      ON spells.id = known_spells.spell_id
      LEFT JOIN characters
      ON known_spells.char_id = characters.id
      WHERE $1 = ANY (spells.classes) AND spells.level <= $2
      ORDER BY spells.level ASC, spells.name ASC
      `,
      [charClass, casterLvl]
    );
    if (!rows[0]) return;
    return rows.map((row) => new Spell(row));
  }

  static async getSpellById(spellId) {
    const { rows } = await pool.query(
      `
      SELECT spells.id, spells.index, spells.name, spells.level, spells.school 
      FROM spells
      WHERE id = $1
      `,
      [spellId]
    );
    if (!rows[0]) return;
    return new Spell(rows[0]);
  }

  static async getAllSpells(casterLvl) {
    const { rows } = await pool.query(
      `SELECT *
      FROM spells
      WHERE spells.level <= $1
      ORDER BY spells.level ASC, spells.name ASC
      `,
      [casterLvl]
    );
    if (!rows[0]) return;
    return rows.map((row) => new Spell(row));
  }
};
