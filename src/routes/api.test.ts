import request from 'supertest';
import app from '../app';
import { User } from '../models/User';

describe('testing api routes', () => {

  let email = 'test@jest.com';
  let password = '1234';

  beforeAll(async () => {
    await User.sync({ force: true });
  });

  it('should ping pong', (done) => {
    request(app)
      .get('/ping')
      .then(response => {
        expect(response.body.pong).toBeTruthy();
        return done();
      });
  });
  // Deve registrar um novo usuário
  it('should register a new user', (done) => {
    request(app)
      .post('/register')
      .send(`email=${email}&password=${password}`)
      .then(response => {
        expect(response.body.error).toBeUndefined();
        expect(response.body).toHaveProperty('id');
        return done();
      });
  });
  // Não deve registrar usuário com email existente
  it('should not allow to register with existing email', (done) => {
    request(app)
      .post('/register')
      .send(`email=${email}&password=${password}`)
      .then(response => {
        expect(response.body.error).not.toBeUndefined();
        return done();
      });
  });

  // Não deve registrar usuário sem senha
  it('should not allow to register without password', (done) => {
    request(app)
      .post('/register')
      .send(`email=${email}`)
      .then(response => {
        expect(response.body.error).not.toBeUndefined();
        return done();
      });
  });

  // Não deve registrar usuário sem email
  it('should not allow to register without email', (done) => {
    request(app)
      .post('/register')
      .send(`password=${password}`)
      .then(response => {
        expect(response.body.error).not.toBeUndefined();
        return done();
      });
  });

  // Não deve registrar usuário com email existente
  it('should not allow to register without any data', (done) => {
    request(app)
      .post('/register')
      .send(``)
      .then(response => {
        expect(response.body.error).not.toBeUndefined();
        return done();
      });
  });

  // Deve fazer login corretamente
  it('should login correctly', (done) => {
    request(app)
      .post('/login')
      .send(`email=${email}&password=${password}`)
      .then(response => {
        expect(response.body.error).toBeUndefined();
        expect(response.body.status).toBeTruthy();
        return done();
      });
  });

  // Não Deve fazer login com dados incorretos
  it('should not login with incorrect data', (done) => {
    request(app)
      .post('/login')
      .send(`email=${email}&password=invalid`)
      .then(response => {
        expect(response.body.error).toBeUndefined();
        expect(response.body.status).toBeFalsy();
        return done();
      });
  });

  // Deve pegar lista de usuários
  it('should list users', (done) => {
    request(app)
      .get('/list')
      .then(response => {
        expect(response.body.error).toBeUndefined();
        expect(response.body.list.length).toBeGreaterThanOrEqual(1);
        expect(response.body.list).toContain(email);
        return done();
      });
  });

});