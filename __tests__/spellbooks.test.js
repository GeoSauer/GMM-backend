const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const { registerAndLogin } = require('../lib/utils/test-utils');
const Spellbook = require('../lib/models/Spellbook');

describe('spellbooks routes', () => {
  beforeEach(() => {
    return setup(pool);
  });
  afterAll(() => {
    pool.end();
  });
  it('GET / should return all known spells for a user', async () => {
    const [agent] = await registerAndLogin();
    await Spellbook.insertKnownSpell({
      userId: 6,
      spellId: 4,
      prepared: false,
    });
    const res = await agent.get('/api/v1/spellbook');

    expect(res.body.length).toEqual(1);
  });
  it('DELETE /:id should let users delete a known spell', async () => {
    const [agent] = await registerAndLogin();
    await Spellbook.insertKnownSpell({
      userId: 6,
      spellId: 4,
      prepared: false,
    });

    await agent.delete('/api/v1/spellbook/4').expect(200);

    await agent.get('/api/v1/spellbook/4').expect(404);
  });
  it('PATCH /:id/prepare should let users prepare a known spell', async () => {
    const [agent] = await registerAndLogin();
    await Spellbook.insertKnownSpell({
      userId: 6,
      spellId: 4,
      prepared: false,
    });
    const updatedInfo = {
      prepared: true,
    };
    const res = await agent
      .patch('/api/v1/spellbook/4/prepare')
      .send(updatedInfo);

    expect(res.body.prepared).toEqual(true);
  });
  //TODO get this guy working without the extra patch api call
  it('GET /prepared should return all prepared spells for a user', async () => {
    const [agent] = await registerAndLogin();
    await Spellbook.insertKnownSpell({
      userId: 6,
      spellId: 4,
      prepared: false,
    });

    const updatedInfo = {
      prepared: true,
    };
    // await Spellbook.updateSpellPreparation(6, 4, true);
    await agent.patch('/api/v1/spellbook/4/prepare').send(updatedInfo);

    const res = await agent.get('/api/v1/spellbook/prepared');

    expect(res.body.length).toEqual(1);
  });
});
