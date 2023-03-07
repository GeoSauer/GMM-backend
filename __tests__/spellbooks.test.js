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
        "prepared": false,
        "spellId": "1",
        "userId": "6",
      }
    `);

    const res = await agent.get('/api/v1/spellbook');
    expect(res.body.length).toEqual(2);
  });
  it.skip('should let users delete a known spell', async () => {
    const spell = {
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

    const learnedSpell = await agent.post('/api/v1/spells/4/learn').send(spell);
    expect(learnedSpell.body).toMatchInlineSnapshot(`
      Object {
        "id": "8",
        "prepared": false,
        "spellId": "4",
        "userId": "6",
      }
    `);

    await agent.delete('/api/v1/spellbook/4').expect(200);

    await agent.get('/api/v1/spellbook/4').expect(404);
  });
  it.skip('should let users update the preparation of a spell', async () => {
    const spell = {
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

    const learnedSpell = await agent.post('/api/v1/spells/4/learn').send(spell);
    expect(learnedSpell.body).toMatchInlineSnapshot(`
      Object {
        "id": "8",
        "prepared": false,
        "spellId": "4",
        "userId": "6",
      }
    `);
    const updatedInfo = {
      prepared: true,
    };
    const updatedSpell = await agent
      .patch('/api/v1/spellbook/4/prepare')
      .send(updatedInfo);
    expect(updatedSpell.body.prepared).toEqual(true);
  });
  it.skip('should return all prepared spells for a user', async () => {
    const spell = {
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

    const learnedSpell = await agent.post('/api/v1/spells/4/learn').send(spell);
    expect(learnedSpell.body).toMatchInlineSnapshot(`
      Object {
        "id": "8",
        "prepared": false,
        "spellId": "4",
        "userId": "6",
      }
    `);
    const updatedInfo = {
      prepared: true,
    };
    const updatedSpell = await agent
      .patch('/api/v1/spellbook/4/prepare')
      .send(updatedInfo);
    expect(updatedSpell.body.prepared).toEqual(true);
    //! everything above this line passes //
    const res = await agent.get('/api/v1/spellbook/6/prepared');
    console.log(res.body, '++-----++');
    expect(res.body.length).toEqual(1);
  });
});
