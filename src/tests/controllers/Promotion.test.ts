import * as chai from 'chai';
import chaiHttp = require('chai-http');
import { app, promotions } from './setup';

chai.use(chaiHttp);

const expect = chai.expect;

describe('PromotionController should be able to list items', () => {
  it('Should respond with 200', async () => {
    const res = await chai.request(app).get('/lists/');
    expect(res).to.have.status(200);
  });

  it('Should list existing promotions', async () => {
    const res = await chai.request(app).get('/promotions/');
    expect(res).to.be.json;
    expect(res.body).to.have.length.above(0);
    expect(res.body).to.have.length(promotions.length);
    const dbIds = promotions.map(list => list.id);
    const responseIds = res.body.map(list => list.id);
    expect(responseIds).to.have.members(dbIds);
  });

  it('Should display user ids', async () => {
    const res = await chai.request(app).get('/promotions/');
    const dbIds = promotions.map(list => list.userId);
    const responseIds = res.body.map(list => list.userId);
    expect(responseIds).to.have.members(dbIds);
  });

  it('Should display the only promotion of the first store', async () => {
    const res = await chai.request(app).get('/promotions?storeId=1');
    expect(res).to.be.json;
    expect(res.body).to.have.length.above(0);
    const dbId = promotions.filter(promotions => promotions.storeId === 1)
    expect(res.body).to.have.length(dbId.length);
  });
});

describe('PromotionController update a promotion', () => {
  it('Should update the first promotion', async () => {
    let res = await chai.request(app).patch('/promotions/1')
        .send({ description: 'toto' });
    expect(res).to.have.status(200);
    res = await chai.request(app).get('/promotions/1');
    expect(res.body.description).to.be.equal('toto');
  });
});

describe('PromotionController post a promotion', () => {
  it('Should add a promotion', async () => {
    const tmp = promotions[0];
    const promotion = {
      description: tmp.description,
      beginDate: tmp.beginDate,
      endDate: tmp.endDate,
      userId: tmp.userId,
      brandId: tmp.brandId,
    };
    let res = await chai.request(app).post('/promotions/')
        .send(promotion);
    expect(res).to.have.status(201);
    res = await chai.request(app).get('/promotions/');
    expect(res.body.length).to.be.equal(promotions.length + 1);
  });
});

describe('PromotionController delete a promotion', () => {
  it('Should delete a promotion', async () => {
    let res = await chai.request(app).delete('/promotions/1');
    expect(res).to.have.status(200);
    console.debug(res.body);
    res = await chai.request(app).get('/promotions/');
    expect(res.body.length).to.be.equal(promotions.length);
  });
});
