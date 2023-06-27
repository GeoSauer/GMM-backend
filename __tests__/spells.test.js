const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const {
  registerAndLogin,
  mockKnownSpell,
  mockKnownSpellUpdate,
} = require('../lib/utils/test-utils');
const KnownSpell = require('../lib/models/KnownSpell');
const demoCleanup = require('../lib/tasks/demoUserCleanup');
const dbCleanup = require('../lib/tasks/dbCleanup');

describe('spell routes', () => {
  beforeEach(() => {
    return setup(pool);
  });
  afterAll(async () => {
    await dbCleanup();
    demoCleanup.stop();
    pool.end();
  });

  it('GET /all should return all spells regardless of class', async () => {
    const { agent } = await registerAndLogin();

    const { body } = await agent.get('/api/v1/spells/all');

    expect(body.length).toEqual(5);
  });

  it('GET /:charId/available should return all available spells for a character', async () => {
    const { agent } = await registerAndLogin();

    const { body } = await agent.get('/api/v1/spells/1/available');

    expect(body.length).toEqual(4);
  });

  it('GET /:charId/known should return all known spells for a character', async () => {
    const { agent, user } = await registerAndLogin();

    await KnownSpell.insertSpell(user.id, mockKnownSpell);

    const { body } = await agent.get('/api/v1/spells/1/known');

    expect(body.length).toEqual(1);
  });

  it('GET /:charId/prepared should return all prepared spells for a character', async () => {
    const { agent, user } = await registerAndLogin();

    await KnownSpell.insertSpell(user.id, mockKnownSpell);

    await KnownSpell.updateSpellPreparation(user.id, mockKnownSpellUpdate);

    const { body } = await agent.get('/api/v1/spells/1/prepared');

    expect(body.length).toEqual(1);
  });

  it('GET /:spellId/details should return details on a single available spell', async () => {
    const { agent } = await registerAndLogin();

    const { body } = await agent.get('/api/v1/spells/5/details');

    expect(body).toMatchInlineSnapshot(`
      Object {
        "attackType": null,
        "castingTime": "1 action",
        "casting_time": "1 action",
        "classes": Array [
          Object {
            "index": "sorcerer",
            "name": "Sorcerer",
            "url": "/api/classes/sorcerer",
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
        ],
        "concentration": true,
        "damage": Object {
          "damageAtCharacterLevel": null,
          "damageAtSlotLevel": null,
          "damageType": null,
        },
        "desc": Array [
          "
      You assume a different form. When you cast the spell, choose one of the following options, the effects of which last for the duration of the spell. While the spell lasts, you can end one option as an action to gain the benefits of a different one.",
          "***Aquatic Adaptation.*** You adapt your body to an aquatic environment, sprouting gills and growing webbing between your fingers. You can breathe underwater and gain a swimming speed equal to your walking speed.",
          "***Change Appearance.*** You transform your appearance. You decide what you look like, including your height, weight, facial features, sound of your voice, hair length, coloration, and distinguishing characteristics, if any. You can make yourself appear as a member of another race, though none of your statistics change. You also can't appear as a creature of a different size than you, and your basic shape stays the same; if you're bipedal, you can't use this spell to become quadrupedal, for instance. At any time for the duration of the spell, you can use your action to change your appearance in this way again.",
          "***Natural Weapons.*** You grow claws, fangs, spines, horns, or a different natural weapon of your choice. Your unarmed strikes deal 1d6 bludgeoning, piercing, or slashing damage, as appropriate to the natural weapon you chose, and you are proficient with your unarmed strikes. Finally, the natural weapon is magic and you have a +1 bonus to the attack and damage rolls you make using it.",
        ],
        "duration": "Up to 1 hour",
        "higherLevel": Array [],
        "higher_level": Array [],
        "index": "alter-self",
        "level": 2,
        "name": "Alter Self",
        "range": "Self",
        "ritual": false,
        "saveDc": Object {
          "success": null,
          "type": null,
        },
        "school": Object {
          "index": "transmutation",
          "name": "Transmutation",
          "url": "/api/magic-schools/transmutation",
        },
        "subclasses": Array [
          Object {
            "index": "lore",
            "name": "Lore",
            "url": "/api/subclasses/lore",
          },
        ],
        "url": "/api/spells/alter-self",
      }
    `);
  });
});
