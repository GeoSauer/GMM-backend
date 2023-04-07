const CharacterService = require('../services/CharacterService');
const pool = require('../utils/pool');
module.exports = class Character {
  constructor(row) {
    this.id = row.id;
    this.userId = row.user_id;
    this.charName = row.char_name;
    this.charClass = row.char_class;
    this.charLvl = row.char_lvl;
    this.charMod = row.char_mod;
    this.casterLvl = row.caster_lvl;
    this.profBonus = row.prof_bonus;
    this.saveDC = row.save_dc;
    this.attackBonus = row.attack_bonus;
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
      charClass,
      charMod
    );
    const { rows } = await pool.query(
      `
      INSERT INTO characters (user_id, char_name, char_class, char_lvl, char_mod, caster_lvl, prof_bonus, save_dc, attack_bonus, cantrips_available, cantrips_known, spells_available, spells_known, level_1_spell_slots, level_2_spell_slots, level_3_spell_slots, level_4_spell_slots, level_5_spell_slots, level_6_spell_slots, level_7_spell_slots, level_8_spell_slots, level_9_spell_slots)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, 0, $11, 0, $12, $13, $14, $15, $16, $17, $18, $19, $20)
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
        characterStats.saveDC,
        characterStats.attackBonus,
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

  static async updateCharacterInfo(userId, charId, characterUpdate) {
    const characterStats = await CharacterService.updateCharacterStats(
      characterUpdate
    );

    const { rows } = await pool.query(
      `UPDATE characters
SET char_name = $3, char_class = $4, char_lvl = $5, char_mod = $6, caster_lvl = $7, prof_bonus = $8, save_dc = $9, attack_bonus = $10, cantrips_available = $11, cantrips_known = $12, spells_available = $13, spells_known = $14, level_1_spell_slots = $15, level_2_spell_slots = $16, level_3_spell_slots = $17, level_4_spell_slots = $18, level_5_spell_slots = $19, level_6_spell_slots = $20, level_7_spell_slots = $21, level_8_spell_slots = $22, level_9_spell_slots = $23   
WHERE user_id = $1 AND id = $2
RETURNING *`,
      [
        userId,
        charId,
        characterStats.charName,
        characterStats.charClass,
        characterStats.charLvl,
        characterStats.charMod,
        characterStats.casterLvl,
        characterStats.profBonus,
        characterStats.saveDC,
        characterStats.attackBonus,
        characterStats.cantripsAvailable,
        characterStats.cantripsKnown,
        characterStats.spellsKnown,
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

  static async updateSpellSlots(userId, charId, characterUpdate) {
    const { rows } = await pool.query(
      `UPDATE characters
      SET level_1_spell_slots = $3, level_2_spell_slots = $4, level_3_spell_slots = $5, level_4_spell_slots = $6, level_5_spell_slots = $7, level_6_spell_slots = $8, level_7_spell_slots = $9, level_8_spell_slots = $10, level_9_spell_slots = $11
      WHERE user_id = $1 AND id = $2
      RETURNING *
      `,
      [
        userId,
        charId,
        characterUpdate.level1SpellSlots,
        characterUpdate.level2SpellSlots,
        characterUpdate.level3SpellSlots,
        characterUpdate.level4SpellSlots,
        characterUpdate.level5SpellSlots,
        characterUpdate.level6SpellSlots,
        characterUpdate.level7SpellSlots,
        characterUpdate.level8SpellSlots,
        characterUpdate.level9SpellSlots,
      ]
    );
    return new Character(rows[0]);
  }
};
