const pool = require('../utils/pool');

module.exports = class Spell {
  id;
  index;
  name;
  level;
  school;
  classes;
  known;
  prepared;

  constructor({ id, index, name, level, school, classes, known, prepared }) {
    this.id = id;
    this.index = index;
    this.name = name;
    this.level = level;
    this.school = school;
    this.classes = classes;
    this.known = known;
    this.prepared = prepared;
  }

  static async insert({ index, name, level, school, classes }) {
    const { rows } = await pool.query(
      `
      INSERT INTO spells (index, name, level, school, classes, known)
      VALUES ($1, $2, $3, $4, $5, false)
      RETURNING *
      `,
      [index, name, level, school, classes]
    );

    return new Spell(rows[0]);
  }

  // static async getAvailableSpells(charClass, casterLvl, limit, offset) {
  //   const { rows } = await pool.query(
  //     `SELECT *
  //     FROM spells
  //     WHERE $1 = ANY (spells.classes) AND spells.level <= $2
  //     ORDER BY spells.level ASC, spells.name ASC
  // 		LIMIT $3 OFFSET $4
  //     `,
  //     [charClass, casterLvl, limit, offset]
  //   );
  //   if (!rows[0]) return [];
  //   return rows.map((row) => new Spell(row));
  // }

  static async getAvailableSpells(charClass, casterLvl) {
    const { rows } = await pool.query(
      `SELECT spells.id, index, name, level, school, classes, spells.known, known_spells.from_all
			FROM spells
			LEFT JOIN known_spells 
			ON spells.id = known_spells.spell_id
			WHERE $1 = ANY (spells.classes) AND spells.level <= $2			
			UNION ALL		
			SELECT known_spells.id, index, name, level, school, classes, known_spells.known, known_spells.from_all
			FROM known_spells
			LEFT JOIN spells 
			ON spells.id = known_spells.spell_id
			WHERE known_spells.from_all = true
			ORDER BY level ASC, name ASC
      `,
      [charClass, casterLvl]
    );
    if (!rows[0]) return [];
    return rows.map((row) => new Spell(row));
  }

  static async getSpellById(spellId) {
    const { rows } = await pool.query(
      `
      SELECT * 
      FROM spells
      WHERE id = $1
      `,
      [spellId]
    );
    if (!rows[0]) return;
    return new Spell(rows[0]);
  }

  // static async getAllSpells(offset, batchSize) {
  //   const { rows } = await pool.query(
  //     `SELECT *
  //     FROM spells
  //     ORDER BY spells.level ASC, spells.name ASC
  // 		LIMIT $1 OFFSET $2
  //     `,
  //     [batchSize, offset]
  //   );
  //   if (!rows[0]) return [];
  //   return rows.map((row) => new Spell(row));
  // }
  static async getAllSpells() {
    const { rows } = await pool.query(
      `SELECT *
      FROM spells
      ORDER BY spells.level ASC, spells.name ASC
      `
    );
    if (!rows[0]) return [];
    return rows.map((row) => new Spell(row));
  }
};
