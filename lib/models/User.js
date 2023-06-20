const pool = require('../utils/pool');
module.exports = class User {
  #passwordHash; // private class field: hides it from anything outside of this class definition

  constructor({ id, username, email, demo, expiration_date, password_hash }) {
    this.id = id;
    this.username = username;
    this.email = email;
    this.demo = demo;
    this.expirationDate = expiration_date;
    this.#passwordHash = password_hash;
  }

  static async insert({ username, email, passwordHash, demo, expirationDate }) {
    const { rows } = await pool.query(
      `
      INSERT INTO users (username, email, password_hash, demo, expiration_date)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `,
      [username, email, passwordHash, demo, expirationDate]
    );

    return new User(rows[0]);
  }

  static async getAll() {
    const { rows } = await pool.query(
      `SELECT * 
			FROM users
			`
    );
    if (!rows[0]) return 0;
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
    const updatedInfo = {
      ...user,
      ...newAttributes,
    };
    const { rows } = await pool.query(
      `UPDATE users
      SET username = $2
      WHERE id = $1
      RETURNING *`,
      [id, updatedInfo.username]
    );
    return new User(rows[0]);
  }

  static async deleteUser(id) {
    const { rows } = await pool.query(
      `DELETE
			FROM users
			WHERE id = $1 
			RETURNING *`,
      [id]
    );
    return new User(rows[0]);
  }

  get passwordHash() {
    return this.#passwordHash;
  }
};
