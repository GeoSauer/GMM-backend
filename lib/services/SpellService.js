const Character = require('../models/Character');
const Spell = require('../models/Spell');
const {
  fetchAllSpells,
  fetchSpellDetails,
  getSpellIndices,
} = require('../utils/fetch-utils');

//* this fires when the protected /update route is hit and populates the gmm database with data pulled from the 5e API
module.exports = class SpellService {
  static async update() {
    const spells = await fetchAllSpells();
    const indices = getSpellIndices(spells);
    //TODO run this guy fully when ready to have the db loaded up
    // const detailedSpells = await fetchSpellDetails(indices);
    //* pared down fetch call for testing to limit API calls
    //TODO circle back and investigate why detailedSpells is returning undefined in the timeout
    // let detailedSpells;
    // setTimeout(async () => {
    const detailedSpells = await fetchSpellDetails(indices.slice(0, 20));
    // }, 1000);

    detailedSpells.map(async (spell) => {
      Spell.insert(spell);
    });
  }

  static async updateCantripsAndSpellsKnown({ userId, charId, spellId }) {
    const spell = await Spell.getSpellById(spellId);
    const character = await Character.getCharacterById(userId, charId);
    const newAttributes = {};

    if (spell.level === 0) {
      newAttributes.cantripsKnown = character.cantripsKnown + 1;
    } else {
      newAttributes.spellsKnown = character.spellsKnown + 1;
    }

    await Character.updateCharacterInfo(userId, charId, newAttributes);
  }
};
