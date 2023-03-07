const pool = require('../utils/pool');
const {
  calculateCasterLevel,
  calculateCantripsKnown,
  calculateProficiencyBonus,
  calculateSpellsKnown,
} = require('../utils/spell-utils');

module.exports = class User {
  id;
  username;
  charName;
  charClass;
  charLvl;
  charMod;
  casterLvl;
  profBonus;
  email;
  cantripsKnown;
  spellsKnown;
  #passwordHash; // private class field: hides it from anything outside of this class definition

  constructor({
    id,
    username,
    char_name,
    char_class,
    char_lvl,
    char_mod,
    caster_lvl,
    prof_bonus,
    email,
    cantrips_known,
    spells_known,
    password_hash,
  }) {
    this.id = id;
    this.username = username;
    this.charName = char_name;
    this.charClass = char_class;
    this.charLvl = char_lvl;
    this.charMod = char_mod;
    this.casterLvl = caster_lvl;
    this.profBonus = prof_bonus;
    this.email = email;
    this.cantripsKnown = cantrips_known;
    this.spellsKnown = spells_known;
    this.#passwordHash = password_hash;
  }

  static async insert({
    username,
    charName,
    charClass,
    charLvl,
    charMod,
    casterLvl,
    profBonus,
    email,
    cantripsKnown,
    spellsKnown,
    passwordHash,
  }) {
    const { rows } = await pool.query(
      `
      INSERT INTO users (username, char_name, char_class, char_lvl, char_mod, caster_lvl, prof_bonus, email, cantrips_known, spells_known, password_hash)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *
    `,
      [
        username,
        charName,
        charClass,
        charLvl,
        charMod,
        casterLvl,
        profBonus,
        email,
        cantripsKnown,
        spellsKnown,
        passwordHash,
      ]
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
    //* a series of functions add more values to the user table based on their inputs
    const casterLvl = calculateCasterLevel(newAttributes.charLvl);
    const profBonus = calculateProficiencyBonus(newAttributes.charLvl);
    const cantripsKnown = calculateCantripsKnown(
      newAttributes.charLvl,
      newAttributes.charClass
    );
    const spellsKnown = calculateSpellsKnown(
      newAttributes.charLvl,
      newAttributes.charClass
    );

    const user = await User.getById(id);
    if (!user) return null;
    const updatedInfo = {
      ...user,
      ...newAttributes,
      casterLvl,
      profBonus,
      cantripsKnown,
      spellsKnown,
    };
    const { rows } = await pool.query(
      `UPDATE users
      SET username = $2, char_name = $3, char_class = $4, char_lvl = $5, char_mod = $6, caster_lvl = $7, prof_bonus = $8, cantrips_known = $9, spells_known = $10
      WHERE id = $1
      RETURNING *`,
      [
        id,
        updatedInfo.username,
        updatedInfo.charName,
        updatedInfo.charClass,
        updatedInfo.charLvl,
        updatedInfo.charMod,
        updatedInfo.casterLvl,
        updatedInfo.profBonus,
        updatedInfo.cantripsKnown,
        updatedInfo.spellsKnown,
      ]
    );
    return new User(rows[0]);
  }

  get passwordHash() {
    return this.#passwordHash;
  }
};
