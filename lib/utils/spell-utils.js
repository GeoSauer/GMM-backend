//* caster level is how a player determines what level of spell they given access to, this is just a helper function so that the user can enter one less piece of information in their profile

const calculateCasterLevel = (num) => {
  let casterLvl = 0;
  if (num > 16) {
    casterLvl = 9;
  } else {
    casterLvl = Math.ceil(num / 2);
  }
  return casterLvl;
};

//* proficiency bonus is a general bonus that increases with character level to reflect their growing proficiency in their skills over time

const calculateProficiencyBonus = (num) => {
  let profBonus = 0;
  if (num < 5) {
    profBonus = 2;
  } else if (num > 4 && num < 9) {
    profBonus = 3;
  } else if (num > 8 && num < 13) {
    profBonus = 4;
  } else if (num > 12 && num < 17) {
    profBonus = 5;
  } else {
    profBonus = 6;
  }
  return profBonus;
};

//* the amount of cantrips a character is allowed to know at a given level

const calculateCantripsKnown = (num, string) => {
  let cantripsAvailable = 0;
  switch (string) {
    case 'Bard':
    //fallthrough
    case 'Druid':
    //fallthrough
    case 'Warlock':
      if (num < 3) {
        cantripsAvailable = 2;
      } else if (num > 3 && num < 10) {
        cantripsAvailable = 3;
      } else {
        cantripsAvailable = 4;
      }
      break;
    case 'Cleric':
    //fallthrough
    case 'Wizard':
      if (num < 3) {
        cantripsAvailable = 3;
      } else if (num > 3 && num < 10) {
        cantripsAvailable = 4;
      } else {
        cantripsAvailable = 5;
      }
      break;
    case 'Sorcerer':
      if (num < 3) {
        cantripsAvailable = 4;
      } else if (num > 3 && num < 10) {
        cantripsAvailable = 5;
      } else {
        cantripsAvailable = 6;
      }
      break;
  }
  return cantripsAvailable;
};

//* the amount of spells a character is allowed to know at a given level

const calculateSpellsKnown = (num, string) => {
  let spellsAvailable = 0;
  const level = +num;
  switch (string) {
    case 'Bard':
      if (level < 11) {
        spellsAvailable = level + 3;
      } else if (level > 10 && level < 13) {
        spellsAvailable = 15;
      } else if (level === 13) {
        spellsAvailable = 16;
      } else if (level === 14) {
        spellsAvailable = 18;
      } else if (level > 14 && level < 17) {
        spellsAvailable = 19;
      } else if (level === 17) {
        spellsAvailable = 20;
      } else {
        spellsAvailable = 22;
      }
      break;
    case 'Sorcerer':
      if (level < 11) {
        spellsAvailable = level + 1;
      } else if (level > 10 && level < 13) {
        spellsAvailable = 12;
      } else if (level > 12 && level < 15) {
        spellsAvailable = 13;
      } else if (level > 14 && level < 17) {
        spellsAvailable = 14;
      } else {
        spellsAvailable = 15;
      }
      break;
    case 'Ranger':
      if (level === 1) {
        spellsAvailable = 0;
      } else if (level === 2) {
        spellsAvailable = 2;
      } else if (level > 2 && level < 5) {
        spellsAvailable = 3;
      } else if (level > 4 && level < 7) {
        spellsAvailable = 4;
      } else if (level > 6 && level < 9) {
        spellsAvailable = 5;
      } else if (level > 8 && level < 11) {
        spellsAvailable = 6;
      } else if (level > 10 && level < 13) {
        spellsAvailable = 7;
      } else if (level > 12 && level < 15) {
        spellsAvailable = 8;
      } else if (level > 14 && level < 17) {
        spellsAvailable = 9;
      } else if (level > 16 && level < 19) {
        spellsAvailable = 10;
      } else {
        spellsAvailable = 11;
      }
      break;
    case 'Warlock':
      if (level < 9) {
        spellsAvailable = level + 1;
      } else if (level > 8 && level < 11) {
        spellsAvailable = 10;
      } else if (level > 10 && level < 13) {
        spellsAvailable = 11;
      } else if (level > 12 && level < 15) {
        spellsAvailable = 12;
      } else if (level > 14 && level < 17) {
        spellsAvailable = 13;
      } else if (level > 16 && level < 19) {
        spellsAvailable = 14;
      } else {
        spellsAvailable = 15;
      }
      break;
    case 'Wizard':
      if (level === 1) {
        spellsAvailable = 6;
      } else {
        spellsAvailable = level + 8;
      }
      break;
  }
  return spellsAvailable;
};

