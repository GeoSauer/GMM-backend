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

describe('spell routes', () => {
  beforeEach(() => {
    return setup(pool);
  });
  afterAll(() => {
    pool.end();
  });

  it.skip('should return available spells for a user by charClass and casterLvl', async () => {
    const userInfo = {
      charClass: 'Wizard',
      charLvl: 7,
    };
    const [agent] = await registerAndLogin();
    const user = await agent.patch('/api/v1/users/6').send(userInfo);
    expect(user.body.charClass).toEqual('Wizard');
    expect(user.body.casterLvl).toEqual(4);

    const res = await agent.get('/api/v1/spells');
    expect(res.body.length).toEqual(3);
  });
  it.skip('should let users insert/learn an available spell', async () => {
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

  //TODO I think detail view is the only other route needed here?
  //? unnecessary? modify into the detail route? ✅
  //! need to make this hit 5e/spells/${index}
  // it('should return details on a single available spell by id', async () => {
  //   const userInfo = {
  //     charClass: 'Wizard',
  //     charLvl: 7,
  //   };
  //   const [agent] = await registerAndLogin();
  //   const user = await agent.patch('/api/v1/users/6').send(userInfo);
  //   expect(user.body.charClass).toEqual('Wizard');
  //   expect(user.body.casterLvl).toEqual(4);

  //   const res = await agent.get('/api/v1/spells/4');
  //   expect(res.body.school).toEqual('divination');
  // });
});

//? these tests are no longer needed
// it('should fetch a complete list of spells', async () => {
//   const res = await request(app).get('/api/v1/spells/all');
//   expect(res.body.length).toEqual(319);
// });

// it('should fetch details on a specific spell', async () => {
//   const res = await request(app).get('/api/v1/spells/blur');
//   expect(res.body.name).toEqual('Blur');
// });
