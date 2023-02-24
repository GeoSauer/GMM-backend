const { Router } = require('express');
const Spell = require('../models/Spell.js');

module.exports = Router().get('/', async (req, res, next) => {
  try {
    const spells = await Spell.getAllSpells();
    res.json(spells);
  } catch (error) {
    next(error);
  }
});
