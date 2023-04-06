const Character = require('../models/Character');
const Spell = require('../models/Spell');

module.exports = class CharacterService {
  static async updateCantripsAndSpellsKnown({ userId, charId, spellId }) {
    const spell = await Spell.getSpellById(spellId);
    const character = await Character.getCharacterById(userId, charId);
    const newAttributes = {};
    if (spell.level === 0) {
      newAttributes.cantripsKnown = character.cantripsKnown + 1;
    } else {
      newAttributes.spellsKnown = character.spellsKnown + 1;
    }
    await Character.updateCharacterInfo(userId, charId, newAttributes);
  }
};
