const Character = require('../models/Character');
const KnownSpell = require('../models/KnownSpell');

module.exports = async (req, res, next) => {
  try {
    const character = await Character.getCharacterById(
      req.user.id,
      req.params.charId
    );
    const knownSpells = await KnownSpell.getKnownSpells(
      req.user.id,
      req.params.charId
    );

    if (character.cantripsKnown === character.cantripsAvailable) {
      throw new Error(
        'You already know the max amount of cantrips for your level!'
      );
    }
    if (character.spellsKnown === character.spellsAvailable) {
      throw new Error(
        'You already know the max amount of spells for your level!'
      );
    }

    if (knownSpells) {
      knownSpells.forEach((spell) => {
        if (req.body.id === spell.id) {
          throw new Error('You already know this spell!');
        }
      });
    }

    next();
  } catch (error) {
    next(error);
  }
};
