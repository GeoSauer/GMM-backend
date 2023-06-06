const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const {
  registerAndLogin,
  mockKnownSpell,
  mockKnownSpellUpdate,
} = require('../lib/utils/test-utils');
const KnownSpell = require('../lib/models/KnownSpell');

//! Uncomment dummy testing data in setup.sql before running tests
describe.skip('spell routes', () => {
  beforeEach(() => {
    return setup(pool);
  });
  afterAll(() => {
    pool.end();
  });

  it('GET /all should return all spells regardless of class', async () => {
    const { agent } = await registerAndLogin();

    const { body } = await agent.get('/api/v1/spells/all');

    expect(body.length).toEqual(7);
  });

  it('GET /:charId/available should return all available spells for a character', async () => {
    const { agent } = await registerAndLogin();

    const { body } = await agent.get('/api/v1/spells/1/available');

    expect(body.length).toEqual(5);
  });

  it('GET /:charId/known should return all known spells for a character', async () => {
    const { agent } = await registerAndLogin();

    await KnownSpell.insertSpell(mockKnownSpell);

    const { body } = await agent.get('/api/v1/spells/1/known');

    expect(body.length).toEqual(1);
  });

  it('GET /:charId/prepared should return all prepared spells for a character', async () => {
    const { agent, user } = await registerAndLogin();

    await KnownSpell.insertSpell(mockKnownSpell);

    await KnownSpell.updateSpellPreparation(user.id, mockKnownSpellUpdate);

    const { body } = await agent.get('/api/v1/spells/1/prepared');

    expect(body.length).toEqual(1);
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
