const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const UserService = require('../lib/services/UserService');

// Dummy user for testing
const mockUser = {
  username: 'Test',
  email: 'test@example.com',
  password: '12345',
};

const registerAndLogin = async (userProps = {}) => {
  const password = userProps.password ?? mockUser.password;

  // Create an "agent" that gives us the ability
  // to store cookies between requests in a test
  const agent = request.agent(app);

  // Create a user to sign in with
  const user = await UserService.create({ ...mockUser, ...userProps });

  // ...then sign in
  const { email } = user;
  await agent.post('/api/v1/users/sessions').send({ email, password });
  return [agent, user];
};

describe.skip('user routes', () => {
  beforeEach(() => {
    return setup(pool);
  });
  afterAll(() => {
    pool.end();
  });

  it('creates a new user', async () => {
    const res = await request(app).post('/api/v1/users').send(mockUser);
    const { username, email } = mockUser;

    expect(res.body).toEqual({
      id: expect.any(String),
      username,
      email,
      charName: null,
      charClass: null,
      casterLvl: null,
    });
  });

  it('signs in an existing user with an email', async () => {
    await request(app).post('/api/v1/users').send(mockUser);
    const res = await request(app)
      .post('/api/v1/users/sessions')
      .send({ email: 'test@example.com', password: '12345' });

    expect(res.status).toEqual(200);
  });

  it('signs in an existing user with a username', async () => {
    await request(app).post('/api/v1/users').send(mockUser);
    const res = await request(app)
      .post('/api/v1/users/sessions')
      .send({ username: 'Test', password: '12345' });

    expect(res.status).toEqual(200);
  });

  it('get user by id, return all information about the user', async () => {
    const [agent] = await registerAndLogin();
    const res = await agent.get('/api/v1/users/1');

    expect(res.body).toEqual({
      id: '1',
      username: expect.any(String),
      email: expect.any(String),
      charName: null,
      charClass: null,
      casterLvl: null,
    });
  });

  it('should update a user', async () => {
    const updates = {
      charName: 'Dandelion',
      charClass: 'Bard',
      casterLvl: 5,
    };
    const [agent] = await registerAndLogin();
    const res = await agent.patch('/api/v1/users/1').send(updates);

    expect(res.body.charName).toEqual('Dandelion');
    expect(res.body.charClass).toEqual('Bard');
    expect(res.body.casterLvl).toEqual(5);

    const newUpdate = {
      charName: 'Dom',
      charClass: 'Warlock',
      casterLvl: 8,
    };
    const secondUpdate = await agent.patch('/api/v1/users/1').send(newUpdate);

    expect(secondUpdate.body.charName).toEqual('Dom');
    expect(secondUpdate.body.charClass).toEqual('Warlock');
    expect(secondUpdate.body.casterLvl).toEqual(8);
  });

  it('/protected should return a 401 if not authenticated', async () => {
    const res = await request(app).get('/api/v1/users/protected');
    expect(res.status).toEqual(401);
  });

  it('/protected should return the current user if authenticated', async () => {
    const [agent] = await registerAndLogin();
    const res = await agent.get('/api/v1/users/protected');
    expect(res.status).toEqual(200);
  });

  it('/users should return 401 if user not admin', async () => {
    const [agent] = await registerAndLogin();
    const res = await agent.get('/api/v1/users/');
    expect(res.status).toEqual(403);
  });

  it('/users should return 200 if user is admin', async () => {
    const agent = request.agent(app);

    // create a new user
    await agent.post('/api/v1/users').send({
      email: 'admin',
      password: '1234',
      firstName: 'admin',
      lastName: 'admin',
    });
    // sign in the user
    await agent
      .post('/api/v1/users/sessions')
      .send({ email: 'admin', password: '1234' });

    // const [agent] = await registerAndLogin({ email: 'admin' });
    const res = await agent.get('/api/v1/users/');
    expect(res.status).toEqual(200);
  });

  it('/users should return a 200 if user is admin', async () => {
    const [agent] = await registerAndLogin({ email: 'admin' });
    const res = await agent.get('/api/v1/users/');
    expect(res.status).toEqual(200);
  });

  it('DELETE /sessions deletes the user session', async () => {
    const [agent] = await registerAndLogin();
    const resp = await agent.delete('/api/v1/users/sessions');
    expect(resp.status).toBe(204);
  });
});
