const { Router } = require('express');
// const Spell = require('../models/Spell.js');
const {
  fetchAllSpells,
  fetchSpellByIndex,
  fetchAvailableSpellsByLevel,
  fetchAvailableSpellsBySchool,
} = require('../utils/fetch-utils');

module.exports = Router()
  .get('/available-spells', async (req, res, next) => {
    try {
      const spells = await fetchAvailableSpellsByLevel(req.query.level);
      res.json(spells);
    } catch (error) {
      next(error);
    }
  })
  .get('/school', async (req, res, next) => {
    try {
      const spells = await fetchAvailableSpellsBySchool(
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
      const spell = await fetchSpellByIndex(req.params.index);
      res.json(spell);
    } catch (error) {
      next(error);
    }
  })
  .get('/', async (req, res, next) => {
    try {
      const spells = await fetchAllSpells();
      res.json(spells);
      console.log(spells);
    } catch (error) {
      next(error);
    }
  });
