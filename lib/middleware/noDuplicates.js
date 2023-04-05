const Character = require('../models/Character');
const KnownSpell = require('../models/KnownSpell');

module.exports = async (req, res, next) => {
  try {
    // const character = await Character.getCharacterById(
    //   req.user.id,
    //   req.params.charId
    // );
    const knownSpells = await KnownSpell.getKnownSpells(
      req.user.id,
      req.params.charId
    );
    console.log('known spells', knownSpells);
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
