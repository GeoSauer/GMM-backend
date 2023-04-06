const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const {
  registerAndLogin,
  mockKnownSpell,
  mockKnownSpellUpdate,
} = require('../lib/utils/test-utils');
const KnownSpell = require('../lib/models/KnownSpell');

describe('knownSpells routes', () => {
  beforeEach(() => {
    return setup(pool);
  });
  afterAll(() => {
    pool.end();
  });

  it('GET /:charId should return all known spells for a character', async () => {
    const { agent } = await registerAndLogin();

    await KnownSpell.insertKnownSpell(mockKnownSpell);

    const { body } = await agent.get('/api/v1/known-spells/1');

    expect(body.length).toEqual(1);
  });

  it('DELETE /:charId/:spellId should let character delete a known spell', async () => {
    const { agent } = await registerAndLogin();

    await KnownSpell.insertKnownSpell(mockKnownSpell);

    await agent.delete('/api/v1/known-spells/1/4').expect(200);

    await agent.get('/api/v1/known-spells/1/4').expect(404);
  });

  it('PATCH /:charId/prepare should let characters prepare a known spell', async () => {
    const { agent } = await registerAndLogin();

    await KnownSpell.insertKnownSpell(mockKnownSpell);

    const { body } = await agent
      .patch('/api/v1/known-spells/1/prepare')
      .send(mockKnownSpellUpdate);

    expect(body.prepared).toEqual(true);
  });

  it('GET /:charId/prepared should return all prepared spells for a character', async () => {
    const { agent, user } = await registerAndLogin();

    await KnownSpell.insertKnownSpell(mockKnownSpell);

    await KnownSpell.updateSpellPreparation(user.id, mockKnownSpellUpdate);

    const { body } = await agent.get('/api/v1/known-spells/1/prepared');

    expect(body.length).toEqual(1);
  });
});
