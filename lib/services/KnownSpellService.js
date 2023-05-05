const Character = require('../models/Character');
const Spell = require('../models/Spell');

//TODO
//!removing spell amount tracking for v1
// module.exports = class KnownSpellService {
//   static async incrementCantripsOrSpellsKnown(userId, charId, spellId) {
//     const spell = await Spell.getSpellById(spellId);
//     const character = await Character.getCharacterById(userId, charId);
//     const newAttributes = { ...character };

//     if (spell.level === 0) {
//       newAttributes.cantripsKnown = character.cantripsKnown + 1;
//     } else {
//       newAttributes.spellsKnown = character.spellsKnown + 1;
//     }
//     await Character.updateCantripsOrSpellsKnown(userId, newAttributes);
//   }

//   static async decrementCantripsOrSpellsKnown(userId, charId, spellId) {
//     const spell = await Spell.getSpellById(spellId);
//     const character = await Character.getCharacterById(userId, charId);
//     const newAttributes = { ...character };
//     const level = spell.level;

//     switch (level) {
//       case 0:
//         if (character.cantripsKnown > 0) {
//           newAttributes.cantripsKnown = character.cantripsKnown - 1;
//         }
//         break;
//       default:
//         if (character.spellsKnown > 0) {
//           newAttributes.spellsKnown = character.spellsKnown - 1;
//         }
//         break;
//     }
//     await Character.updateCantripsOrSpellsKnown(userId, newAttributes);
//   }
// };
//!---------------------------------------
