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

  static async getById(id) {
    const { rows } = await pool.query(
      `
      SELECT * 
      FROM spells
      WHERE id = $1
      `,
      [id]
    );
    return new Spell(rows[0]);
  }
  // static async getKnownSpells(id) {
  //   const { rows } = await pool.query(
  //     `SELECT spells.index
  //     FROM spells
  //     LEFT JOIN spellbook
  //     ON spells.id = spellbook.spell_id
  //     LEFT JOIN users
  //     ON users.id = spellbook.user_id
  //     WHERE user_id = $1 AND known = true
  //     `,
  //     [id]
  //   );
  //   if (!rows[0]) return;
  //   return rows.map((row) => new Spell(row));
  // }

  // static async insertKnownSpell(id) {
  //   const { rows } = await pool.query();
  // }

  // static async getPreparedSpells(id) {
  //   const { rows } = await pool.query(
  //     `SELECT spells.index
  //     FROM spells
  //     LEFT JOIN spellbook
  //     ON spells.id = spellbook.spell_id
  //     LEFT JOIN users
  //     ON users.id = spellbook.user_id
  //     WHERE user_id = $1 AND known = true AND prepared = true
  //     `,
  //     [id]
  //   );
  //   if (!rows[0]) return;
  //   return rows.map((row) => new Spell(row));
  // }

  // static async insertPreparedSpell(id) {
  //   const { rows } = await pool.query();
  // }
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
