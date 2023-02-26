const { Router } = require('express');
const Spell = require('../models/Spell.js');

module.exports = Router()
  .get('/available-spells', async (req, res, next) => {
    try {
      const spells = await Spell.getAvailableSpells(
        req.query.class.toLocaleLowerCase(),
        req.query.level
      );
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
