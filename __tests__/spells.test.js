const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const { registerAndLogin } = require('../lib/utils/test-utils');

describe.skip('spell routes', () => {
  beforeEach(() => {
    return setup(pool);
  });
  afterAll(() => {
    pool.end();
  });
  it('GET / should return all available spells for a user', async () => {
    const [agent] = await registerAndLogin();
    const res = await agent.get('/api/v1/spells');

    expect(res.body.length).toEqual(3);
  });
  it('POST /:id/learn should let users insert/learn an available spell', async () => {
    const [agent] = await registerAndLogin();
    const newSpell = {
      id: 4,
    };
    const { body } = await agent.post('/api/v1/spells/4/learn').send(newSpell);
    expect(body).toMatchInlineSnapshot(`
      Object {
        "id": "8",
        "prepared": false,
        "spellId": "4",
        "userId": "6",
      }
    `);
  });
  it('GET /:id/details should return details on a single available spell', async () => {
    const [agent] = await registerAndLogin();

    const res = await agent.get('/api/v1/spells/4/details');
    expect(res.body).toMatchInlineSnapshot(`
      Object {
        "area_of_effect": Object {
          "size": 30,
          "type": "sphere",
        },
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
        "desc": Array [
          "You create an invisible, magical eye within range that hovers in the air for the duration.",
          "You mentally receive visual information from the eye, which has normal vision and darkvision out to 30 feet. The eye can look in every direction.",
          "As an action, you can move the eye up to 30 feet in any direction. There is no limit to how far away from you the eye can move, but it can't enter another plane of existence. A solid barrier blocks the eye's movement, but the eye can pass through an opening as small as 1 inch in diameter.",
        ],
        "duration": "Up to 1 hour",
        "higher_level": Array [],
        "index": "arcane-eye",
        "level": 4,
        "material": "A bit of bat fur.",
        "name": "Arcane Eye",
        "range": "30 feet",
        "ritual": false,
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
