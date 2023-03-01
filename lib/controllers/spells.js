const { Router } = require('express');
const SpellService = require('../services/SpellService');
const {
  fetchAllSpells,
  fetchSpellByIndex,
  // fetchAvailableSpellsByLevel,
  // fetchAvailableSpellsBySchool,
} = require('../utils/fetch-utils');

module.exports = Router()
  // this path is protected because it requires a dev tool to hit
  .post('/update', async (req, res, next) => {
    try {
      // and further protected by obsfucating the password in a header
      if (req.headers.auth !== process.env.PASSWORD) {
        res.send('not authorized');
      }
      await SpellService.update();
      res.status(200);
      res.send('Spells updated successfully!');
    } catch (error) {
      next(error);
    }
  })
  //? these routes are no longer needed
  // .get('/available-spells', async (req, res, next) => {
  //   try {
  //     const spells = await fetchAvailableSpellsByLevel(req.query.level);
  //     res.json(spells);
  //   } catch (error) {
  //     next(error);
  //   }
  // })
  // .get('/school', async (req, res, next) => {
  //   try {
  //     const spells = await fetchAvailableSpellsBySchool(
  //       req.query.level,
  //       req.query.school
  //     );
  //     res.json(spells);
  //   } catch (error) {
  //     next(error);
  //   }
  // })
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
    } catch (error) {
      next(error);
    }
  });
