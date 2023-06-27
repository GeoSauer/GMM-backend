const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const {
  mockCharacter,
  registerAndLogin,
  mockCharacterUpdate,
  mockSpell,
  mockCantrip,
  mockCastSpell,
  mockKnownSpell,
  mockKnownSpellUpdate,
  mockCleric,
  mockDruid,
  mockPaladin,
} = require('../lib/utils/test-utils');
const KnownSpell = require('../lib/models/KnownSpell');
const demoCleanup = require('../lib/tasks/demoUserCleanup');
const dbCleanup = require('../lib/tasks/dbCleanup');

describe('character routes', () => {
  beforeEach(() => {
    return setup(pool);
  });
  afterAll(async () => {
    await dbCleanup();
    demoCleanup.stop();
    pool.end();
  });

  it('POST / should create a new character', async () => {
    const { agent } = await registerAndLogin();

    const { body } = await agent.post('/api/v1/characters').send(mockCharacter);

    expect(body.charClass).toEqual('Wizard');
  });

  it('POST / creating a Cleric, Druid, or Paladin should make all available spells known by default', async () => {
    const { agent } = await registerAndLogin();

    await agent.post('/api/v1/characters').send(mockCleric);
    await agent.post('/api/v1/characters').send(mockDruid);
    await agent.post('/api/v1/characters').send(mockPaladin);

    const clericRes = await agent.get('/api/v1/spells/2/known');
    const druidRes = await agent.get('/api/v1/spells/3/known');
    const paladinRes = await agent.get('/api/v1/spells/4/known');

    expect(clericRes.body.length).toEqual(2);
    expect(druidRes.body.length).toEqual(1);
    expect(paladinRes.body.length).toEqual(0);
  });

  it('PATCH /update should update an existing character', async () => {
    const { agent } = await registerAndLogin();

    const { body } = await agent
      .patch('/api/v1/characters/update')
      .send(mockCharacterUpdate);

    expect(body.charName).toEqual('NewCharName');
  });

  it('GET /:charId should return a character by id', async () => {
    const { agent } = await registerAndLogin();

    const { body } = await agent.get('/api/v1/characters/1').expect(200);

    expect(body).toMatchInlineSnapshot(`
      Object {
        "attackBonus": 6,
        "casterLvl": 4,
        "charClass": "Wizard",
        "charLvl": 8,
        "charMod": 3,
        "charName": "CharTest",
        "id": "1",
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
        "saveDC": 14,
        "userId": "1",
      }
    `);
  });

  it('GET /all should return all characters for a user', async () => {
    const { agent } = await registerAndLogin();

    const { body } = await agent.get('/api/v1/characters/all');

    expect(body).toMatchInlineSnapshot(`
      Array [
        Object {
          "attackBonus": 6,
          "casterLvl": 4,
          "charClass": "Wizard",
          "charLvl": 8,
          "charMod": 3,
          "charName": "CharTest",
          "id": "1",
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
          "saveDC": 14,
          "userId": "1",
        },
      ]
    `);
  });

  it('DELETE /:charId should delete a character', async () => {
    const { agent } = await registerAndLogin();

    await agent.delete('/api/v1/characters/1').expect(200);

    await agent.get('/api/v1/characters/1').expect(404);
  });

  it('POST /learn should let characters insert/learn an available spell', async () => {
    const { agent } = await registerAndLogin();

    const { body } = await agent
      .post('/api/v1/characters/learn')
      .send(mockSpell);

    expect(body).toMatchInlineSnapshot(`
      Object {
        "charId": "1",
        "fromAll": null,
        "id": "1",
        "known": true,
        "prepared": false,
        "spellId": "4",
        "userId": "1",
      }
    `);

    await agent.post('/api/v1/characters/learn').send(mockSpell).expect(500);
  });

  it('POST /learn should let characters insert/learn and automatically prepare an available cantrip', async () => {
    const { agent } = await registerAndLogin();

    const { body } = await agent
      .post('/api/v1/characters/learn')
      .send(mockCantrip);

    expect(body).toMatchInlineSnapshot(`
      Object {
        "charId": "1",
        "fromAll": null,
        "id": "1",
        "known": true,
        "prepared": true,
        "spellId": "1",
        "userId": "1",
      }
    `);

    await agent.post('/api/v1/characters/learn').send(mockCantrip).expect(500);
  });

  it('PATCH /cast should allow a character to cast a spell', async () => {
    const { agent } = await registerAndLogin();

    const { body } = await agent
      .patch('/api/v1/characters/cast')
      .send(mockCastSpell);

    expect(body.level2SpellSlots).toEqual(2);
  });

  it('PATCH /prepare should let characters prepare a known spell', async () => {
    const { agent, user } = await registerAndLogin();

    await KnownSpell.insertSpell(user.id, mockKnownSpell);

    const { body } = await agent
      .patch('/api/v1/characters/prepare')
      .send(mockKnownSpellUpdate);

    expect(body.prepared).toEqual(true);
  });

  it('DELETE /:charId/:spellId should let character delete a known spell', async () => {
    const { agent, user } = await registerAndLogin();

    await KnownSpell.insertSpell(user.id, mockKnownSpell);

    await agent.delete('/api/v1/characters/1/4').expect(200);

    await agent.get('/api/v1/characters/1/4').expect(404);
  });
});
