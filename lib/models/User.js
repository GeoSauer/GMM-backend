const pool = require('../utils/pool');
module.exports = class User {
  #passwordHash; // private class field: hides it from anything outside of this class definition

  constructor({ id, username, email, password_hash }) {
    this.id = id;
    this.username = username;
    this.email = email;
    this.#passwordHash = password_hash;
  }

  static async insert({ username, email, passwordHash }) {
    const { rows } = await pool.query(
      `
      INSERT INTO users (username, email, password_hash)
      VALUES ($1, $2, $3)
      RETURNING *
    `,
      [username, email, passwordHash]
    );

    return new User(rows[0]);
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
