const getSpellIndices = (arr) => {
  const indices = [];
  arr.forEach((spell) => {
    indices.push(spell.index);
  });
  return indices;
};

const convertCharLvlToCasterLvl = (num) => {
  if (num > 16) {
    casterLvl = 9;
  } else {
    casterLvl = Math.ceil(num / 2);
  }
  return casterLvl;
};

//? this function is no longer being used
// const convertCasterLvlToSpellLvl = (num) => {
//   const params = new URLSearchParams();

//   params.set('level', 0);
//   for (let i = 1; i <= num; i++) {
//     params.append('level', i);
//   }
//   return params;
// };

module.exports = {
  getSpellIndices,
  convertCharLvlToCasterLvl,
  // convertCasterLvlToSpellLvl,
};
