const { Router } = require('express');
const Spell = require('../models/Spell');
const SpellService = require('../services/SpellService');
const { fetchAllSpells, fetchSpellByIndex } = require('../utils/fetch-utils');

module.exports = Router()
  .get('/available/:charClass/:casterLvl', async (req, res, next) => {
    try {
      const spells = await Spell.getAvailableSpells(
        req.params.charClass,
        req.params.casterLvl
      );
      console.log(spells);
      res.json(spells);
    } catch (error) {
      next(error);
    }
  })
  // .get('/level/:casterLvl', async (req, res, next) => {
  //   try {
  //     const spells = await Spell.getSpellsByCasterLvl(req.params.casterLvl);
  //     res.json(spells);
  //   } catch (error) {
  //     next(error);
  //   }
  // })
  // .get('/class/:charClass', async (req, res, next) => {
  //   try {
  //     const spells = await Spell.getSpellsByCharClass(req.params.charClass);
  //     res.json(spells);
  //   } catch (error) {
  //     next(error);
  //   }
  // })
  .get('/all', async (req, res, next) => {
    try {
      const spells = await fetchAllSpells();
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
  });
