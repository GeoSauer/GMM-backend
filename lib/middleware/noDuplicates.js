const Spellbook = require('../models/Spellbook');

module.exports = async (req, res, next) => {
  try {
    const spells = await Spellbook.getKnownSpells(req.user.id);
    if (!spells === undefined) {
      spells.forEach((spell) => {
        if (req.params.id === spell.id) {
          throw new Error('You already know this spell!');
        }
      });
    }

    next();
  } catch (error) {
    next(error);
  }
};
