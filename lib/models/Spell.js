const pool = require('../utils/pool');

module.exports = class Spell {
  id;
  index;
  name;
  level;
  school;
  classes;

  constructor({ id, index, name, level, school, classes }) {
    this.id = id;
    this.index = index;
    this.name = name;
    this.level = level;
    this.school = school;
    this.classes = classes;
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
};
