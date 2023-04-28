const { Router } = require('express');
const validateSpell = require('../middleware/validateSpell');
const validateSpellSlots = require('../middleware/validateSpellSlots');
const Character = require('../models/Character');
const { calculateSpellSlots } = require('../utils/stat-utils');
const KnownSpell = require('../models/KnownSpell');
const KnownSpellService = require('../services/KnownSpellService');
const Spell = require('../models/Spell');

module.exports = Router()
  //* allows a character to learn a spell
  //TODO disable prettier here so lines 88-96 stop getting flagged by eslint for indents
  .post('/learn', validateSpell, async (req, res, next) => {
    try {
      const spell = await Spell.getSpellById(req.body.spellId);
      const newSpell =
        spell.level === 0
          ? await KnownSpell.insertCantrip({
            userId: req.user.id,
            charId: req.body.charId,
            spellId: req.body.spellId,
          })
          : await KnownSpell.insertSpell({
            userId: req.user.id,
            charId: req.body.charId,
            spellId: req.body.spellId,
          });

      if (!newSpell) {
        next();
      }
      await KnownSpellService.incrementCantripsOrSpellsKnown(
        req.user.id,
        req.body.charId,
        req.body.spellId
      );
      res.json(newSpell);
    } catch (error) {
      // res.send(error.message);
      // console.error(error);
      next(error);
    }
  })

  //* creates a new character
  .post('/', async (req, res, next) => {
    try {
      const character = await Character.insertCharacter(req.user.id, {
        charName: req.body.charName,
        charClass: req.body.charClass,
        charLvl: req.body.charLvl,
        charMod: req.body.charMod,
      });
      if (!character) {
        next();
      }
      res.json(character);
    } catch (error) {
      next(error);
    }
  })

  //* updates an existing character
  .patch('/update', async (req, res, next) => {
    try {
      const character = await Character.getCharacterById(
        req.user.id,
        req.body.charId
      );
      const characterUpdate = {
        ...character,
        ...req.body,
      };
      const updatedCharacter = await Character.updateCharacterInfo(
        req.user.id,
        characterUpdate
      );
      if (!updatedCharacter) {
        next();
      }
      res.json(updatedCharacter);
    } catch (error) {
      next(error);
    }
  })

  //* returns all characters for a user
  .get('/all', async (req, res, next) => {
    try {
      const characters = await Character.getAllUserCharacters(req.user.id);
      if (!characters) {
        next();
      }
      res.json(characters);
    } catch (error) {
      next(error);
    }
  })

  //* returns a single character
  .get('/:charId', async (req, res, next) => {
    try {
      const character = await Character.getCharacterById(
        req.user.id,
        req.params.charId
      );
      if (!character) {
        next();
      }
      res.json(character);
    } catch (error) {
      next(error);
    }
  })

  //* deletes a known spell
  .delete('/:charId/:spellId', async (req, res, next) => {
    try {
      const spell = await KnownSpell.deleteKnownSpell(
        req.params.charId,
        req.params.spellId
      );
      if (!spell) {
        res.json({});
      }
      await KnownSpellService.decrementCantripsOrSpellsKnown(
        req.user.id,
        req.params.charId,
        req.params.spellId
      );
      res.json(spell);
    } catch (error) {
      next(error);
    }
  })

  //* deletes a character
  .delete('/:charId', async (req, res, next) => {
    try {
      const character = await Character.deleteCharacter(
        req.user.id,
        req.params.charId
      );
      if (!character) {
        res.json({});
      }
      res.json(character);
    } catch (error) {
      next(error);
    }
  })

  //* allows a character to cast a spell
  .patch('/cast', validateSpellSlots, async (req, res, next) => {
    try {
      const character = await Character.getCharacterById(
        req.user.id,
        req.body.charId
      );
      const updatedSpellSlots = calculateSpellSlots(
        character,
        req.body.slotLevel
      );
      const characterUpdate = {
        ...character,
        ...updatedSpellSlots,
      };

      const updatedCharacter = await Character.updateSpellSlots(
        req.user.id,
        characterUpdate
      );
      if (!updatedCharacter) {
        next();
      }
      res.json(updatedCharacter);
    } catch (error) {
      next(error);
    }
  })

  //* updates the preparation of a spell
  .patch('/prepare', async (req, res, next) => {
    try {
      const update = await KnownSpell.updateSpellPreparation(req.user.id, {
        charId: req.body.charId,
        spellId: req.body.spellId,
        prepared: req.body.prepared,
      });
      res.json(update);
    } catch (error) {
      next(error);
    }
  });