//* the amount of spell slots of differing levels a character is allowed at a given level

const calculateLevel1SpellSlots = (num, string) => {
  let level1SpellSlots = 0;
  const level = +num;
  switch (string) {
    case 'Bard':
    //fallthrough
    case 'Cleric':
    //fallthrough
    case 'Druid':
    //fallthrough
    case 'Sorcerer':
    //fallthrough
    case 'Wizard':
      if (level === 1) {
        level1SpellSlots = 2;
      } else if (level === 2) {
        level1SpellSlots = 3;
      } else {
        level1SpellSlots = 4;
      }
      break;
    case 'Paladin':
    //fallthrough
    case 'Ranger':
      if (level === 1) {
        level1SpellSlots = 0;
      } else if (level === 2) {
        level1SpellSlots = 2;
      } else if (level > 2 && level < 5) {
        level1SpellSlots = 3;
      } else {
        level1SpellSlots = 4;
      }
      break;
    case 'Warlock':
      if (level === 1) {
        level1SpellSlots = 1;
      } else if (level === 2) {
        level1SpellSlots = 2;
      } else {
        level1SpellSlots = 0;
      }
      break;
  }
  return level1SpellSlots;
};

const calculateLevel2SpellSlots = (num, string) => {
  let level2SpellSlots = 0;
  const level = +num;
  switch (string) {
    case 'Bard':
    //fallthrough
    case 'Cleric':
    //fallthrough
    case 'Druid':
    //fallthrough
    case 'Sorcerer':
    //fallthrough
    case 'Wizard':
      if (level < 3) {
        level2SpellSlots = 0;
      } else if (level === 3) {
        level2SpellSlots = 2;
      } else {
        level2SpellSlots = 3;
      }
      break;
    case 'Paladin':
    //fallthrough
    case 'Ranger':
      if (level < 5) {
        level2SpellSlots = 0;
      } else if (level > 4 && level < 7) {
        level2SpellSlots = 2;
      } else {
        level2SpellSlots = 3;
      }
      break;
    case 'Warlock':
      if (level === 3 || level === 4) {
        level2SpellSlots = 2;
      } else {
        level2SpellSlots = 0;
      }
      break;
  }
  return level2SpellSlots;
};

const calculateLevel3SpellSlots = (num, string) => {
  let level3SpellSlots = 0;
  const level = +num;
  switch (string) {
    case 'Bard':
    //fallthrough
    case 'Cleric':
    //fallthrough
    case 'Druid':
    //fallthrough
    case 'Sorcerer':
    //fallthrough
    case 'Wizard':
      if (level < 5) {
        level3SpellSlots = 0;
      } else if (level === 5) {
        level3SpellSlots = 2;
      } else {
        level3SpellSlots = 3;
      }
      break;
    case 'Paladin':
    //fallthrough
    case 'Ranger':
      if (level < 9) {
        level3SpellSlots = 0;
      } else if (level > 8 && level < 11) {
        level3SpellSlots = 2;
      } else {
        level3SpellSlots = 3;
      }
      break;
    case 'Warlock':
      if (level === 5 || level === 6) {
        level3SpellSlots = 2;
      } else {
        level3SpellSlots = 0;
      }
      break;
  }
  return level3SpellSlots;
};

const calculateLevel4SpellSlots = (num, string) => {
  let level4SpellSlots = 0;
  const level = +num;
  switch (string) {
    case 'Bard':
    //fallthrough
    case 'Cleric':
    //fallthrough
    case 'Druid':
    //fallthrough
    case 'Sorcerer':
    //fallthrough
    case 'Wizard':
      if (level < 7) {
        level4SpellSlots = 0;
      } else if (+level === 7) {
        level4SpellSlots = 1;
      } else if (+level === 8) {
        level4SpellSlots = 2;
      } else {
        level4SpellSlots = 3;
      }
      break;
    case 'Paladin':
    //fallthrough
    case 'Ranger':
      if (level < 13) {
        level4SpellSlots = 0;
      } else if (level > 12 && level < 15) {
        level4SpellSlots = 1;
      } else if (level > 14 && level < 17) {
        level4SpellSlots = 2;
      } else {
        level4SpellSlots = 3;
      }
      break;
    case 'Warlock':
      if (level === 7 || level === 8) {
        level4SpellSlots = 2;
      } else {
        level4SpellSlots = 0;
      }
      break;
  }
  return level4SpellSlots;
};

