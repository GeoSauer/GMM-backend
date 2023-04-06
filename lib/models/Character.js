const CharacterService = require('../services/CharacterService');
const pool = require('../utils/pool');
const {
  calculateCasterLevel,
  calculateCantripsAvailable,
  calculateProficiencyBonus,
  calculateSpellsAvailable,
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

module.exports = class Character {
  id;
  userId;
  charName;
  charClass;
  charLvl;
  charMod;
  casterLvl;
  profBonus;
  cantripsAvailable;
  cantripsKnown;
  spellsAvailable;
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

  constructor(row) {
    this.id = row.id;
    this.userId = row.user_id;
    this.charName = row.char_name;
    this.charClass = row.char_class;
    this.charLvl = row.char_lvl;
    this.charMod = row.char_mod;
    this.casterLvl = row.caster_lvl;
    this.profBonus = row.prof_bonus;
    this.cantripsAvailable = row.cantrips_available;
    this.cantripsKnown = row.cantrips_known;
    this.spellsAvailable = row.spells_available;
    this.spellsKnown = row.spells_known;
    this.level1SpellSlots = row.level_1_spell_slots;
    this.level2SpellSlots = row.level_2_spell_slots;
    this.level3SpellSlots = row.level_3_spell_slots;
    this.level4SpellSlots = row.level_4_spell_slots;
    this.level5SpellSlots = row.level_5_spell_slots;
    this.level6SpellSlots = row.level_6_spell_slots;
    this.level7SpellSlots = row.level_7_spell_slots;
    this.level8SpellSlots = row.level_8_spell_slots;
    this.level9SpellSlots = row.level_9_spell_slots;
  }

  static async insertCharacter(
    userId,
    { charName, charClass, charLvl, charMod }
  ) {
    const characterStats = await CharacterService.calculateCharacterStats(
      charLvl,
      charClass
    );
    const { rows } = await pool.query(
      `
      INSERT INTO characters (user_id, char_name, char_class, char_lvl, char_mod, caster_lvl, prof_bonus, cantrips_available, cantrips_known, spells_available, spells_known, level_1_spell_slots, level_2_spell_slots, level_3_spell_slots, level_4_spell_slots, level_5_spell_slots, level_6_spell_slots, level_7_spell_slots, level_8_spell_slots, level_9_spell_slots)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 0, $9, 0, $10, $11, $12, $13, $14, $15, $16, $17, $18)
      RETURNING *
    `,
      [
        userId,
        charName,
        charClass,
        charLvl,
        charMod,
        characterStats.casterLvl,
        characterStats.profBonus,
        characterStats.cantripsAvailable,
        characterStats.spellsAvailable,
        characterStats.level1SpellSlots,
        characterStats.level2SpellSlots,
        characterStats.level3SpellSlots,
        characterStats.level4SpellSlots,
        characterStats.level5SpellSlots,
        characterStats.level6SpellSlots,
        characterStats.level7SpellSlots,
        characterStats.level8SpellSlots,
        characterStats.level9SpellSlots,
      ]
    );

    return new Character(rows[0]);
  }

  static async updateCharacterInfo(userId, charId, newAttributes) {
    const character = await Character.getCharacterById(userId, charId);
    if (!character) return null;
    const updatedInfo = { ...character, ...newAttributes };

    updatedInfo.casterLvl = calculateCasterLevel(updatedInfo.charLvl);
    updatedInfo.profBonus = calculateProficiencyBonus(updatedInfo.charLvl);
    updatedInfo.cantripsAvailable = calculateCantripsAvailable(
      updatedInfo.charLvl,
      updatedInfo.charClass
    );
    updatedInfo.spellsAvailable = calculateSpellsAvailable(
      updatedInfo.charLvl,
      updatedInfo.charClass
    );
    updatedInfo.level1SpellSlots = calculateLevel1SpellSlots(
      updatedInfo.charLvl,
      updatedInfo.charClass
    );
    updatedInfo.level2SpellSlots = calculateLevel2SpellSlots(
      updatedInfo.charLvl,
      updatedInfo.charClass
    );
    updatedInfo.level3SpellSlots = calculateLevel3SpellSlots(
      updatedInfo.charLvl,
      updatedInfo.charClass
    );
    updatedInfo.level4SpellSlots = calculateLevel4SpellSlots(
      updatedInfo.charLvl,
      updatedInfo.charClass
    );
    updatedInfo.level5SpellSlots = calculateLevel5SpellSlots(
      updatedInfo.charLvl,
      updatedInfo.charClass
    );
    updatedInfo.level6SpellSlots = calculateLevel6SpellSlots(
      updatedInfo.charLvl,
      updatedInfo.charClass
    );
    updatedInfo.level7SpellSlots = calculateLevel7SpellSlots(
      updatedInfo.charLvl,
      updatedInfo.charClass
    );
    updatedInfo.level8SpellSlots = calculateLevel8SpellSlots(
      updatedInfo.charLvl,
      updatedInfo.charClass
    );
    updatedInfo.level9SpellSlots = calculateLevel9SpellSlots(
      updatedInfo.charLvl,
      updatedInfo.charClass
    );

    const { rows } = await pool.query(
      `UPDATE characters
SET char_name = $2, char_class = $3, char_lvl = $4, char_mod = $5, caster_lvl = $6, prof_bonus = $7, cantrips_available = $8, spells_available = $9, level_1_spell_slots = $10, level_2_spell_slots = $11, level_3_spell_slots = $12, level_4_spell_slots = $13, level_5_spell_slots = $14, level_6_spell_slots = $15, level_7_spell_slots = $16, level_8_spell_slots = $17, level_9_spell_slots = $18, cantrips_known = $20, spells_known = $21
WHERE user_id = $1 AND id = $19
RETURNING *`,
      [
        userId,
        updatedInfo.charName,
        updatedInfo.charClass,
        updatedInfo.charLvl,
        updatedInfo.charMod,
        updatedInfo.casterLvl,
        updatedInfo.profBonus,
        updatedInfo.cantripsAvailable,
        updatedInfo.spellsAvailable,
        updatedInfo.level1SpellSlots,
        updatedInfo.level2SpellSlots,
        updatedInfo.level3SpellSlots,
        updatedInfo.level4SpellSlots,
        updatedInfo.level5SpellSlots,
        updatedInfo.level6SpellSlots,
        updatedInfo.level7SpellSlots,
        updatedInfo.level8SpellSlots,
        updatedInfo.level9SpellSlots,
        charId,
        updatedInfo.cantripsKnown,
        updatedInfo.spellsKnown,
      ]
    );
    return new Character(rows[0]);
  }

  static async getCharacterById(userId, charId) {
    const { rows } = await pool.query(
      `
      SELECT *
      FROM characters
      WHERE user_id = $1 AND id = $2
      `,
      [userId, charId]
    );
    if (!rows[0]) return;
    return new Character(rows[0]);
  }

  static async getAllUserCharacters(userId) {
    const { rows } = await pool.query(
      `SELECT *
      FROM characters
      WHERE user_id = $1`,
      [userId]
    );
    if (!rows[0]) return;
    return rows.map((row) => new Character(row));
  }

  static async deleteCharacter(userId, charId) {
    const { rows } = await pool.query(
      `DELETE
      FROM characters
      WHERE user_id = $1 AND id = $2
      RETURNING *`,
      [userId, charId]
    );
    return new Character(rows[0]);
  }
};
