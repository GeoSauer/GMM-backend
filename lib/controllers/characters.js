const { Router } = require('express');
const Character = require('../models/Character');
const { update } = require('../services/SpellService');

module.exports = Router()
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
  .patch('/update', async (req, res, next) => {
    try {
      const character = await Character.getCharacterById(
        req.user.id,
        req.body.id
      );
      const characterUpdate = {
        ...character,
        ...req.body,
      };
      const updatedCharacter = await Character.updateCharacterInfo(
        req.user.id,
        req.body.id,
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
  .get('/:id', async (req, res, next) => {
    try {
      const character = await Character.getCharacterById(
        req.user.id,
        req.params.id
      );
      if (!character) {
        next();
      }
      res.json(character);
    } catch (error) {
      next(error);
    }
  })
  .get('/', async (req, res, next) => {
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
  .delete('/:id', async (req, res, next) => {
    try {
      const character = await Character.deleteCharacter(
        req.params.id,
        req.user.id
      );
      if (!character) {
        res.json({});
      }
      res.json(character);
    } catch (error) {
      next(error);
    }
  });
