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
  let cantripsKnown = 0;
  switch (string) {
    case 'Bard':
    //fallthrough
    case 'Druid':
    //fallthrough
    case 'Warlock':
      if (num < 3) {
        cantripsKnown = 2;
      } else if (num > 3 && num < 10) {
        cantripsKnown = 3;
      } else {
        cantripsKnown = 4;
      }
      break;
    case 'Cleric':
    //fallthrough
    case 'Wizard':
      if (num < 3) {
        cantripsKnown = 3;
      } else if (num > 3 && num < 10) {
        cantripsKnown = 4;
      } else {
        cantripsKnown = 5;
      }
      break;
    case 'Sorcerer':
      if (num < 3) {
        cantripsKnown = 4;
      } else if (num > 3 && num < 10) {
        cantripsKnown = 5;
      } else {
        cantripsKnown = 6;
      }
      break;
  }
  return cantripsKnown;
};

//* the amount of spells a character is allowed to know at a given level

const calculateSpellsKnown = (num, string) => {
  let spellsKnown = 0;
  switch (string) {
    case 'Bard':
      if (num === 1) {
        spellsKnown = 4;
      } else if (num === 2) {
        spellsKnown = 5;
      } else if (num === 3) {
        spellsKnown = 6;
      } else if (num === 4) {
        spellsKnown = 7;
      } else if (num === 5) {
        spellsKnown = 8;
      } else if (num === 6) {
        spellsKnown = 9;
      } else if (num === 7) {
        spellsKnown = 10;
      } else if (num === 8) {
        spellsKnown = 11;
      } else if (num === 9) {
        spellsKnown = 12;
      } else if (num === 10) {
        spellsKnown = 14;
      } else if (num > 10 && num < 13) {
        spellsKnown = 15;
      } else if (num === 13) {
        spellsKnown = 16;
      } else if (num === 14) {
        spellsKnown = 18;
      } else if (num > 14 && num < 17) {
        spellsKnown = 19;
      } else if (num === 17) {
        spellsKnown = 20;
      } else {
        spellsKnown = 22;
      }
      break;
    case 'Sorcerer':
      if (num === 1) {
        spellsKnown = 2;
      } else if (num === 2) {
        spellsKnown = 3;
      } else if (num === 3) {
        spellsKnown = 4;
      } else if (num === 4) {
        spellsKnown = 5;
      } else if (num === 5) {
        spellsKnown = 6;
      } else if (num === 6) {
        spellsKnown = 7;
      } else if (num === 7) {
        spellsKnown = 8;
      } else if (num === 8) {
        spellsKnown = 9;
      } else if (num === 9) {
        spellsKnown = 10;
      } else if (num === 10) {
        spellsKnown = 11;
      } else if (num > 10 && num < 13) {
        spellsKnown = 12;
      } else if (num > 12 && num < 15) {
        spellsKnown = 13;
      } else if (num > 14 && num < 17) {
        spellsKnown = 14;
      } else {
        spellsKnown = 15;
      }
      break;
    case 'Ranger':
      if (num === 1) {
        spellsKnown = 0;
      } else if (num === 2) {
        spellsKnown = 2;
      } else if (num > 2 && num < 5) {
        spellsKnown = 3;
      } else if (num > 4 && num < 7) {
        spellsKnown = 4;
      } else if (num > 6 && num < 9) {
        spellsKnown = 5;
      } else if (num > 8 && num < 11) {
        spellsKnown = 6;
      } else if (num > 10 && num < 13) {
        spellsKnown = 7;
      } else if (num > 12 && num < 15) {
        spellsKnown = 8;
      } else if (num > 14 && num < 17) {
        spellsKnown = 9;
      } else if (num > 16 && num < 19) {
        spellsKnown = 10;
      } else {
        spellsKnown = 11;
      }
      break;
    case 'Warlock':
      if (num === 1) {
        spellsKnown = 2;
      } else if (num === 2) {
        spellsKnown = 3;
      } else if (num === 3) {
        spellsKnown = 4;
      } else if (num === 4) {
        spellsKnown = 5;
      } else if (num === 5) {
        spellsKnown = 6;
      } else if (num === 6) {
        spellsKnown = 7;
      } else if (num === 7) {
        spellsKnown = 8;
      } else if (num === 8) {
        spellsKnown = 9;
      } else if (num > 8 && num < 11) {
        spellsKnown = 10;
      } else if (num > 10 && num < 13) {
        spellsKnown = 11;
      } else if (num > 12 && num < 15) {
        spellsKnown = 12;
      } else if (num > 14 && num < 17) {
        spellsKnown = 13;
      } else if (num > 16 && num < 19) {
        spellsKnown = 14;
      } else {
        spellsKnown = 15;
        break;
      }
  }
  return spellsKnown;
};

