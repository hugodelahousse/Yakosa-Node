import * as chai from 'chai';
import chaiHttp = require('chai-http');
import { app, users, jwtToken } from '../setup';

chai.use(chaiHttp);

const expect = chai.expect;

describe('UserController should be able to list items', () => {
  it('Should respond with 200', async () => {
    const res = await chai
      .request(app)
      .get('/users/')
      .set('Authorization', jwtToken);
    expect(res).to.have.status(200);
  });

  it('Should list existing users', async () => {
    const res = await chai
      .request(app)
      .get('/users/')
      .set('Authorization', jwtToken);
    expect(res).to.be.json;
    expect(res.body).to.have.length.above(0);
    expect(res.body).to.have.length(users.length);
    const dbIds = users.map(list => list.id);
    const responseIds = res.body.map(list => list.id);
    expect(responseIds).to.have.members(dbIds);
  });
});

describe('UserController update a user', () => {
  it('Should update the first user', async () => {
    const id = users[0].id;
    let res = await chai
      .request(app)
      .patch(`/users/${id}`)
      .send({ firstName: 'toto', lastName: 'lol' })
      .set('Authorization', jwtToken);
    expect(res).to.have.status(200);
    res = await chai
      .request(app)
      .get(`/users/${id}`)
      .set('Authorization', jwtToken);
    expect(res.body.firstName).to.be.equal('toto');
    expect(res.body.lastName).to.be.equal('lol');
  });
});

describe('UserController post a user', () => {
  it('Should add a user', async () => {
    const tmp = users[0];
    const user = {
      firstName: tmp.firstName,
      lastName: tmp.lastName,
      age: tmp.age,
      googleId: tmp.googleId,
    };
    let res = await chai
      .request(app)
      .post('/users')
      .send(user)
      .set('Authorization', jwtToken);
    expect(res).to.have.status(201);
    res = await chai
      .request(app)
      .get('/users')
      .set('Authorization', jwtToken);
    expect(res.body.length).to.be.equal(users.length + 1);
  });
});

describe('UserController delete a user', () => {
  it('Should delete a user', async () => {
    const id = users[1].id;
    let res = await chai
      .request(app)
      .delete(`/users/${id}`)
      .set('Authorization', jwtToken);
    expect(res).to.have.status(200);
    res = await chai
      .request(app)
      .get('/users')
      .set('Authorization', jwtToken);
    expect(res.body.length).to.be.equal(users.length - 1);
  });

  it('Should not find the desired user', async () => {
    const res = await chai
      .request(app)
      .delete('/users/-1')
      .set('Authorization', jwtToken);
    expect(res).to.have.status(404);
  });
});
