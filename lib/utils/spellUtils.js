const convertCharLvlToCasterLvl = (num) => {
  if (num > 16) {
    casterLvl = 9;
  } else {
    casterLvl = Math.ceil(num / 2);
  }
  return casterLvl;
};

const convertCasterLvlToSpellLevels = (num) => {
  const params = new URLSearchParams();

  params.set('level', 0);
  for (let i = 1; i <= num; i++) {
    params.append('level', i);
  }
  return params;
};

module.exports = { convertCharLvlToCasterLvl, convertCasterLvlToSpellLevels };
