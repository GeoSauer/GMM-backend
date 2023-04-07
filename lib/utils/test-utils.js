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
};
const mockCharacterUpdate = {
  id: 1,
  charName: 'NewCharName',
};
const mockSpell = {
  charId: 1,
  id: 4,
};
const mockKnownSpell = {
  userId: 1,
  charId: 1,
  spellId: 4,
};
const mockKnownSpellUpdate = {
  charId: 1,
  spellId: 4,
  prepared: true,
};
const mockCastSpell = {
  id: 1,
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
  mockCharacterUpdate,
  mockSpell,
  mockKnownSpell,
  mockKnownSpellUpdate,
  mockCastSpell,
  registerAndLogin,
};
