const { Router } = require('express');
const authenticate = require('../middleware/authenticate');
const Spell = require('../models/Spell');
const Spellbook = require('../models/Spellbook');
const User = require('../models/User');

module.exports = Router()
  .get('/:id', authenticate, async (req, res, next) => {
    try {
      const user = User.getById(req.user.id);
      const spell = await Spellbook.getById({
        userId: user.id,
        spellId: req.params.id,
      });
      if (!spell) {
        next();
      }
      res.json(spell);
    } catch (error) {
      next(error);
    }
  })
  .get('/prepared', authenticate, async (req, res, next) => {
    try {
      const user = await User.getById(req.user.id);
      const spells = await Spellbook.getPreparedSpells(user.id);
      if (!spells) {
        next();
      }
      res.json(spells);
    } catch (error) {
      next(error);
    }
  })
  .get('/', authenticate, async (req, res, next) => {
    try {
      const user = await User.getById(req.user.id);
      const spells = await Spellbook.getKnownSpells(user.id);
      if (!spells) {
        next();
      }
      res.json(spells);
    } catch (error) {
      next(error);
    }
  });
