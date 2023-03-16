const { Router } = require('express');
const Spellbook = require('../models/Spellbook');

module.exports = Router()
  .patch('/:id/prepare', async (req, res, next) => {
    try {
      const update = await Spellbook.updateSpellPreparation({
        userId: req.user.id,
        spellId: req.params.id,
        prepared: req.body.prepared,
      });
      res.json(update);
    } catch (error) {
      next(error);
    }
  })
  .get('/prepared', async (req, res, next) => {
    try {
      const spells = await Spellbook.getPreparedSpells(req.user.id);
      if (!spells) {
        next();
      }
      res.json(spells);
    } catch (error) {
      next(error);
    }
  })
  .get('/', async (req, res, next) => {
    try {
      const spells = await Spellbook.getKnownSpells(req.user.id);
      if (!spells) {
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
