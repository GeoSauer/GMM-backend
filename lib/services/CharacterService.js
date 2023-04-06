const {
  calculateCasterLevel,
  calculateProficiencyBonus,
  calculateCantripsAvailable,
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

module.exports = class CharacterService {
  static async calculateCharacterStats(charLvl, charClass) {
    const characterStats = {};
    characterStats.casterLvl = calculateCasterLevel(charLvl);
    characterStats.profBonus = calculateProficiencyBonus(charLvl);
    characterStats.cantripsAvailable = calculateCantripsAvailable(
      charLvl,
      charClass
    );
    characterStats.spellsAvailable = calculateSpellsAvailable(
      charLvl,
      charClass
    );
    characterStats.level1SpellSlots = calculateLevel1SpellSlots(
      charLvl,
      charClass
    );
    characterStats.level2SpellSlots = calculateLevel2SpellSlots(
      charLvl,
      charClass
    );
    characterStats.level3SpellSlots = calculateLevel3SpellSlots(
      charLvl,
      charClass
    );
    characterStats.level4SpellSlots = calculateLevel4SpellSlots(
      charLvl,
      charClass
    );
    characterStats.level5SpellSlots = calculateLevel5SpellSlots(
      charLvl,
      charClass
    );
    characterStats.level6SpellSlots = calculateLevel6SpellSlots(
      charLvl,
      charClass
    );
    characterStats.level7SpellSlots = calculateLevel7SpellSlots(
      charLvl,
      charClass
    );
    characterStats.level8SpellSlots = calculateLevel8SpellSlots(
      charLvl,
      charClass
    );
    characterStats.level9SpellSlots = calculateLevel9SpellSlots(
      charLvl,
      charClass
    );
    return characterStats;
  }

  static async updateCharacterStats(updatedInfo) {
    const characterStats = { ...updatedInfo };
    characterStats.casterLvl = calculateCasterLevel(updatedInfo.charLvl);
    characterStats.profBonus = calculateProficiencyBonus(updatedInfo.charLvl);
    characterStats.cantripsAvailable = calculateCantripsAvailable(
      updatedInfo.charLvl,
      updatedInfo.charClass
    );
    characterStats.spellsAvailable = calculateSpellsAvailable(
      updatedInfo.charLvl,
      updatedInfo.charClass
    );
    characterStats.level1SpellSlots = calculateLevel1SpellSlots(
      updatedInfo.charLvl,
      updatedInfo.charClass
    );
    characterStats.level2SpellSlots = calculateLevel2SpellSlots(
      updatedInfo.charLvl,
      updatedInfo.charClass
    );
    characterStats.level3SpellSlots = calculateLevel3SpellSlots(
      updatedInfo.charLvl,
      updatedInfo.charClass
    );
    characterStats.level4SpellSlots = calculateLevel4SpellSlots(
      updatedInfo.charLvl,
      updatedInfo.charClass
    );
    characterStats.level5SpellSlots = calculateLevel5SpellSlots(
      updatedInfo.charLvl,
      updatedInfo.charClass
    );
    characterStats.level6SpellSlots = calculateLevel6SpellSlots(
      updatedInfo.charLvl,
      updatedInfo.charClass
    );
    characterStats.level7SpellSlots = calculateLevel7SpellSlots(
      updatedInfo.charLvl,
      updatedInfo.charClass
    );
    characterStats.level8SpellSlots = calculateLevel8SpellSlots(
      updatedInfo.charLvl,
      updatedInfo.charClass
    );
    characterStats.level9SpellSlots = calculateLevel9SpellSlots(
      updatedInfo.charLvl,
      updatedInfo.charClass
    );
    return characterStats;
  }
};
