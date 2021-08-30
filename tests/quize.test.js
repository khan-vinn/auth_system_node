/* eslint-disable no-undef */
const { nanoid } = require('nanoid');
const supertest = require('supertest');

const { User } = require('../models');
const app = require('../app');
const testSetUp = require('./testSetUp');

const server = app.listen(3001);
const request = supertest(server);

testSetUp(server);

const quizeRoute = '/_api/quize/';

describe('CRUD quize', () => {
  const user = { email: `${nanoid(9)}gmail.coo`, password: nanoid(10) };
  beforeAll(async () => {
    const response = await request.post('/_api/user/signup')
      .set('Accept', 'application/json')
      .send({ email: user.email, password: user.password });
    if (response.body.token) {
      user.token = response.body.token;
    } else {
      throw Error('dont registred new user');
    }
  });
  afterAll(async () => {
    await User.findOneAndDelete({ email: user.email });
  });
  it('get main route with token', async () => {
    const response = await request.post('/')
      .set('Accept', 'application/json')
      .send({ token: user.token });
    expect(response.status).toBe(200);
    expect(response.body.user).toBe(user.email);
=  });
  it('signin to registred account', async () => {
    const response = await request.post('/_api/user/signin')
      .set('Accept', 'application/json')
      .send({ email: user.email, password: user.password });
    user.token = response.body.token;
    expect(response).toBeTruthy();
    expect(response.status).toBe(200);
  });
  it('get main route with updated token', async () => {
    const response = await request.post('/')
      .set('Accept', 'application/json')
      .send({ token: user.token });
    expect(response.status).toBe(200);
    expect(response.body.user).toBe(user.email);
  });
});
