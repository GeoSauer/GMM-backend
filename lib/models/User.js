const pool = require('../utils/pool');
const {
  calculateCasterLevel,
  calculateCantripsKnown,
  calculateProficiencyBonus,
  calculateSpellsKnown,
  calculateLevel1SpellSlots,
  calculateLevel2SpellSlots,
  calculateLevel3SpellSlots,
  calculateLevel4SpellSlots,
  calculateLevel5SpellSlots,
  calculateLevel6SpellSlots,
  calculateLevel7SpellSlots,
  calculateLevel8SpellSlots,
  calculateLevel9SpellSlots,
} = require('../utils/spell-utils');

module.exports = class User {
  id;
  username;
  email;
  #passwordHash; // private class field: hides it from anything outside of this class definition
  charName;
  charClass;
  charLvl;
  charMod;
  casterLvl;
  profBonus;
  cantripsKnown;
  spellsKnown;
  level1SpellSlots;
  level2SpellSlots;
  level3SpellSlots;
  level4SpellSlots;
  level5SpellSlots;
  level6SpellSlots;
  level7SpellSlots;
  level8SpellSlots;
  level9SpellSlots;

  constructor({
    id,
    username,
    email,
    password_hash,
    char_name,
    char_class,
    char_lvl,
    char_mod,
    caster_lvl,
    prof_bonus,
    cantrips_known,
    spells_known,
    level_1_spell_slots,
    level_2_spell_slots,
    level_3_spell_slots,
    level_4_spell_slots,
    level_5_spell_slots,
    level_6_spell_slots,
    level_7_spell_slots,
    level_8_spell_slots,
    level_9_spell_slots,
  }) {
    this.id = id;
    this.username = username;
    this.email = email;
    this.#passwordHash = password_hash;
    this.charName = char_name;
    this.charClass = char_class;
    this.charLvl = char_lvl;
    this.charMod = char_mod;
    this.casterLvl = caster_lvl;
    this.profBonus = prof_bonus;
    this.cantripsKnown = cantrips_known;
    this.spellsKnown = spells_known;
    this.level1SpellSlots = level_1_spell_slots;
    this.level2SpellSlots = level_2_spell_slots;
    this.level3SpellSlots = level_3_spell_slots;
    this.level4SpellSlots = level_4_spell_slots;
    this.level5SpellSlots = level_5_spell_slots;
    this.level6SpellSlots = level_6_spell_slots;
    this.level7SpellSlots = level_7_spell_slots;
    this.level8SpellSlots = level_8_spell_slots;
    this.level9SpellSlots = level_9_spell_slots;
  }

  static async insert({
    username,
    email,
    passwordHash,
    charName,
    charClass,
    charLvl,
    charMod,
  }) {
    const casterLvl = calculateCasterLevel(charLvl);
    const profBonus = calculateProficiencyBonus(charLvl);
    const cantripsKnown = calculateCantripsKnown(charLvl, charClass);
    const spellsKnown = calculateSpellsKnown(charLvl, charClass);
    const level1SpellSlots = calculateLevel1SpellSlots(charLvl, charClass);
    const level2SpellSlots = calculateLevel2SpellSlots(charLvl, charClass);
    const level3SpellSlots = calculateLevel3SpellSlots(charLvl, charClass);
    const level4SpellSlots = calculateLevel4SpellSlots(charLvl, charClass);
    const level5SpellSlots = calculateLevel5SpellSlots(charLvl, charClass);
    const level6SpellSlots = calculateLevel6SpellSlots(charLvl, charClass);
    const level7SpellSlots = calculateLevel7SpellSlots(charLvl, charClass);
    const level8SpellSlots = calculateLevel8SpellSlots(charLvl, charClass);
    const level9SpellSlots = calculateLevel9SpellSlots(charLvl, charClass);
    const userProps = {
      casterLvl,
      profBonus,
      cantripsKnown,
      spellsKnown,
      level1SpellSlots,
      level2SpellSlots,
      level3SpellSlots,
      level4SpellSlots,
      level5SpellSlots,
      level6SpellSlots,
      level7SpellSlots,
      level8SpellSlots,
      level9SpellSlots,
    };

    const { rows } = await pool.query(
      `
      INSERT INTO users (username, email, password_hash, char_name, char_class, char_lvl, char_mod, caster_lvl, prof_bonus, cantrips_known, spells_known, level_1_spell_slots, level_2_spell_slots, level_3_spell_slots, level_4_spell_slots, level_5_spell_slots, level_6_spell_slots, level_7_spell_slots, level_8_spell_slots, level_9_spell_slots)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20)
      RETURNING *
    `,
      [
        username,
        email,
        passwordHash,
        charName,
        charClass,
        charLvl,
        charMod,
        userProps.casterLvl,
        userProps.profBonus,
        userProps.cantripsKnown,
        userProps.spellsKnown,
        userProps.level1SpellSlots,
        userProps.level2SpellSlots,
        userProps.level3SpellSlots,
        userProps.level4SpellSlots,
        userProps.level5SpellSlots,
        userProps.level6SpellSlots,
        userProps.level7SpellSlots,
        userProps.level8SpellSlots,
        userProps.level9SpellSlots,
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
    //* a series of functions add more values to the user table based on user inputs
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
    const level1SpellSlots = calculateLevel1SpellSlots(
      newAttributes.charLvl,
      newAttributes.charClass
    );
    const level2SpellSlots = calculateLevel2SpellSlots(
      newAttributes.charLvl,
      newAttributes.charClass
    );
    const level3SpellSlots = calculateLevel3SpellSlots(
      newAttributes.charLvl,
      newAttributes.charClass
    );
    const level4SpellSlots = calculateLevel4SpellSlots(
      newAttributes.charLvl,
      newAttributes.charClass
    );
    const level5SpellSlots = calculateLevel5SpellSlots(
      newAttributes.charLvl,
      newAttributes.charClass
    );
    const level6SpellSlots = calculateLevel6SpellSlots(
      newAttributes.charLvl,
      newAttributes.charClass
    );
    const level7SpellSlots = calculateLevel7SpellSlots(
      newAttributes.charLvl,
      newAttributes.charClass
    );
    const level8SpellSlots = calculateLevel8SpellSlots(
      newAttributes.charLvl,
      newAttributes.charClass
    );
    const level9SpellSlots = calculateLevel9SpellSlots(
      newAttributes.charLvl,
      newAttributes.charClass
    );

    //* grabs a specific user to update
    const user = await User.getById(id);
    if (!user) return null;
    const updatedInfo = {
      ...user,
      ...newAttributes,
      casterLvl,
      profBonus,
      cantripsKnown,
      spellsKnown,
      level1SpellSlots,
      level2SpellSlots,
      level3SpellSlots,
      level4SpellSlots,
      level5SpellSlots,
      level6SpellSlots,
      level7SpellSlots,
      level8SpellSlots,
      level9SpellSlots,
    };
    const { rows } = await pool.query(
      `UPDATE users
      SET username = $2, char_name = $3, char_class = $4, char_lvl = $5, char_mod = $6, caster_lvl = $7, prof_bonus = $8, cantrips_known = $9, spells_known = $10, level_1_spell_slots = $11, level_2_spell_slots = $12, level_3_spell_slots = $13, level_4_spell_slots = $14, level_5_spell_slots = $15, level_6_spell_slots = $16, level_7_spell_slots = $17, level_8_spell_slots = $18, level_9_spell_slots = $19 
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
        updatedInfo.level1SpellSlots,
        updatedInfo.level2SpellSlots,
        updatedInfo.level3SpellSlots,
        updatedInfo.level4SpellSlots,
        updatedInfo.level5SpellSlots,
        updatedInfo.level6SpellSlots,
        updatedInfo.level7SpellSlots,
        updatedInfo.level8SpellSlots,
        updatedInfo.level9SpellSlots,
      ]
    );
    return new User(rows[0]);
  }

  get passwordHash() {
    return this.#passwordHash;
  }
};
