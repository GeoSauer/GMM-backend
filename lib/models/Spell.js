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
      `SELECT *
      FROM spells
      WHERE $1 = ANY (classes) AND level <= $2 
      `,
      [charClass, casterLvl]
    );
    if (!rows[0]) return;
    return rows.map((row) => new Spell(row));
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

//? these functions are no longer needed
// static async getSpellsByCharClass(charClass) {
//   const { rows } = await pool.query(
//     `SELECT name
//     FROM spells
//     WHERE $1 = ANY (classes)
//     `,
//     [charClass]
//   );

//   return rows.map((row) => new Spell(row));
// }

// static async getSpellsByCasterLvl(casterLvl) {
//   const { rows } = await pool.query(
//     `
//     SELECT name
//     FROM spells
//     WHERE level <= $1
//     `,
//     [casterLvl]
//   );

//   return rows.map((row) => new Spell(row));
// }
