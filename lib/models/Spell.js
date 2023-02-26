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
    return spells.results;
  }

  static async getAvailableSpells(charClass, casterLvl) {
    const params = new URLSearchParams();
    params.set('class', charClass);
    params.set('level', casterLvl);

    const resp = await fetch(
      `https://www.dnd5eapi.co/api/spells?${params.toString()}`
    );
    const spells = await resp.json();
    return spells.results;
  }
};
