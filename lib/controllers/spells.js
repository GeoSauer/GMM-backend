const { Router } = require('express');
const Spell = require('../models/Spell.js');

module.exports = Router()
  .get('/available-spells', async (req, res, next) => {
    try {
      const spells = await Spell.getAvailableSpellsByLevel(req.query.level);
      res.json(spells);
    } catch (error) {
      next(error);
    }
  })
  .get('/school', async (req, res, next) => {
    try {
      const spells = await Spell.getAvailableSpellsBySchool(
        req.query.level,
        req.query.school
      );
      res.json(spells);
    } catch (error) {
      next(error);
    }
  })
  .get('/:index', async (req, res, next) => {
    try {
      const spell = await Spell.getSpellByIndex(req.params.index);
      res.json(spell);
    } catch (error) {
      next(error);
    }
  })
  .get('/', async (req, res, next) => {
    try {
      const spells = await Spell.getAllSpells();
      res.json(spells);
      console.log(spells);
    } catch (error) {
      next(error);
    }
  });
