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

describe.skip('spell routes', () => {
  beforeEach(() => {
    return setup(pool);
  });
  afterAll(() => {
    pool.end();
  });

  it('should return a complete list of spells', async () => {
    const [agent] = await registerAndLogin();
    const res = await agent.get('/api/v1/spells');
    expect(res.body.length).toEqual(319);
  });

  it('should return a list of spells filtered by user class and level', async () => {
    const userInfo = {
      charClass: 'Cleric',
      charLvl: 3,
    };
    const [agent] = await registerAndLogin();
    const user = await agent.patch('/api/v1/users/1').send(userInfo);
    expect(user.body.charClass).toEqual('Cleric');
    expect(user.body.charLvl).toEqual(3);

    const res = await agent.get(
      '/api/v1/spells/available-spells?level=3&class=cleric'
    );
    expect(res.body.length).toEqual(42);
  });
});
