//* update() Step 1: hitting the API and fetching all the spells returns an array of objects each shaped like this:
//* {
//*   "index": "acid-arrow",
//*   "name": "Acid Arrow",
//*   "url": "/api/spells/acid-arrow"
//* }

const fetchAllSpells = async () => {
  const resp = await fetch('https://www.dnd5eapi.co/api/spells');
  const spells = await resp.json();
  return spells.results;
};

//* update() Step 2: loops through the array of spell objects and pushes the index of each spell into the indices array

const getSpellIndices = (arr) => {
  const indices = [];
  arr.forEach((spell) => {
    indices.push(spell.index);
  });
  return indices;
};

//* update() Step 3: takes in a single spell index and hits the API endpoint for that spell, returning a large spell object with gameplay/usage details. In the return the keys are changed from snake to camel case

const fetchSpellByIndex = async (index) => {
  const resp = await fetch(`https://www.dnd5eapi.co/api/spells/${index}`);
  const spell = await resp.json();
  let attackTypeTitleCase = null;
  if (spell.attack_type) {
    const attackType = spell.attack_type;
    attackTypeTitleCase = attackType.replace(
      attackType[0],
      attackType[0].toUpperCase()
    );
  }

  return {
    ...spell,
    higherLevel: spell.higher_level,
    areaOfEffect: spell.area_of_effect,
    castingTime: spell.casting_time,
    attackType: attackTypeTitleCase,
    damage: {
      damageType: spell.damage?.damage_type || null,
      damageAtCharacterLevel: spell.damage?.damage_at_character_level || null,
      damageAtSpellSlot: spell.damage?.damage_at_spell_slot || null,
    },
    saveDc: {
      saveDcType: spell.dc?.dc_type || null,
      saveDcSuccess: spell.dc?.dc_success || null,
    },
  };
};

//* update() Step 4: takes in an array of indices and maps through it, hitting the API endpoint for each spell and returning a custom object for each with just the values necessary for later querying

const fetchSpellDetails = async (arr) => {
  return Promise.all(
    arr.map(async (index) => {
      const spell = await fetchSpellByIndex(index);
      //TODO investigate timeout to spread requests out
      return {
        index: spell.index,
        name: spell.name,
        level: spell.level,
        school: spell.school.name,
        //* classes is an array that can have multiple objects in it so we map through them and return the index from each
        classes: spell.classes.map((charClass) => {
          return charClass.index;
        }),
      };
    })
  );
};

module.exports = {
  fetchAllSpells,
  getSpellIndices,
  fetchSpellByIndex,
  fetchSpellDetails,
};
