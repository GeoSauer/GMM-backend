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

const calculateCantripsKnown = (num, string) => {
  const expr = string;
  let cantripsKnown = 0;
  switch (expr) {
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

const calculateSpellsKnown = (num, string) => {
  const expr = string;
  let spellsKnown = 0;
  switch (expr) {
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

module.exports = {
  calculateCasterLevel,
  calculateProficiencyBonus,
  calculateCantripsKnown,
  calculateSpellsKnown,
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
