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

describe('spellbooks routes', () => {
  beforeEach(() => {
    return setup(pool);
  });
  afterAll(() => {
    pool.end();
  });
  // it('should return a single known spell by id', async () => {
  //   const newSpell = {
  //     id: 4,
  //   };
  //   const userInfo = {
  //     charClass: 'Wizard',
  //     charLvl: 7,
  //   };
  //   const [agent] = await registerAndLogin();
  //   const user = await agent.patch('/api/v1/users/6').send(userInfo);
  //   expect(user.body.charClass).toEqual('Wizard');
  //   expect(user.body.casterLvl).toEqual(4);

  //   const learnedSpell = await agent
  //     .post('/api/v1/spells/4/learn')
  //     .send(newSpell);
  //   expect(learnedSpell.body).toMatchInlineSnapshot(`
  //     Object {
  //       "id": "8",
  //       "known": true,
  //       "prepared": false,
  //       "spellId": "4",
  //       "userId": "6",
  //     }
  //   `);

  //   const res = await agent.get('/api/v1/spellbook/4');
  //   console.log(res.body);
  //   expect(res.body).toMatchInlineSnapshot(`
  //     Object {
  //       "id": "8",
  //       "known": true,
  //       "prepared": false,
  //       "spellId": "4",
  //       "userId": "6",
  //     }
  //   `);
  // });
  // it('should let users delete/unlearn a spell', async () => {
  //   const newSpell = {
  //     id: 4,
  //   };
  //   const [agent] = await registerAndLogin();
  //   const learnedSpell = await agent
  //     .post('/api/v1/spells/4/learn')
  //     .send(newSpell);
  //   expect(learnedSpell.body).toMatchInlineSnapshot(`
  //         Object {
  //           "id": "8",
  //           "known": true,
  //           "prepared": false,
  //           "spellId": "4",
  //           "userId": "6",
  //         }
  //     `);
  // });
  // it('should let users update the preparation of a spell', async () => {});

  // it('', async () => {});
  it.skip('should return all known spells for a user', async () => {
    const spell = {
      id: 4,
    };
    const spell2 = {
      id: 1,
    };
    const userInfo = {
      charClass: 'Wizard',
      charLvl: 7,
    };
    const [agent] = await registerAndLogin();
    const user = await agent.patch('/api/v1/users/6').send(userInfo);
    expect(user.body.charClass).toEqual('Wizard');
    expect(user.body.casterLvl).toEqual(4);

    const learnedSpell = await agent.post('/api/v1/spells/4/learn').send(spell);
    expect(learnedSpell.body).toMatchInlineSnapshot(`
      Object {
        "id": "8",
        "known": true,
        "prepared": false,
        "spellId": "4",
        "userId": "6",
      }
    `);
    const anotherLearnedSpell = await agent
      .post('/api/v1/spells/1/learn')
      .send(spell2);
    expect(anotherLearnedSpell.body).toMatchInlineSnapshot(`
      Object {
        "id": "9",
        "known": true,
        "prepared": false,
        "spellId": "1",
        "userId": "6",
      }
    `);

    const res = await agent.get('/api/v1/spellbook');
    expect(res.body.length).toEqual(2);
  });
  // it('should return prepared spells for a user', async () => {
  //   const userInfo = {
  //     charClass: 'Wizard',
  //     charLvl: 7,
  //   };
  //   const [agent] = await registerAndLogin();
  //   const user = await agent.patch('/api/v1/users/6').send(userInfo);
  //   expect(user.body.charClass).toEqual('Wizard');
  //   expect(user.body.casterLvl).toEqual(4);

  //   const res = await agent.get('/api/v1/spellbook/prepared');
  //   expect(res.body.length).toEqual(2);
  // });
});
