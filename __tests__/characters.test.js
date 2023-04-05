const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const { mockCharacter, registerAndLogin } = require('../lib/utils/test-utils');

describe('character routes', () => {
  beforeEach(() => {
    return setup(pool);
  });
  afterAll(() => {
    pool.end();
  });

  it('POST / should create a new character', async () => {
    const { agent } = await registerAndLogin();
    const { body } = await agent.post('/api/v1/characters').send(mockCharacter);

    expect(body.charClass).toEqual('Wizard');
  });

  it('PATCH /update should update an existing character', async () => {
    //
    const { agent, character } = await registerAndLogin();
    const update = {
      id: character.id,
      charName: 'NewCharName',
    };

    const { body } = await agent
      .patch('/api/v1/characters/update')
      .send(update);

    expect(body.charName).toEqual('NewCharName');
  });

  it('GET /:id should return a character by id', async () => {
    const { agent } = await registerAndLogin();

    const { body } = await agent.get('/api/v1/characters/1').expect(200);

    expect(body).toMatchInlineSnapshot(`
      Object {
        "cantripsAvailable": 3,
        "cantripsKnown": 0,
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
        "profBonus": 0,
        "spellsAvailable": 4,
        "spellsKnown": 16,
        "userId": "1",
      }
    `);
  });

  it('GET / should return all characters for a user', async () => {
    const { agent } = await registerAndLogin();

    const { body } = await agent.get('/api/v1/characters');

    expect(body).toMatchInlineSnapshot(`
      Array [
        Object {
          "cantripsAvailable": 3,
          "cantripsKnown": 0,
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
          "profBonus": 0,
          "spellsAvailable": 4,
          "spellsKnown": 16,
          "userId": "1",
        },
      ]
    `);
  });

  it('DELETE /:id should delete a character', async () => {
    const { agent } = await registerAndLogin();

    await agent.delete('/api/v1/characters/1').expect(200);

    await agent.get('/api/v1/characters/1').expect(404);
  });
});
