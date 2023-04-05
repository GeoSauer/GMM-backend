const Character = require('../models/Character');

module.exports = async (req, res, next) => {
  try {
    const character = await Character.getCharacterById(
      req.user.id,
      req.params.id
    );
    req.character = character;
    next();
  } catch (error) {
    error.status = 404;
    next(error);
  }
};
