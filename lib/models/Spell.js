module.exports = class Spell {
  index;
  name;
  url;

  constructor({ index, name, url }) {
    this.index = index;
    this.name = name;
    this.url = url;
  }

  static async getAllSpells() {
    const resp = await fetch('https://www.dnd5eapi.co/api/spells');
    const spells = await resp.json();
    console.log(spells.count);
    return spells.results;
  }
};
