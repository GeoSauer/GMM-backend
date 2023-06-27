const UserService = require('../services/UserService');
const request = require('supertest');
const app = require('../app');
const Character = require('../models/Character');

const mockUser = {
  email: 'test@example.com',
  password: '12345',
  username: 'Test',
};
const mockUserUpdate = {
  username: 'TestUpdate',
};
const mockCharacter = {
  charName: 'CharTest',
  charClass: 'Wizard',
  charLvl: '8',
  charMod: '3',
  // image: '../images/test-image.png',
  // avatar:
  //   'https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80',
};
const mockDruid = {
  charName: 'CharTest',
  charClass: 'Druid',
  charLvl: '8',
  charMod: '3',
  // image: '../images/test-image.png',
  // avatar:
  //   'https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80',
};
const mockPaladin = {
  charName: 'CharTest',
  charClass: 'Paladin',
  charLvl: '8',
  charMod: '3',
  // image: '../images/test-image.png',
  // avatar:
  //   'https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80',
};
const mockCleric = {
  charName: 'CharTest',
  charClass: 'Cleric',
  charLvl: '8',
  charMod: '3',
  // image: '../images/test-image.png',
  // avatar:
  //   'https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80',
};
const mockCharacterUpdate = {
  charId: 1,
  charName: 'NewCharName',
};
const mockSpell = {
  charId: 1,
  spellId: 4,
};
const mockCantrip = {
  charId: 1,
  spellId: 1,
};
const mockKnownSpell = {
  charId: 1,
  spellId: 4,
};
const mockKnownSpellUpdate = {
  charId: 1,
  spellId: 4,
  prepared: true,
};
const mockCastSpell = {
  charId: 1,
  slotLevel: 2,
};

const registerAndLogin = async (userProps = {}) => {
  const password = userProps.password ?? mockUser.password;

  // Create an "agent" that gives us the ability
  // to store cookies between requests in a test
  const agent = request.agent(app);

  // Create a user to sign in with
  const user = await UserService.create({ ...mockUser, ...userProps });
  const character = await Character.insertCharacter(user.id, {
    ...mockCharacter,
  });
  // ...then sign in
  const { email } = user;
  await agent.post('/api/v1/users/sessions').send({ email, password });
  return { agent, user, character };
};

module.exports = {
  mockUser,
  mockUserUpdate,
  mockCharacter,
  mockCleric,
  mockDruid,
  mockPaladin,
  mockCharacterUpdate,
  mockSpell,
  mockCantrip,
  mockKnownSpell,
  mockKnownSpellUpdate,
  mockCastSpell,
  registerAndLogin,
};
