import * as chai from 'chai';
import chaiHttp = require('chai-http');
import { app, stores } from './setup';

chai.use(chaiHttp);

const expect = chai.expect;

describe('StoreController should be able to list items', () => {
  it('Should respond with 200', async () => {
    const res = await chai.request(app)
        .get('/stores?position={"type":"Point","coordinates":[8.8253987999999,50.3536142]}');
    expect(res).to.have.status(200);
  });

  it('Should return existing stores', async () => {
    const res = await chai.request(app)
        .get('/stores');
    expect(res).to.be.json;
    expect(res.body).to.have.length.above(0);
    expect(res.body).to.have.length(stores.length);
    const dbIds = stores.map(list => list.id);
    const responseIds = res.body.map(list => list.id);
    expect(responseIds).to.have.members(dbIds);
  });

  it('Should return one store', async () => {
    const res = await chai.request(app)
        .get('/stores?position={"type":"Point","coordinates":[8.8253987999999,50.3536142]}');
    expect(res).to.be.json;
    expect(res.body).to.have.length.above(0);
    expect(res.body).to.have.length(1);
  });
});
