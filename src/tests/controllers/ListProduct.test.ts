import * as chai from 'chai';
import chaiHttp = require('chai-http');
import { app, listProduct } from './setup';
import { getRepository } from 'typeorm';
import { ListProduct } from '@entities/ListProduct';

chai.use(chaiHttp);

const expect = chai.expect;

describe('ListProductController GET', () => {
  it('Should respond with 200', async () => {
    const res = await chai.request(app).get('/listProduct');
    expect(res).to.have.status(200);
  });

  it('Should return existing listProduct', async () => {
    const res = await chai.request(app).get('/listProduct');
    expect(res).to.be.json;
    expect(res.body).to.have.length.above(0);
    expect(res.body).to.have.length(listProduct.length);
    const dbIds = listProduct.map(list => list.id);
    const responseIds = res.body.map(list => list.id);
    expect(responseIds).to.have.members(dbIds);
  });

  it('should return existing listProduct from specific list', async () => {
    const id = listProduct[0].listId;
    const productListFromList = listProduct.filter(l => l.listId == id);
    const res = await chai.request(app).get(`/listproduct/fromlist/${id}`);
    expect(res).to.be.json;
    expect(res.body).to.have.length.above(0);
    expect(res.body).to.have.length(productListFromList.length);
    const dbIds = productListFromList.map(l => l.id);
    const responseIds = res.body.map(l => l.id);
    expect(responseIds).to.have.members(dbIds);
  });
});

describe('ListProductController DELETE Then POST', () => {
  it('Should delete the 1 listProduct', async () => {
    const id = listProduct[0].id;
    let res = await chai.request(app).delete(`/listProduct/${id}`);
    expect(res).to.have.status(200);
    res = await chai.request(app).get('/listProduct/');
    expect(res.body.length).to.be.equal(listProduct.length - 1);
  });

  it('Should not find the desired listProduct', async () => {
    const res = await chai.request(app).delete('/listProduct/1000');
    expect(res).to.have.status(404);
  });
});

describe('ListProductController Post', () => {
  it('Should add a listProduct', async () => {
    const tmp = listProduct[0];
    const list = new ListProduct();

    list.quantity = tmp.quantity;
    list.list = tmp.list;
    list.product = tmp.product;
    await getRepository(ListProduct).remove(tmp);
    let res = await chai
      .request(app)
      .post('/listProduct/')
      .send(list);
    expect(res).to.have.status(201);
    res = await chai.request(app).get('/listProduct/');
    expect(res.body.length).to.be.equal(listProduct.length);
  });
});
