import * as chai from 'chai';
import chaiHttp = require('chai-http');
import { app, jwtToken, stores, products } from '../setup';

chai.use(chaiHttp);

const expect = chai.expect;

describe('StoreController GET', () => {
  it('Should respond with 200', async () => {
    const res = await chai
      .request(app)
      .get('/stores/')
      .set('Authorization', jwtToken);
    expect(res).to.have.status(200);
  });

  it('Should list existing shopping lists', async () => {
    const res = await chai
      .request(app)
      .get('/stores/')
      .set('Authorization', jwtToken);
    expect(res).to.be.json;
    expect(res.body).to.have.length.above(0);
    expect(res.body).to.have.length(stores.length);
    const dbIds = stores.map(list => list.id);
    const responseIds = res.body.map(list => list.id);
    expect(responseIds).to.have.members(dbIds);
  });

  it('Should return one store', async () => {
    const res = await chai
      .request(app)
      .get(
        '/stores?position={"type":"Point","coordinates":[2.388267,48.853487]}' +
          '&distance=0.000001',
      )
      .set('Authorization', jwtToken);
    expect(res).to.be.json;
    expect(res.body).to.have.length.above(0);
    expect(res.body).to.have.length(1);
  });

  it('Should return two stores', async () => {
    const res = await chai
      .request(app)
      .get(
        '/stores?position={"type":"Point","coordinates":[2.342107,48.88356]}' +
          '&distance=100000000&limit=2',
      )
      .set('Authorization', jwtToken);
    expect(res).to.be.json;
    expect(res.body).to.have.length.above(0);
    expect(res.body).to.have.length(2);
  });

  it('Should return 100 stores', async () => {
    const res = await chai
      .request(app)
      .get(
        '/stores' +
          '?position={"type":"Point","coordinates":[2.342107,48.88356]}' +
          '&distance=100000000',
      )
      .set('Authorization', jwtToken);
    expect(res).to.be.json;
    expect(res.body).to.have.length.above(0);
    expect(res.body).to.have.length(100);
  });

  it('Should return no store', async () => {
    const res = await chai
      .request(app)
      .get(
        '/stores' +
          '?position={"type":"Point","coordinates":[-48.23456,20.12345]}' +
          '&distance=600',
      )
      .set('Authorization', jwtToken);
    expect(res).to.be.json;
    expect(res.body).to.have.length(0);
  });
});

describe('storeController get Relevant Store', () => {
  it('should respond with 200', async () => {
    const barcode = products[0].barcode;
    const res = await chai
      .request(app)
      .get(
        `/stores/withProduct/${barcode}` +
          '?position={"type":"Point","coordinates":[-48.23456,20.12345]}' +
          '&distance=100000000&limit=2',
      )
      .set('Authorization', jwtToken);
    expect(res).to.have.status(200);
  });

  it('should contain the shops corresponding to the promotion of the product', async () => {
    const barcode = '5449000000996';
    const res = await chai
      .request(app)
      .get(
        `/stores/withProduct/${barcode}` +
          '?position={"type":"Point","coordinates":[-48.23456,20.12345]}' +
          '&distance=100000000&limit=300',
      )
      .set('Authorization', jwtToken);
    expect(res.body).to.have.length.above(0);
    expect(res.body).to.have.length(1);
  });
});

describe('StoreController UPDATE', () => {
  it('Should update the 2 store position', async () => {
    const id = stores[1].id;
    const position = {
      type: 'Point',
      coordinates: [-48.23456, 20.12345],
    };
    let res = await chai
      .request(app)
      .patch(`/stores/${id}`)
      .send({ position })
      .set('Authorization', jwtToken);
    expect(res).to.have.status(200);
    res = await chai
      .request(app)
      .get(`/stores/${id}`)
      .set('Authorization', jwtToken);
    expect(res.body.position).to.be.deep.equal(position);
  });
});

describe('StoreController POST', () => {
  it('Should add a store', async () => {
    const tmp = stores[0];
    const store = {
      brandId: tmp.brandId,
      position: tmp.position,
      name: 'test',
      address: 'test',
    };
    let res = await chai
      .request(app)
      .post('/stores/')
      .send(store)
      .set('Authorization', jwtToken);
    expect(res).to.have.status(201);
    res = await chai
      .request(app)
      .get('/stores/')
      .set('Authorization', jwtToken);
    expect(res.body.length).to.be.equal(stores.length + 1);
  });
});

describe('StoreController DELETE', () => {
  it('Should delete the 2 store', async () => {
    const id = stores[1].id;
    let res = await chai
      .request(app)
      .delete(`/stores/${id}`)
      .set('Authorization', jwtToken);
    expect(res).to.have.status(200);
    res = await chai
      .request(app)
      .get('/stores/')
      .set('Authorization', jwtToken);
    expect(res.body.length).to.be.equal(stores.length - 1);
  });

  it('Should not find the desired store', async () => {
    const res = await chai
      .request(app)
      .delete('/stores/-1')
      .set('Authorization', jwtToken);
    expect(res).to.have.status(404);
  });
});
