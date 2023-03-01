const Spell = require('../models/Spell');
const { fetchAllSpells, fetchSpellDetails } = require('../utils/fetch-utils');
const { getSpellIndices } = require('../utils/spell-utils');

module.exports = class SpellService {
  static async update() {
    const spells = await fetchAllSpells();
    const indices = getSpellIndices(spells);
    //TODO run this guy fully when ready to have the db loaded up
    // const detailedSpells = await fetchSpellDetails(indices);
    const detailedSpells = await fetchSpellDetails(indices.slice(0, 5));

    detailedSpells.map(async (spell) => {
      Spell.insert(spell);
    });
  }
};