const calculateLevel5SpellSlots = (num, string) => {
  let level5SpellSlots = 0;
  const level = +num;
  switch (string) {
    case 'Bard':
    //fallthrough
    case 'Cleric':
    //fallthrough
    case 'Druid':
    //fallthrough
    case 'Sorcerer':
    //fallthrough
    case 'Wizard':
      if (level < 9) {
        level5SpellSlots = 0;
      } else if (level === 9) {
        level5SpellSlots = 1;
      } else if (level === 10) {
        level5SpellSlots = 2;
      } else {
        level5SpellSlots = 3;
      }
      break;
    case 'Paladin':
    //fallthrough
    case 'Ranger':
      if (level < 17) {
        level5SpellSlots = 0;
      } else if (level > 16 && level < 19) {
        level5SpellSlots = 1;
      } else {
        level5SpellSlots = 2;
      }
      break;
    case 'Warlock':
      if (level === 3 || level === 4) {
        level5SpellSlots = 2;
      } else {
        level5SpellSlots = 0;
      }
      break;
  }
  return level5SpellSlots;
};

const calculateLevel6SpellSlots = (num, string) => {
  let level6SpellSlots = 0;
  const level = +num;
  switch (string) {
    case 'Bard':
    //fallthrough
    case 'Cleric':
    //fallthrough
    case 'Druid':
    //fallthrough
    case 'Sorcerer':
    //fallthrough
    case 'Wizard':
      if (level < 11) {
        level6SpellSlots = 0;
      } else if (level > 10 && level < 19) {
        level6SpellSlots = 1;
      } else {
        level6SpellSlots = 2;
      }
      break;
  }
  return level6SpellSlots;
};

const calculateLevel7SpellSlots = (num, string) => {
  let level7SpellSlots = 0;
  const level = +num;
  switch (string) {
    case 'Bard':
    //fallthrough
    case 'Cleric':
    //fallthrough
    case 'Druid':
    //fallthrough
    case 'Sorcerer':
    //fallthrough
    case 'Wizard':
      if (level < 13) {
        level7SpellSlots = 0;
      } else {
        level7SpellSlots = 1;
      }
      break;
  }
  return level7SpellSlots;
};

const calculateLevel8SpellSlots = (num, string) => {
  let level8SpellSlots = 0;
  const level = +num;
  switch (string) {
    case 'Bard':
    //fallthrough
    case 'Cleric':
    //fallthrough
    case 'Druid':
    //fallthrough
    case 'Sorcerer':
    //fallthrough
    case 'Wizard':
      if (level < 15) {
        level8SpellSlots = 0;
      } else {
        level8SpellSlots = 1;
      }
      break;
  }
  return level8SpellSlots;
};

const calculateLevel9SpellSlots = (num, string) => {
  let level9SpellSlots = 0;
  const level = +num;
  switch (string) {
    case 'Bard':
    //fallthrough
    case 'Cleric':
    //fallthrough
    case 'Druid':
    //fallthrough
    case 'Sorcerer':
    //fallthrough
    case 'Wizard':
      if (level < 17) {
        level9SpellSlots = 0;
      } else {
        level9SpellSlots = 1;
      }
      break;
  }
  return level9SpellSlots;
};

module.exports = {
  calculateCasterLevel,
  calculateProficiencyBonus,
  calculateCantripsKnown,
  calculateSpellsKnown,
  calculateLevel1SpellSlots,
  calculateLevel2SpellSlots,
  calculateLevel3SpellSlots,
  calculateLevel4SpellSlots,
  calculateLevel5SpellSlots,
  calculateLevel6SpellSlots,
  calculateLevel7SpellSlots,
  calculateLevel8SpellSlots,
  calculateLevel9SpellSlots,
};
