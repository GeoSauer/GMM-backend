const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const { mockUser, registerAndLogin } = require('../lib/utils/test-utils');
const UserService = require('../lib/services/UserService');

describe('user routes', () => {
  beforeEach(() => {
    return setup(pool);
  });
  afterAll(() => {
    pool.end();
  });

  it('POST / should create a new user', async () => {
    const res = await request(app).post('/api/v1/users').send(mockUser);

    expect(res.body.email).toEqual('test@example.com');
  });

  it('POST / should sign in an existing user with an email', async () => {
    await UserService.create({ ...mockUser });
    const res = await request(app)
      .post('/api/v1/users/sessions')
      .send({ email: 'test@example.com', password: '12345' });

    expect(res.status).toEqual(200);
  });

  it('POST / should sign in an existing user with a username', async () => {
    await UserService.create({ ...mockUser });
    const res = await request(app)
      .post('/api/v1/users/sessions')
      .send({ username: 'Test', password: '12345' });

    expect(res.status).toEqual(200);
  });

  it('PATCH /update should update a user', async () => {
    const [agent] = await registerAndLogin();
    const updates = {
      charName: 'Dandelion',
      charClass: 'Bard',
      charLvl: 5,
    };
    const res = await agent.patch('/api/v1/users/update').send(updates);

    expect(res.body).toMatchInlineSnapshot(`
      Object {
        "cantripsAvailable": 3,
        "casterLvl": 3,
        "charClass": "Bard",
        "charLvl": 5,
        "charMod": 3,
        "charName": "Dandelion",
        "email": "test@example.com",
        "id": "6",
        "level1SpellSlots": 4,
        "level2SpellSlots": 3,
        "level3SpellSlots": 2,
        "level4SpellSlots": 0,
        "level5SpellSlots": 0,
        "level6SpellSlots": 0,
        "level7SpellSlots": 0,
        "level8SpellSlots": 0,
        "level9SpellSlots": 0,
        "profBonus": 3,
        "spellsAvailable": 8,
        "username": "Test",
      }
    `);
  });

  it('PATCH /update should return a 401 if no user', async () => {
    const updates = {
      charName: 'Dandelion',
      charClass: 'Bard',
      charLvl: 5,
    };
    const res = await request(app).patch('/api/v1/users/update').send(updates);

    expect(res.status).toBe(401);
  });

  it('GET /me should return all information about a user', async () => {
    const [agent] = await registerAndLogin();
    const res = await agent.get('/api/v1/users/me');

    expect(res.body).toMatchInlineSnapshot(`
          Object {
            "cantripsAvailable": 4,
            "casterLvl": 4,
            "charClass": "Wizard",
            "charLvl": 8,
            "charMod": 3,
            "charName": "CharTest",
            "email": "test@example.com",
            "id": "6",
            "level1SpellSlots": 4,
            "level2SpellSlots": 3,
            "level3SpellSlots": 3,
            "level4SpellSlots": 2,
            "level5SpellSlots": 0,
            "level6SpellSlots": 0,
            "level7SpellSlots": 0,
            "level8SpellSlots": 0,
            "level9SpellSlots": 0,
            "profBonus": 3,
            "spellsAvailable": 16,
            "username": "Test",
          }
      `);
  });

  it('GET /me should return a 401 if no user', async () => {
    const res = await request(app).get('/api/v1/users/me');

    expect(res.status).toBe(401);
  });

  it('GET / should return a user by id', async () => {
    const [agent] = await registerAndLogin();
    const res = await agent.get('/api/v1/users/');

    expect(res.body).toMatchInlineSnapshot(`
      Object {
        "cantripsAvailable": 4,
        "casterLvl": 4,
        "charClass": "Wizard",
        "charLvl": 8,
        "charMod": 3,
        "charName": "CharTest",
        "email": "test@example.com",
        "id": "6",
        "level1SpellSlots": 4,
        "level2SpellSlots": 3,
        "level3SpellSlots": 3,
        "level4SpellSlots": 2,
        "level5SpellSlots": 0,
        "level6SpellSlots": 0,
        "level7SpellSlots": 0,
        "level8SpellSlots": 0,
        "level9SpellSlots": 0,
        "profBonus": 3,
        "spellsAvailable": 16,
        "username": "Test",
      }
    `);
  });

  it('GET / should return a 401 if no user', async () => {
    const res = await request(app).get('/api/v1/users/');

    expect(res.status).toBe(401);
  });

  it('DELETE /sessions deletes the user session', async () => {
    const [agent] = await registerAndLogin();
    const resp = await agent.delete('/api/v1/users/sessions');
    expect(resp.status).toBe(204);
  });
});
