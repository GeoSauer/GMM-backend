const { Router } = require('express');
const authorize = require('../middleware/authorize');
const Spell = require('../models/Spell');
const KnownSpell = require('../models/KnownSpell');
const SpellService = require('../services/SpellService');
const { fetchSpellByIndex } = require('../utils/fetch-utils');
const Character = require('../models/Character');

module.exports = Router()
  //* returns details on a single spell
  .get('/:spellId/details', async (req, res, next) => {
    try {
      const spell = await Spell.getSpellById(req.params.spellId);
      if (!spell) {
        next();
      }
      const details = await fetchSpellByIndex(spell.index);
      res.json(details);
    } catch (error) {
      next(error);
    }
  })

  //* returns all available spells for a character
  .get('/:charId/available', async (req, res, next) => {
    // const { limit, offset } = req.query;
    try {
      const character = await Character.getCharacterById(
        req.user.id,
        req.params.charId
      );
      if (!character) {
        next();
      }
      const spells = await Spell.getAvailableSpells(
        character.charClass,
        character.casterLvl
        // limit,
        // offset
      );
      if (!spells) {
        next();
      }
      res.json(spells);
    } catch (error) {
      next(error);
    }
  })

  //* returns all known spells for a character
  .get('/:charId/known', async (req, res, next) => {
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

  //* returns all prepared spells for a character
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

  //* returns all spells regardless of class
  .get('/all', async (req, res, next) => {
    // const { offset, batchSize } = req.query;
    try {
      // const spells = await Spell.getAllSpells(offset, batchSize);
      const spells = await Spell.getAllSpells();
      if (!spells) {
        next();
      }
      res.json(spells);
    } catch (error) {
      next(error);
    }
  })

  //* allows admin to fetch spell data from an external api to populate the connected database
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
