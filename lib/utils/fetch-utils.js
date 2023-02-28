const { convertCasterLvlToSpellLevels } = require('./spell-utils');

const fetchAllSpells = async () => {
  const resp = await fetch('https://www.dnd5eapi.co/api/spells');
  const spells = await resp.json();
  return spells.results;
};

const fetchSpellByIndex = async (index) => {
  const resp = await fetch(`https://www.dnd5eapi.co/api/spells/${index}`);
  const spell = await resp.json();
  return spell;
};

const fetchAvailableSpellsByLevel = async (charLvl) => {
  const params = convertCasterLvlToSpellLevels(charLvl);
  const resp = await fetch(
    `https://www.dnd5eapi.co/api/spells?${params.toString()}`
  );
  const spells = await resp.json();
  return spells.results;
};

const fetchAvailableSpellsBySchool = async (charLvl, school) => {
  const params = convertCasterLvlToSpellLevels(charLvl);
  params.set('school', school);
  const resp = await fetch(
    `https://www.dnd5eapi.co/api/spells?${params.toString()}`
  );
  const spells = await resp.json();
  return spells.results;
};

module.exports = {
  fetchAllSpells,
  fetchSpellByIndex,
  fetchAvailableSpellsByLevel,
  fetchAvailableSpellsBySchool,
};