//* the amount of spell slots of differing levels a character is allowed at a given level

const calculateLevel1SpellSlots = (num, string) => {
  let level1SpellSlots = 0;
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
      if (num === 1) {
        level1SpellSlots = 2;
      } else if (num === 2) {
        level1SpellSlots = 3;
      } else {
        level1SpellSlots = 4;
      }
      break;
    case 'Paladin':
    //fallthrough
    case 'Ranger':
      if (num === 1) {
        level1SpellSlots = 0;
      } else if (num === 2) {
        level1SpellSlots = 2;
      } else if (num > 2 && num < 5) {
        level1SpellSlots = 3;
      } else {
        level1SpellSlots = 4;
      }
      break;
    case 'Warlock':
      if (num === 1) {
        level1SpellSlots = 1;
      } else if (num === 2) {
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
      if (num < 3) {
        level2SpellSlots = 0;
      } else if (num === 3) {
        level2SpellSlots = 2;
      } else {
        level2SpellSlots = 3;
      }
      break;
    case 'Paladin':
    //fallthrough
    case 'Ranger':
      if (num < 5) {
        level2SpellSlots = 0;
      } else if (num > 4 && num < 7) {
        level2SpellSlots = 2;
      } else {
        level2SpellSlots = 3;
      }
      break;
    case 'Warlock':
      if (num === 3 || num === 4) {
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
      if (num < 5) {
        level3SpellSlots = 0;
      } else if (num === 5) {
        level3SpellSlots = 2;
      } else {
        level3SpellSlots = 3;
      }
      break;
    case 'Paladin':
    //fallthrough
    case 'Ranger':
      if (num < 9) {
        level3SpellSlots = 0;
      } else if (num > 8 && num < 11) {
        level3SpellSlots = 2;
      } else {
        level3SpellSlots = 3;
      }
      break;
    case 'Warlock':
      if (num === 5 || num === 6) {
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
      if (num < 7) {
        level4SpellSlots = 0;
      } else if (num === 7) {
        level4SpellSlots = 1;
      } else if (num === 8) {
        level4SpellSlots = 2;
      } else {
        level4SpellSlots = 3;
      }
      break;
    case 'Paladin':
    //fallthrough
    case 'Ranger':
      if (num < 13) {
        level4SpellSlots = 0;
      } else if (num > 12 && num < 15) {
        level4SpellSlots = 1;
      } else if (num > 14 && num < 17) {
        level4SpellSlots = 2;
      } else {
        level4SpellSlots = 3;
      }
      break;
    case 'Warlock':
      if (num === 7 || num === 8) {
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
      if (num < 9) {
        level5SpellSlots = 0;
      } else if (num === 9) {
        level5SpellSlots = 1;
      } else if (num === 10) {
        level5SpellSlots = 2;
      } else {
        level5SpellSlots = 3;
      }
      break;
    case 'Paladin':
    //fallthrough
    case 'Ranger':
      if (num < 17) {
        level5SpellSlots = 0;
      } else if (num > 16 && num < 19) {
        level5SpellSlots = 1;
      } else {
        level5SpellSlots = 2;
      }
      break;
    case 'Warlock':
      if (num === 3 || num === 4) {
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
      if (num < 11) {
        level6SpellSlots = 0;
      } else if (num > 10 && num < 19) {
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
      if (num < 13) {
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
      if (num < 15) {
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
      if (num < 17) {
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
  calculateLevel7SpellSlots,
  calculateLevel8SpellSlots,
  calculateLevel9SpellSlots,
};

//? this function is no longer being used, but it was really cool
// const convertCasterLvlToSpellLvl = (num) => {
//   const params = new URLSearchParams();

//   params.set('level', 0);
//   for (let i = 1; i <= num; i++) {
//     params.append('level', i);
//   }
//   return params;
// };
