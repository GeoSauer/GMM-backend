const pool = require('../utils/pool');

module.exports = class User {
  id;
  username;
  charName;
  charClass;
  casterLvl;
  email;
  #passwordHash; // private class field: hides it from anything outside of this class definition

  constructor({
    id,
    username,
    char_name,
    char_class,
    caster_lvl,
    email,
    password_hash,
  }) {
    this.id = id;
    this.username = username;
    this.charName = char_name;
    this.charClass = char_class;
    this.casterLvl = caster_lvl;
    this.email = email;
    this.#passwordHash = password_hash;
  }

  static async insert({
    username,
    charName,
    charClass,
    casterLvl,
    email,
    passwordHash,
  }) {
    const { rows } = await pool.query(
      `
      INSERT INTO users (username, char_name, char_class,caster_lvl, email, password_hash)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `,
      [username, charName, charClass, casterLvl, email, passwordHash]
    );

    return new User(rows[0]);
  }

  static async getAll() {
    const { rows } = await pool.query('SELECT * FROM users');

    return rows.map((row) => new User(row));
  }

  static async getByEmail(email) {
    const { rows } = await pool.query(
      `
      SELECT *
      FROM users
      WHERE email=$1
      `,
      [email]
    );

    if (!rows[0]) return null;

    return new User(rows[0]);
  }

  static async getByUsername(username) {
    const { rows } = await pool.query(
      `
      SELECT *
      FROM users
      WHERE username=$1
      `,
      [username]
    );

    if (!rows[0]) return null;

    return new User(rows[0]);
  }

  get passwordHash() {
    return this.#passwordHash;
  }
};
