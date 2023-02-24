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
      INSERT INTO users (username, char_name, char_class, caster_lvl, email, password_hash)
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

  static async getByLogin({ email, username }) {
    const { rows } = await pool.query(
      `
      SELECT *
      FROM users
      WHERE email=$1 OR username=$2
      `,
      [email, username]
    );
    if (!rows[0]) return;
    return new User(rows[0]);
  }

  static async getById(id) {
    const { rows } = await pool.query(
      `SELECT * 
      FROM users
      WHERE id = $1`,
      [id]
    );
    if (!rows[0]) return;
    return new User(rows[0]);
  }

  static async updateUserInfo(id, newAttributes) {
    const user = await User.getById(id);
    if (!user) return null;
    const updatedInfo = { ...user, ...newAttributes };
    const { rows } = await pool.query(
      `UPDATE users
      SET username=$2, char_name=$3, char_class=$4, caster_lvl=$5
      WHERE id = $1
      RETURNING *`,
      [
        id,
        updatedInfo.username,
        updatedInfo.charName,
        updatedInfo.charClass,
        updatedInfo.casterLvl,
      ]
    );
    return new User(rows[0]);
  }

  get passwordHash() {
    return this.#passwordHash;
  }
};
