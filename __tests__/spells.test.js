const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const {
  registerAndLogin,
  mockSpell,
  mockKnownSpell,
  mockKnownSpellUpdate,
} = require('../lib/utils/test-utils');
const KnownSpell = require('../lib/models/KnownSpell');

describe('spell routes', () => {
  beforeEach(() => {
    return setup(pool);
  });
  afterAll(() => {
    pool.end();
  });

  it('GET /:charId/available should return all available spells for a character', async () => {
    const { agent } = await registerAndLogin();

    const { body } = await agent.get('/api/v1/spells/1/available');

    expect(body.length).toEqual(4);
  });

  it('GET /:charId/known should return all known spells for a character', async () => {
    const { agent } = await registerAndLogin();

    const { userId, charId, spellId } = mockKnownSpell;
    await KnownSpell.insertKnownSpell(userId, charId, spellId);

    // await KnownSpell.insertKnownSpell(mockKnownSpell);

    const { body } = await agent.get('/api/v1/spells/1/known');

    expect(body.length).toEqual(1);
  });

  it('GET /:charId/prepared should return all prepared spells for a character', async () => {
    const { agent, user } = await registerAndLogin();

    const { userId, charId, spellId } = mockKnownSpell;
    await KnownSpell.insertKnownSpell(userId, charId, spellId);

    // await KnownSpell.insertKnownSpell(mockKnownSpell);

    await KnownSpell.updateSpellPreparation(user.id, mockKnownSpellUpdate);

    const { body } = await agent.get('/api/v1/spells/1/prepared');

    expect(body.length).toEqual(1);
  });

  it('POST /learn should let characters insert/learn an available spell', async () => {
    const { agent } = await registerAndLogin();

    const { body } = await agent.post('/api/v1/spells/learn').send(mockSpell);

    expect(body).toMatchInlineSnapshot(`
      Object {
        "charId": "1",
        "id": "1",
        "prepared": false,
        "spellId": "4",
        "userId": "1",
      }
    `);
  });

  it('GET /:spellId/details should return details on a single available spell', async () => {
    const { agent } = await registerAndLogin();

    const { body } = await agent.get('/api/v1/spells/4/details');

    expect(body).toMatchInlineSnapshot(`
      Object {
        "areaOfEffect": Object {
          "size": 30,
          "type": "sphere",
        },
        "area_of_effect": Object {
          "size": 30,
          "type": "sphere",
        },
        "attackType": null,
        "castingTime": "1 action",
        "casting_time": "1 action",
        "classes": Array [
          Object {
            "index": "cleric",
            "name": "Cleric",
            "url": "/api/classes/cleric",
          },
          Object {
            "index": "wizard",
            "name": "Wizard",
            "url": "/api/classes/wizard",
          },
        ],
        "components": Array [
          "V",
          "S",
          "M",
        ],
        "concentration": true,
        "damage": Object {
          "damageAtCharacterLevel": null,
          "damageAtSlotLevel": null,
          "damageType": null,
        },
        "desc": Array [
          "
      You create an invisible, magical eye within range that hovers in the air for the duration.",
          "You mentally receive visual information from the eye, which has normal vision and darkvision out to 30 feet. The eye can look in every direction.",
          "As an action, you can move the eye up to 30 feet in any direction. There is no limit to how far away from you the eye can move, but it can't enter another plane of existence. A solid barrier blocks the eye's movement, but the eye can pass through an opening as small as 1 inch in diameter.",
        ],
        "duration": "Up to 1 hour",
        "higherLevel": Array [],
        "higher_level": Array [],
        "index": "arcane-eye",
        "level": 4,
        "material": "A bit of bat fur.",
        "name": "Arcane Eye",
        "range": "30 feet",
        "ritual": false,
        "saveDc": Object {
          "success": null,
          "type": null,
        },
        "school": Object {
          "index": "divination",
          "name": "Divination",
          "url": "/api/magic-schools/divination",
        },
        "subclasses": Array [],
        "url": "/api/spells/arcane-eye",
      }
    `);
  });
});
