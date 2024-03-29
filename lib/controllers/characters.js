const { Router } = require('express');
const validateSpell = require('../middleware/validateSpell');
const validateSpellSlots = require('../middleware/validateSpellSlots');
const Character = require('../models/Character');
const { calculateSpellSlots } = require('../utils/stat-utils');
const KnownSpell = require('../models/KnownSpell');
// const KnownSpellService = require('../services/KnownSpellService');
const Spell = require('../models/Spell');

//* image upload stuff
// const cloudinary = require('cloudinary').v2;
// const multer = require('multer');
// const upload = multer({ dest: 'gmm-character-avatars/' });
// const { CloudinaryStorage } = require('multer-storage-cloudinary');
// cloudinary.config({
//   cloud_name: process.env.CLOUD_NAME,
//   api_key: process.env.API_KEY,
//   api_secret: process.env.API_SECRET,
// });
// const storage = new CloudinaryStorage({
//   cloudinary,
//   params: {
//     folder: 'gmm-character-avatars',
//   },
// });
// const upload = multer({ storage });

// module.exports = {
//   upload: multer({ storage }),
// };

module.exports = Router()
  //* allows a character to learn a spell
  .post('/learn', validateSpell, async (req, res, next) => {
    try {
      const spell = await Spell.getSpellById(req.body.spellId);
      const newSpell =
        spell.level === 0
          ? await KnownSpell.insertCantrip(req.user.id, req.body)
          : await KnownSpell.insertSpell(req.user.id, req.body);

      if (!newSpell) {
        next();
      }
      //TODO
      //!removing spell amount tracking for v1
      // await KnownSpellService.incrementCantripsOrSpellsKnown(
      //   req.user.id,
      //   req.body.charId,
      //   req.body.spellId
      // );
      //!--------------------------------------
      res.json(newSpell);
    } catch (error) {
      // res.send(error.message);
      console.error(error);
      next(error);
    }
  })

  //* creates a new character
  // .post('/', upload.single('avatar'), async (req, res, next) => {
  .post('/', async (req, res, next) => {
    try {
      //   if (req.body.image) {
      // const file = req.file;
      // const result = await cloudinary.uploader.upload(file.path);
      // }
      const character = await Character.insertCharacter(req.user.id, req.body);
      if (!character) {
        next();
      }

      if (
        character.charClass === 'Cleric' ||
        character.charClass === 'Druid' ||
        character.charClass === 'Paladin'
      ) {
        const availableSpells = await Spell.getAvailableSpells(
          character.charClass,
          character.casterLvl
        );
        await Promise.all(
          availableSpells.map(async (spell) => {
            if (spell.level > 0)
              await KnownSpell.insertSpell(req.user.id, {
                charId: character.id,
                spellId: spell.id,
              });
          })
        );
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

      if (
        updatedCharacter.charClass === 'Cleric' ||
        updatedCharacter.charClass === 'Druid' ||
        updatedCharacter.charClass === 'Paladin'
      ) {
        const availableSpells = await Spell.getAvailableSpells(
          updatedCharacter.charClass,
          updatedCharacter.casterLvl
        );
        const knownSpells = await KnownSpell.getKnownSpells(
          req.user.id,
          updatedCharacter.id
        );
        await Promise.all(
          availableSpells.map(async (spell) => {
            if (
              spell.level > 0 &&
              !availableSpells.includes(spell.name) &&
              !knownSpells.includes(spell.name)
            )
              await KnownSpell.insertSpell(req.user.id, {
                charId: updatedCharacter.id,
                spellId: spell.id,
              });
          })
        );
      }
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
      //TODO
      //!removing spell amount tracking for v1
      // await KnownSpellService.decrementCantripsOrSpellsKnown(
      //   req.user.id,
      //   req.params.charId,
      //   req.params.spellId
      //   );
      //!-------------------------------------
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
