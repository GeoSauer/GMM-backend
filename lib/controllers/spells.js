const { Router } = require('express');
const Spell = require('../models/Spell.js');

module.exports = Router()
  .get('/available-spells', async (req, res, next) => {
    try {
      const spells = await Spell.getAvailableSpellsByLevel(req.query.level);
      console.log('req.query:', req.query);
      console.log('req.params:', req.params);
      res.json(spells);
    } catch (error) {
      next(error);
    }
  })
  .get('/', async (req, res, next) => {
    try {
      const spells = await Spell.getAllSpells();
      res.json(spells);
    } catch (error) {
      next(error);
    }
  });
