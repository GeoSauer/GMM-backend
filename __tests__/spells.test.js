const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const UserService = require('../lib/services/UserService');

// Dummy user for testing
const mockUser = {
  email: 'test@example.com',
  password: '12345',
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

describe('spell routes', () => {
  beforeEach(() => {
    return setup(pool);
  });
  afterAll(() => {
    pool.end();
  });

  it('should fetch a complete list of spells', async () => {
    const [agent] = await registerAndLogin();
    const res = await agent.get('/api/v1/spells');
    expect(res.body.length).toEqual(319);
  });

  it('should fetch details on a specific spell', async () => {
    const [agent] = await registerAndLogin();
    const res = await agent.get('/api/v1/spells/blur');
    expect(res.body.index).toEqual('blur');
  });

  it('should get available spells by user charClass', async () => {
    const userInfo = {
      charClass: 'Wizard',
      charLvl: 7,
    };
    const [agent] = await registerAndLogin();
    const user = await agent.patch('/api/v1/users/1').send(userInfo);
    expect(user.body.charClass).toEqual('Wizard');

    const res = await agent.get('/api/v1/spells/class/Wizard');
    expect(res.body.length).toEqual(4);
  });
  it('should get available spells by user casterLvl', async () => {
    const userInfo = {
      charLvl: 7,
    };
    const [agent] = await registerAndLogin();
    const user = await agent.patch('/api/v1/users/1').send(userInfo);
    expect(user.body.casterLvl).toEqual(4);

    const res = await agent.get('/api/v1/spells/level/4');
    expect(res.body.length).toEqual(3);
  });
  it('should get available spells by user charClass and casterLvl', async () => {
    const userInfo = {
      charClass: 'Wizard',
      charLvl: 7,
    };
    const [agent] = await registerAndLogin();
    const user = await agent.patch('/api/v1/users/1').send(userInfo);
    expect(user.body.charClass).toEqual('Wizard');
    expect(user.body.casterLvl).toEqual(4);

    const res = await agent.get('/api/v1/spells/class/Wizard/4');
    expect(res.body.length).toEqual(3);
  });
});
