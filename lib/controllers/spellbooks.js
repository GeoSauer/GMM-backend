const { Router } = require('express');
const Spellbook = require('../models/Spellbook');

module.exports = Router()
  .get('/:id', async (req, res, next) => {
    try {
      const spell = await Spellbook.getById({
        spellId: req.params.id,
        userId: req.user.id,
      });
      if (!spell) {
        next();
      }
      res.json(spell);
    } catch (error) {
      next(error);
    }
  })
  // .get('/prepared', authenticate, async (req, res, next) => {
  //   try {
  //     const user = await User.getById(req.user.id);
  //     const spells = await Spellbook.getPreparedSpells(user.id);
  //     if (!spells) {
  //       next();
  //     }
  //     res.json(spells);
  //   } catch (error) {
  //     next(error);
  //   }
  // })
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
      const spell = await Spellbook.deleteKnownSpell({
        userId: req.user.id,
        spellId: req.params.id,
      });
      if (!spell) {
        next();
      }
      res.json(spell);
    } catch (error) {
      next(error);
    }
  });
