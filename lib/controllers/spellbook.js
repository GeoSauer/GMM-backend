const { Router } = require('express');
const authenticate = require('../middleware/authenticate');
const Spell = require('../models/Spell');
const User = require('../models/User');

module.exports = Router()
  .get('/known', authenticate, async (req, res, next) => {
    try {
      const user = await User.getById(req.user.id);
      const spells = await Spell.getKnownSpells(user.id);
      if (!spells) {
        next();
      }
      res.json(spells);
    } catch (error) {
      next(error);
    }
  })
  .get('/prepared', authenticate, async (req, res, next) => {
    try {
      const user = await User.getById(req.user.id);
      const spells = await Spell.getPreparedSpells(user.id);
      if (!spells) {
        next();
      }
      res.json(spells);
    } catch (error) {
      next(error);
    }
  });
