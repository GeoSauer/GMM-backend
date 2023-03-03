//* caster level is how a player determines what level of spell they given access to, this is just a helper function so that the user can enter one less piece of information in their profile

const convertCharLvlToCasterLvl = (num) => {
  let casterLvl = 0;
  if (num > 16) {
    casterLvl = 9;
  } else {
    casterLvl = Math.ceil(num / 2);
  }
  return casterLvl;
};

module.exports = {
  convertCharLvlToCasterLvl,
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
