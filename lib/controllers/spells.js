const { Router } = require('express');
const authorize = require('../middleware/authorize');
const noDuplicates = require('../middleware/noDuplicates');
const Spell = require('../models/Spell');
const Spellbook = require('../models/Spellbook');
const SpellService = require('../services/SpellService');
const { fetchSpellByIndex } = require('../utils/fetch-utils');

module.exports = Router()
  .get('/:id/details', async (req, res, next) => {
    try {
      const spell = await Spell.getSpellById(req.params.id);
      if (!spell) {
        next();
      }
      const details = await fetchSpellByIndex(spell.index);
      res.json(details);
    } catch (error) {
      next(error);
    }
  })
  .get('/', async (req, res, next) => {
    try {
      const spells = await Spell.getAvailableSpells(
        req.user.charClass,
        req.user.casterLvl
      );
      if (!spells) {
        next();
      }
      res.json(spells);
    } catch (error) {
      next(error);
    }
  })
  .post('/:id/learn', noDuplicates, async (req, res, next) => {
    try {
      const spell = await Spellbook.insertKnownSpell({
        userId: req.user.id,
        spellId: req.params.id,
        prepared: false,
      });
      if (!spell) {
        next();
      }
      res.json(spell);
    } catch (error) {
      next(error);
    }
  })
  .post('/update', authorize, async (req, res, next) => {
    try {
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
