const request = require('supertest');
const jwt = require('jsonwebtoken');
const fs = require('fs/promises');
require('dotenv').config();

const { User, newUser } = require('../model/__mocks__/data');
const app = require('../app');

const SECRET_KEY = process.env.JWT_SECRET;

function issueToken(payload, secret) {
  return jwt.sign(payload, secret);
}

const token = issueToken({ id: User._id }, SECRET_KEY);
const fakeToken = 'thisIsDefinetelyNotAValidToken';

User.token = token;

jest.mock('../model/contacts.js');
jest.mock('../model/users.js');
jest.mock('../helpers/avatar-handler.js');

describe('Testing the route api/users', () => {
  describe('Testing api/users: signup', () => {
    test('positive: successful signup: should return code 201', async done => {
      const res = await request(app)
        .post(`/api/auth/signup`)
        .send(newUser)
        .set('Accept', 'application/json');
      expect(res.status).toEqual(201);
      expect(res.body).toBeDefined();
      expect(res.body).toBeInstanceOf(Object);
      done();
    });
    test('negative: dupe email upon signup: should return code 409', async done => {
      const res = await request(app)
        .post(`/api/auth/signup`)
        .send(newUser)
        .set('Accept', 'application/json');
      expect(res.status).toEqual(409);
      expect(res.body).toBeDefined();
      done();
    });
    test('negative: no email upon signup: should return code 400', async done => {
      const res = await request(app)
        .post(`/api/auth/signup`)
        .send(newUser.password)
        .set('Accept', 'application/json');
      expect(res.status).toEqual(400);
      expect(res.body).toBeDefined();
      done();
    });
    test('negative: no password upon signup: should return code 400', async done => {
      const res = await request(app)
        .post(`/api/auth/signup`)
        .send(newUser.email)
        .set('Accept', 'application/json');
      expect(res.status).toEqual(400);
      expect(res.body).toBeDefined();
      done();
    });
  });
  describe('Testing api/users: login', () => {
    test('positive: successful login: should return code 200', async done => {
      const res = await request(app)
        .post(`/api/auth/login`)
        .send(newUser)
        .set('Accept', 'application/json');
      expect(res.status).toEqual(200);
      expect(res.body).toBeDefined();
      done();
    });
    test('negative: non-existing e-mail login: should return code 401', async done => {
      const res = await request(app)
        .post(`/api/auth/login`)
        .send({ email: 'fake@tets.com', password: '123456' })
        .set('Accept', 'application/json');
      expect(res.status).toEqual(401);
      expect(res.body).toBeDefined();
      done();
    });
    test('negative: incorrect password login: should return code 401', async done => {
      const res = await request(app)
        .post(`/api/auth/login`)
        .send({ email: 'test@test.com', password: 'qwerty' })
        .set('Accept', 'application/json');
      expect(res.status).toEqual(401);
      expect(res.body).toBeDefined();
      done();
    });
  });
  describe('Testing api/users: get current', () => {
    test('positive: correct token: should return code 200', async done => {
      const res = await request(app)
        .get(`/api/auth/current`)
        .set('Authorization', `Bearer ${token}`);
      expect(res.status).toEqual(200);
      expect(res.body).toBeDefined();
      done();
    });
    test('negative: incorrect token: should return code 403', async done => {
      const res = await request(app)
        .get(`/api/auth/current`)
        .set('Authorization', `Bearer ${fakeToken}`);
      expect(res.status).toEqual(403);
      expect(res.body).toBeDefined();
      done();
    });
    test("negative: other user's token: should return code 403", async done => {
      const res = await request(app)
        .get(`/api/auth/current`)
        .set(
          'Authorization',
          `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYwNDEyYzY4NGQ4YzQxYWU3NGQxYmVkOCIsImlhdCI6MTYxNTA0OTY0NywiZXhwIjoxNjE1MDU2ODQ3fQ.aK2jpfcjIJgU12SgO462fecQhAkUoivf1RJwm4d9BDc`,
        );
      expect(res.status).toEqual(403);
      expect(res.body).toBeDefined();
      done();
    });
    test('negative: no token: should return code 403', async done => {
      const res = await request(app)
        .get(`/api/auth/current`)
        .set('Authorization', `Bearer ${null}`);
      expect(res.status).toEqual(403);
      expect(res.body).toBeDefined();
      done();
    });
  });
  describe('Testing api/users: change avatar', () => {
    test('positive: file attached: should return code 200', async done => {
      const buffer = await fs.readFile('./test/default-avatar.png');
      const res = await request(app)
        .patch(`/api/auth/avatar`)
        .set('Authorization', `Bearer ${token}`)
        .attach('avatar', buffer, 'default-avatar.png');
      expect(res.status).toEqual(200);
      expect(res.body).toBeDefined();
      done();
    });
    test('negative: no file attached: should return code 400', async done => {
      const buffer = null;
      const res = await request(app)
        .patch(`/api/auth/avatar`)
        .set('Authorization', `Bearer ${token}`)
        .attach('avatar', buffer, 'default-avatar.png');
      expect(res.status).toEqual(400);
      expect(res.body).toBeDefined();
      done();
    });
    test('negative: wrong MIME-type file attached: should return code 400', async done => {
      const buffer = await fs.readFile('./test/word.docx');
      const res = await request(app)
        .patch(`/api/auth/avatar`)
        .set('Authorization', `Bearer ${token}`)
        .attach('avatar', buffer, 'word.docx');
      expect(res.status).toEqual(400);
      expect(res.body).toBeDefined();
      done();
    });
  });
  describe('Testing api/users: update subscription', () => {
    test('positive: correct subscriptyion type: should return code 200', async done => {
      const res = await request(app)
        .patch(`/api/auth/sub`)
        .send({ subscription: 'pro' })
        .set('Authorization', `Bearer ${token}`);
      expect(res.status).toEqual(200);
      expect(res.body).toBeDefined();
      done();
    });
    test('negative: incorrect subscription type: should return code 400', async done => {
      const res = await request(app)
        .patch(`/api/auth/sub`)
        .send({ subscription: 'somethingIncorrect' })
        .set('Authorization', `Bearer ${token}`);
      expect(res.status).toEqual(400);
      expect(res.body).toBeDefined();
      done();
    });
  });
  describe('Testing api/users: logout', () => {
    test('positive: correct token: should return code 204', async done => {
      const res = await request(app)
        .post(`/api/auth/logout`)
        .set('Authorization', `Bearer ${token}`);
      expect(res.status).toEqual(204);
      expect(res.body).toBeDefined();
      done();
    });
  });
});
