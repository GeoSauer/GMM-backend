const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const { registerAndLogin } = require('../lib/utils/test-utils');
const KnownSpell = require('../lib/models/KnownSpell');

describe.skip('knownSpells routes', () => {
  beforeEach(() => {
    return setup(pool);
  });
  afterAll(() => {
    pool.end();
  });
  it('GET /:charId should return all known spells for a character', async () => {
    const { agent, user } = await registerAndLogin();
    await KnownSpell.insertKnownSpell({
      userId: user.id,
      charId: 1,
      spellId: 4,
    });
    const { body } = await agent.get('/api/v1/known-spells/1');
    expect(body.length).toEqual(1);
  });

  it('DELETE /:charId/:spellId should let character delete a known spell', async () => {
    const { agent, user } = await registerAndLogin();
    await KnownSpell.insertKnownSpell({
      userId: user.id,
      charId: 1,
      spellId: 4,
    });

    await agent.delete('/api/v1/known-spells/1/4').expect(200);

    await agent.get('/api/v1/known-spells/1/4').expect(404);
  });

  it('PATCH /:charId/prepare should let characters prepare a known spell', async () => {
    const { agent, user } = await registerAndLogin();
    await KnownSpell.insertKnownSpell({
      userId: user.id,
      charId: 1,
      spellId: 4,
    });
    const updatedInfo = {
      spellId: 4,
      prepared: true,
    };
    const { body } = await agent
      .patch('/api/v1/known-spells/1/prepare')
      .send(updatedInfo);

    expect(body.prepared).toEqual(true);
  });

  it('GET /:charId/prepared should return all prepared spells for a character', async () => {
    const { agent, user } = await registerAndLogin();
    await KnownSpell.insertKnownSpell({
      userId: user.id,
      charId: 1,
      spellId: 4,
    });
    const updatedInfo = {
      charId: 1,
      spellId: 4,
      prepared: true,
    };
    await KnownSpell.updateSpellPreparation(user.id, updatedInfo);

    const { body } = await agent.get('/api/v1/known-spells/1/prepared');

    expect(body.length).toEqual(1);
  });
});
