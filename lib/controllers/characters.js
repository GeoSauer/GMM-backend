const { Router } = require('express');
const Character = require('../models/Character');

module.exports = Router()
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

  //* returns all characters for a user
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
  });
