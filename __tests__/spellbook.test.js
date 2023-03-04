const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const UserService = require('../lib/services/UserService');

//* Dummy user for testing
const mockUser = {
  email: 'test@example.com',
  password: '12345',
};

const mockSpell = {
  spellId: 1,
  prepared: false,
};

const registerAndLogin = async (userProps = {}) => {
  const password = userProps.password ?? mockUser.password;

  // Create an "agent" that gives us the ability
  // to store cookies between requests in a test
  const agent = request.agent(app);

  // Create a user to sign in with
  const user = await UserService.create({ ...mockUser, ...userProps });

  // ...then sign in
  const { email } = user;
  await agent.post('/api/v1/users/sessions').send({ email, password });
  return [agent, user];
};

describe.skip('spellbook routes', () => {
  beforeEach(() => {
    return setup(pool);
  });
  afterAll(() => {
    pool.end();
  });
  it('should let users update the preparation of a spell', async () => {});
  it('should let users remove a spell', async () => {});
  it('', async () => {});
  it('should return known spells for a user', async () => {
    const userInfo = {
      charClass: 'Wizard',
      charLvl: 7,
    };
    const [agent] = await registerAndLogin();
    const user = await agent.patch('/api/v1/users/6').send(userInfo);
    expect(user.body.charClass).toEqual('Wizard');
    expect(user.body.casterLvl).toEqual(4);

    const res = await agent.get('/api/v1/spellbook/known');
    expect(res.body.length).toEqual(3);
  });
  it('should return prepared spells for a user', async () => {
    const userInfo = {
      charClass: 'Wizard',
      charLvl: 7,
    };
    const [agent] = await registerAndLogin();
    const user = await agent.patch('/api/v1/users/6').send(userInfo);
    expect(user.body.charClass).toEqual('Wizard');
    expect(user.body.casterLvl).toEqual(4);

    const res = await agent.get('/api/v1/spellbook/prepared');
    expect(res.body.length).toEqual(2);
  });
});
