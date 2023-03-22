const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const { registerAndLogin } = require('../lib/utils/test-utils');
const KnownSpell = require('../lib/models/KnownSpell');

describe('knownSpells routes', () => {
  beforeEach(() => {
    return setup(pool);
  });
  afterAll(() => {
    pool.end();
  });
  it('GET / should return all known spells for a user', async () => {
    const [agent] = await registerAndLogin();
    await KnownSpell.insertKnownSpell({
      userId: 6,
      spellId: 4,
      prepared: false,
    });
    const res = await agent.get('/api/v1/known-spells');

    expect(res.body.length).toEqual(1);
  });
  it('DELETE /:id should let users delete a known spell', async () => {
    const [agent] = await registerAndLogin();
    await KnownSpell.insertKnownSpell({
      userId: 6,
      spellId: 4,
      prepared: false,
    });

    await agent.delete('/api/v1/known-spells/4').expect(200);

    await agent.get('/api/v1/known-spells/4').expect(404);
  });
  it('PATCH /prepare should let users prepare a known spell', async () => {
    const [agent] = await registerAndLogin();
    await KnownSpell.insertKnownSpell({
      userId: 6,
      spellId: 4,
      prepared: false,
    });
    const updatedInfo = {
      spellId: 4,
      prepared: true,
    };
    const res = await agent
      .patch('/api/v1/known-spells/prepare')
      .send(updatedInfo);
    expect(res.body.prepared).toEqual(true);
  });
  it('GET /prepared should return all prepared spells for a user', async () => {
    const [agent] = await registerAndLogin();
    await KnownSpell.insertKnownSpell({
      userId: 6,
      spellId: 4,
      prepared: false,
    });
    const updatedInfo = {
      userId: 6,
      spellId: 4,
      prepared: true,
    };
    await KnownSpell.updateSpellPreparation(updatedInfo);

    const res = await agent.get('/api/v1/known-spells/prepared');

    expect(res.body.length).toEqual(1);
  });
});
