const { Router } = require('express');
const authorize = require('../middleware/authorize');
const noDuplicates = require('../middleware/noDuplicates');
const Spell = require('../models/Spell');
const KnownSpell = require('../models/KnownSpell');
const SpellService = require('../services/SpellService');
const { fetchSpellByIndex } = require('../utils/fetch-utils');
const Character = require('../models/Character');
const CharacterService = require('../services/CharacterService');

module.exports = Router()
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
  .get('/:charId', async (req, res, next) => {
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
      );
      if (!spells) {
        next();
      }
      res.json(spells);
    } catch (error) {
      next(error);
    }
  })
  .post('/:charId/learn', noDuplicates, async (req, res, next) => {
    try {
      const spell = await KnownSpell.insertKnownSpell({
        userId: req.user.id,
        charId: req.params.charId,
        spellId: req.body.id,
      });
      if (!spell) {
        next();
      }
      await CharacterService.updateCantripsAndSpellsKnown({
        userId: req.user.id,
        charId: req.params.charId,
        spellId: req.body.id,
      });
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
