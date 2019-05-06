import * as chai from 'chai';
import chaiHttp = require('chai-http');
import { app, jwtToken, stores } from '../setup';

chai.use(chaiHttp);

const expect = chai.expect;

describe('StoreController GET', () => {
  it('Should respond with 200', async () => {
    const res = await chai.request(app).get('/stores/').set('Authorization', jwtToken);
    expect(res).to.have.status(200);
  });

  it('Should list existing shopping lists', async () => {
    const res = await chai.request(app).get('/stores/').set('Authorization', jwtToken);
    expect(res).to.be.json;
    expect(res.body).to.have.length.above(0);
    expect(res.body).to.have.length(stores.length);
    const dbIds = stores.map(list => list.id);
    const responseIds = res.body.map(list => list.id);
    expect(responseIds).to.have.members(dbIds);
  });

  it('Should return one store', async () => {
    const res = await chai.request(app)
        .get('/stores?position={"type":"Point","coordinates":[1.304389,103.831709]}')
        .set('Authorization', jwtToken);
    expect(res).to.be.json;
    expect(res.body).to.have.length.above(0);
    expect(res.body).to.have.length(1);
  });

  it('Should return all three stores', async () => {
    const res = await chai.request(app)
        .get('/stores'
             + '?position={"type":"Point","coordinates":[-48.23456,20.12345]}'
             + '&distance=100000000').set('Authorization', jwtToken);
    expect(res).to.be.json;
    expect(res.body).to.have.length.above(0);
    expect(res.body).to.have.length(stores.length);
  });

  it('Should return two stores', async () => {
    const res = await chai.request(app)
        .get('/stores'
                 + '?position={"type":"Point","coordinates":[-48.23456,20.12345]}'
                 + '&distance=100000000&limit=2').set('Authorization', jwtToken);
    expect(res).to.be.json;
    expect(res.body).to.have.length.above(0);
    expect(res.body).to.have.length(2);
  });

  it('Should return no store', async () => {
    const res = await chai.request(app)
        .get('/stores'
                 + '?position={"type":"Point","coordinates":[-48.23456,20.12345]}'
                 + '&distance=600').set('Authorization', jwtToken);
    expect(res).to.be.json;
    expect(res.body).to.have.length(0);
  });
});

describe('StoreController UPDATE', () => {
  it('Should update the 2 store position', async () => {
    const position = {
      type: 'Point',
      coordinates: [-48.23456, 20.12345],
    };
    let res = await chai
      .request(app)
      .patch('/stores/2')
      .send({ position }).set('Authorization', jwtToken);;
    expect(res).to.have.status(200);
    res = await chai.request(app).get('/stores/2').set('Authorization', jwtToken);;
    expect(res.body.position).to.be.deep.equal(position);
  });
});

describe('StoreController POST', () => {
  it('Should add a store', async () => {
    const tmp = stores[0];
    const store = {
      brandId: tmp.brandId,
      position: tmp.position,
    };
    let res = await chai.request(app).post('/stores/')
        .send(store).set('Authorization', jwtToken);
    expect(res).to.have.status(201);
    res = await chai.request(app).get('/stores/').set('Authorization', jwtToken);
    expect(res.body.length).to.be.equal(stores.length + 1);
  });
});

describe('StoreController DELETE', () => {
  it('Should delete the 2 store', async () => {
    let res = await chai.request(app).delete('/stores/2').set('Authorization', jwtToken);
    expect(res).to.have.status(200);
    res = await chai.request(app).get('/stores/').set('Authorization', jwtToken);
    expect(res.body.length).to.be.equal(stores.length - 1);
  });

  it('Should not find the desired store', async () => {
    const res = await chai.request(app).delete('/stores/1000').set('Authorization', jwtToken);
    expect(res).to.have.status(404);
  });
});
