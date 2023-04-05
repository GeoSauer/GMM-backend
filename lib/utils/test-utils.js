const UserService = require('../services/UserService');
const request = require('supertest');
const app = require('../app');
const Character = require('../models/Character');

const mockUser = {
  email: 'test@example.com',
  password: '12345',
  username: 'Test',
};

const mockCharacter = {
  charName: 'CharTest',
  charClass: 'Wizard',
  charLvl: '8',
  charMod: '3',
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

module.exports = { mockUser, mockCharacter, registerAndLogin };
