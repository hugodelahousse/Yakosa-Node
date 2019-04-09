import * as chai from 'chai';
import chaiHttp = require('chai-http');
import { app, jwtToken, promotions } from './setup';

chai.use(chaiHttp);

const expect = chai.expect;

describe('PromotionController should be able to list items', () => {
  it('Should respond with 200', async () => {
    const res = await chai.request(app).get('/lists/').set('Authorization', jwtToken);
    expect(res).to.have.status(200);
  });

  it('Should list existing promotions', async () => {
    const res = await chai.request(app).get('/promotions/').set('Authorization', jwtToken);
    expect(res).to.be.json;
    expect(res.body).to.have.length.above(0);
    expect(res.body).to.have.length(promotions.length);
    const dbIds = promotions.map(list => list.id);
    const responseIds = res.body.map(list => list.id);
    expect(responseIds).to.have.members(dbIds);
  });

  it('Should display user ids', async () => {
    const res = await chai.request(app).get('/promotions/').set('Authorization', jwtToken);
    const dbIds = promotions.map(list => list.userId);
    const responseIds = res.body.map(list => list.userId);
    expect(responseIds).to.have.members(dbIds);
  });
});
