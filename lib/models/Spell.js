const { convertCasterLvlToSpellLevels } = require('../utils/spellUtils');

module.exports = class Spell {
  index;
  name;
  level;
  school;
  classes;

  constructor({ index, name, level, school, classes }) {
    this.index = index;
    this.name = name;
    this.level = level;
    this.school = school;
    this.classes = classes;
  }

  static async getAllSpells() {
    const resp = await fetch('https://www.dnd5eapi.co/api/spells');
    const spells = await resp.json();
    return spells.results;
  }

  static async getSpellByIndex(index) {
    const resp = await fetch(`https://www.dnd5eapi.co/api/spells/${index}`);
    const spell = await resp.json();
    return spell;
  }

  static async getAvailableSpellsByLevel(charLvl) {
    const params = convertCasterLvlToSpellLevels(charLvl);
    const resp = await fetch(
      `https://www.dnd5eapi.co/api/spells?${params.toString()}`
    );
    const spells = await resp.json();
    return spells.results;
  }

  static async getAvailableSpellsBySchool(charLvl, school) {
    const params = convertCasterLvlToSpellLevels(charLvl);
    params.set('school', school);
    const resp = await fetch(
      `https://www.dnd5eapi.co/api/spells?${params.toString()}`
    );
    const spells = await resp.json();
    return spells.results;
  }
};
