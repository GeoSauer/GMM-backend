const KnownSpell = require('../models/KnownSpell');

module.exports = async (req, res, next) => {
  try {
    const spells = await KnownSpell.getKnownSpells(req.user.id);
    if (spells) {
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
