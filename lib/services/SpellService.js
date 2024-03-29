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
    const detailedSpells = await fetchSpellDetails(indices);
    //* pared down fetch call for testing to limit API calls
    // const detailedSpells = await fetchSpellDetails(indices.slice(0, 20));

    detailedSpells.map(async (spell) => {
      Spell.insert(spell);
    });
  }
};
