const { Router } = require('express');
// const Spell = require('../models/Spell');
const Spellbook = require('../models/Spellbook');

module.exports = Router()
  .patch('/:id/prepare', async (req, res, next) => {
    try {
      const update = await Spellbook.updateSpellPreparation(
        req.user.id,
        req.params.id,
        req.body
      );
      res.json(update);
    } catch (error) {
      next(error);
    }
  })
  .get('/prepared', async (req, res, next) => {
    try {
      const spells = await Spellbook.getPreparedSpells(req.user.id);
      // do you want this to 404 if there are no spells?
      if (!spells) {
        next();
      }
      res.json(spells);
    } catch (error) {
      next(error);
    }
  })
  // .get('/:id', async (req, res, next) => {
  //   try {
  //     const spell = await Spell.getSpellById(req.params.id);
  //     if (!spell) {
  //       next();
  //     }
  //     res.json(spell);
  //   } catch (error) {
  //     next(error);
  //   }
  // })
  .get('/', async (req, res, next) => {
    try {
      const spells = await Spellbook.getKnownSpells(req.user.id);
      if (!spells) {
        // same question - should this 404 if there are no spells?
        next();
      }
      res.json(spells);
    } catch (error) {
      next(error);
    }
  })
  .delete('/:id', async (req, res, next) => {
    try {
      const spell = await Spellbook.deleteKnownSpell(
        req.user.id,
        req.params.id
      );
      if (!spell) {
        next();
      }
      res.json(spell);
    } catch (error) {
      next(error);
    }
  });
