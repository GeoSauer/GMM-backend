const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const {
  mockUser,
  registerAndLogin,
  mockUserUpdate,
} = require('../lib/utils/test-utils');
const UserService = require('../lib/services/UserService');

//! Uncomment dummy testing data in setup.sql before running tests
describe.skip('user routes', () => {
  beforeEach(() => {
    return setup(pool);
  });
  afterAll(() => {
    pool.end();
  });

  it('POST / should create a new user', async () => {
    const { body } = await request(app).post('/api/v1/users').send(mockUser);

    expect(body.message).toEqual('Signed up successfully!');
  });

  it('POST /sessions should sign in an existing user with an email', async () => {
    await UserService.create({ ...mockUser });

    await request(app)
      .post('/api/v1/users/sessions')
      .send({ email: 'test@example.com', password: '12345' })
      .expect(200);
  });

  it('POST /sessions should sign in an existing user with a username', async () => {
    await UserService.create({ ...mockUser });
    await request(app)
      .post('/api/v1/users/sessions')
      .send({ username: 'Test', password: '12345' })
      .expect(200);
  });

  it('PATCH /update should update a user', async () => {
    const { agent } = await registerAndLogin();

    const { body } = await agent
      .patch('/api/v1/users/update')
      .send(mockUserUpdate);

    expect(body).toMatchInlineSnapshot(`
      Object {
        "email": "test@example.com",
        "id": "1",
        "username": "TestUpdate",
      }
    `);
  });

  it('PATCH /update should return a 401 if no user', async () => {
    await request(app)
      .patch('/api/v1/users/update')
      .send(mockUserUpdate)
      .expect(401);
  });

  it('GET / should return a user by id', async () => {
    const { agent } = await registerAndLogin();

    const { body } = await agent.get('/api/v1/users/');

    expect(body).toMatchInlineSnapshot(`
      Object {
        "email": "test@example.com",
        "id": "1",
        "username": "Test",
      }
    `);
  });

  it('GET / should return a 401 if no user', async () => {
    await request(app).get('/api/v1/users/').expect(401);
  });

  it('DELETE /sessions deletes the user session', async () => {
    const { agent } = await registerAndLogin();

    await agent.delete('/api/v1/users/sessions').expect(204);
  });

  it('DELETE / should delete a user', async () => {
    const { agent } = await registerAndLogin();

    await agent.delete('/api/v1/users/1').expect(200);

    await agent.get('/api/v1/users/1').expect(404);
  });
});
