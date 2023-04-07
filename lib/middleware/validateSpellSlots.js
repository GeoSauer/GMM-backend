const Character = require('../models/Character');

module.exports = async (req, res, next) => {
  try {
    const character = await Character.getCharacterById(
      req.user.id,
      req.body.id
    );

    if (character[`level${req.body.slotLevel}SpellSlots`] === 0) {
      throw new Error(
        `You have no more level ${req.body.slotLevel} spell slots available!`
      );
    }

    next();
  } catch (error) {
    next(error);
  }
};
