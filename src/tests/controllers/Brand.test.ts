import * as chai from 'chai';
import chaiHttp = require('chai-http');
import { app, brands } from './setup';

chai.use(chaiHttp);

const expect = chai.expect;

describe('PromotionController GET', () => {
  it('Should respond with 200', async () => {
    const res = await chai.request(app)
        .get('/brands');
    expect(res).to.have.status(200);
  });

  it('Should return existing stores', async () => {
    const res = await chai.request(app)
        .get('/brands');
    expect(res).to.be.json;
    expect(res.body).to.have.length.above(0);
    expect(res.body).to.have.length(brands.length);
    const dbIds = brands.map(list => list.id);
    const responseIds = res.body.map(list => list.id);
    expect(responseIds).to.have.members(dbIds);
  });
});
