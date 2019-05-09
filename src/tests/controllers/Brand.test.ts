import * as chai from 'chai';
import chaiHttp = require('chai-http');
import { app, brands } from '../setup';
import { Brand } from '@entities/Brand';

chai.use(chaiHttp);

const expect = chai.expect;

describe('BrandController GET', () => {
  it('Should respond with 200', async () => {
    const res = await chai.request(app).get('/brands');
    expect(res).to.have.status(200);
  });

  it('Should return existing stores', async () => {
    const res = await chai.request(app).get('/brands');
    expect(res).to.be.json;
    expect(res.body).to.have.length.above(0);
    expect(res.body).to.have.length(brands.length);
    const dbIds = brands.map(list => list.id);
    const responseIds = res.body.map(list => list.id);
    expect(responseIds).to.have.members(dbIds);
  });
});

describe('BrandController DELETE', () => {
  it('Should delete the 1 listProduct', async () => {
    const id = brands[0].id;
    let res = await chai.request(app).delete(`/brands/${id}`);
    expect(res).to.have.status(200);
    res = await chai.request(app).get('/brands/');
    expect(res.body.length).to.be.equal(brands.length - 1);
  });

  it('Should not find the desired listProduct', async () => {
    const res = await chai.request(app).delete('/brands/1000');
    expect(res).to.have.status(404);
  });
});

describe('BrandController Post', () => {
  it('Should add a listProduct', async () => {
    const brand = new Brand();

    brand.name = 'Hedghehog';
    let res = await chai
      .request(app)
      .post('/brands/')
      .send(brand);
    expect(res).to.have.status(201);
    res = await chai.request(app).get('/brands/');
    expect(res.body.length).to.be.equal(brands.length + 1);
  });
});
