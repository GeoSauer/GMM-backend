const pool = require('../utils/pool');

module.exports = class Spell {
  id;
  index;
  level;
  school;
  classes;

  constructor({ id, index, level, school, classes }) {
    this.id = id;
    this.index = index;
    this.level = level;
    this.school = school;
    this.classes = classes;
  }

  static async insert({ index, level, school, classes }) {
    const { rows } = await pool.query(
      `
      INSERT INTO spells (index, level, school, classes)
      VALUES ($1, $2, $3, $4)
      RETURNING *
      `,
      [index, level, school, classes]
    );

    return new Spell(rows[0]);
  }

  //* retrieves the list of spells for a user based on their character class and caster level

  static async getAvailableSpells(charClass, casterLvl) {
    const { rows } = await pool.query(
      `SELECT spells.id, spells.index, spells.level, spells.school
      FROM spells
      WHERE $1 = ANY (classes) AND level <= $2 
      `,
      [charClass, casterLvl]
    );
    if (!rows[0]) return;
    return rows.map((row) => new Spell(row));
  }

  static async getSpellById(id) {
    const { rows } = await pool.query(
      `
      SELECT spells.id, spells.index, spells.level, spells.school 
      FROM spells
      WHERE id = $1
      `,
      [id]
    );
    if (!rows[0]) return;
    return new Spell(rows[0]);
  }
};
