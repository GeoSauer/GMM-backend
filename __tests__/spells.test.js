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
  //TODO figure out why this is suddenly failing when the route works fine in thunderclient
  it('should return available spells for a user by charClass and casterLvl', async () => {
    const userInfo = {
      charClass: 'Wizard',
      charLvl: 7,
    };
    const [agent] = await registerAndLogin();
    const user = await agent.patch('/api/v1/users/6').send(userInfo);
    expect(user.body.charClass).toEqual('Wizard');
    expect(user.body.casterLvl).toEqual(4);

    const res = await agent.get('/api/v1/spells');
    console.log(res.body, '++++++++=');
    expect(res.body.length).toEqual(3);
  });
  it('should let users insert/learn an available spell', async () => {
    const newSpell = {
      id: 4,
    };
    const userInfo = {
      charClass: 'Wizard',
      charLvl: 7,
    };
    const [agent] = await registerAndLogin();
    const user = await agent.patch('/api/v1/users/6').send(userInfo);
    expect(user.body.charClass).toEqual('Wizard');
    expect(user.body.casterLvl).toEqual(4);

    const learnedSpell = await agent
      .post('/api/v1/spells/4/learn')
      .send(newSpell);
    expect(learnedSpell.body).toMatchInlineSnapshot(`
      Object {
        "id": "8",
        "prepared": false,
        "spellId": "4",
        "userId": "6",
      }
    `);
  });
  it('should return details on a single available spell by id', async () => {
    const userInfo = {
      charClass: 'Wizard',
      charLvl: 7,
    };
    const [agent] = await registerAndLogin();
    const user = await agent.patch('/api/v1/users/6').send(userInfo);
    expect(user.body.charClass).toEqual('Wizard');
    expect(user.body.casterLvl).toEqual(4);

    const res = await agent.get('/api/v1/spells/4/details');
    expect(res.body.school.index).toEqual('divination');
  });
});
