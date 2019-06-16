import * as chai from 'chai';
import chaiHttp = require('chai-http');
import {app, brands, jwtToken} from '../setup';
import { Brand } from '@entities/Brand';

chai.use(chaiHttp);

const expect = chai.expect;

describe('BrandController GET', () => {
  it('Should respond with 200', async () => {
    const res = await chai.request(app).get('/brands').set('Authorization', jwtToken);;
    expect(res).to.have.status(200);
  });

  it('Should return existing stores', async () => {
    const res = await chai.request(app).get('/brands').set('Authorization', jwtToken);;
    expect(res).to.be.json;
    expect(res.body).to.have.length.above(0);
    expect(res.body).to.have.length(brands.length);
    const dbIds = brands.map(list => list.id);
    const responseIds = res.body.map(list => list.id);
    expect(responseIds).to.have.members(dbIds);
  });
});

describe('BrandController Post', () => {
  it('Should add a Brand', async () => {
    const brand = new Brand();

    brand.name = 'Hedghehog';
    let res = await chai
      .request(app)
      .post('/brands/')
      .send(brand).set('Authorization', jwtToken);
    expect(res).to.have.status(201);
    res = await chai.request(app).get('/brands/').set('Authorization', jwtToken);;
    expect(res.body.length).to.be.equal(brands.length + 1);
  });
});

describe('BrandController DELETE', () => {
  it('Should delete one Brand', async () => {
    const id = brands[3].id;
    let res = await chai.request(app).delete(`/brands/${id}`).set('Authorization', jwtToken);
    expect(res).to.have.status(200);
    res = await chai.request(app).get('/brands/').set('Authorization', jwtToken);
    expect(res.body.length).to.be.equal(brands.length - 1);
  });

  it('Should not find the desired Brand', async () => {
    const res = await chai.request(app).delete('/brands/1000').set('Authorization', jwtToken);
    expect(res).to.have.status(404);
  });
});
