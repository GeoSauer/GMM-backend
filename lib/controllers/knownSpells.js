const { Router } = require('express');
const KnownSpell = require('../models/KnownSpell');

module.exports = Router()
  .patch('/:charId/prepare', async (req, res, next) => {
    try {
      const update = await KnownSpell.updateSpellPreparation(req.user.id, {
        charId: req.params.charId,
        spellId: req.body.spellId,
        prepared: req.body.prepared,
      });
      res.json(update);
    } catch (error) {
      next(error);
    }
  })
  .get('/:charId/prepared', async (req, res, next) => {
    try {
      const spells = await KnownSpell.getPreparedSpells(
        req.user.id,
        req.params.charId
      );
      if (!spells) {
        res.json([]);
      }
      res.json(spells);
    } catch (error) {
      next(error);
    }
  })
  .get('/:charId', async (req, res, next) => {
    try {
      const spells = await KnownSpell.getKnownSpells(
        req.user.id,
        req.params.charId
      );
      if (!spells) {
        res.json([]);
      }
      res.json(spells);
    } catch (error) {
      next(error);
    }
  })
  .delete('/:charId/:spellId', async (req, res, next) => {
    try {
      const spell = await KnownSpell.deleteKnownSpell(
        req.params.charId,
        req.params.spellId
      );
      if (!spell) {
        res.json({});
      }
      res.json(spell);
    } catch (error) {
      next(error);
    }
  });
