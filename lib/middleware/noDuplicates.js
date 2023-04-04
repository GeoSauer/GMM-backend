const KnownSpell = require('../models/KnownSpell');

module.exports = async (req, res, next) => {
  try {
    const knownSpells = await KnownSpell.getKnownSpells(req.user.id);
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
