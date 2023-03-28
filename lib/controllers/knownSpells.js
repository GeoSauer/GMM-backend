const { Router } = require('express');
const KnownSpell = require('../models/KnownSpell');

module.exports = Router()
  .patch('/prepare', async (req, res, next) => {
    try {
      const update = await KnownSpell.updateSpellPreparation({
        userId: req.user.id,
        spellId: req.body.spellId,
        prepared: req.body.prepared,
      });
      res.json(update);
    } catch (error) {
      next(error);
    }
  })
  .get('/prepared', async (req, res, next) => {
    try {
      const spells = await KnownSpell.getPreparedSpells(req.user.id);
      if (!spells) {
        res.json([]);
      }
      res.json(spells);
    } catch (error) {
      next(error);
    }
  })
  .get('/', async (req, res, next) => {
    try {
      const spells = await KnownSpell.getKnownSpells(req.user.id);
      if (!spells) {
        res.json([]);
      }
      res.json(spells);
    } catch (error) {
      next(error);
    }
  })
  .delete('/:id', async (req, res, next) => {
    try {
      const spell = await KnownSpell.deleteKnownSpell(
        req.user.id,
        req.params.id
      );
      if (!spell) {
        res.json({});
      }
      res.json(spell);
    } catch (error) {
      next(error);
    }
  });
