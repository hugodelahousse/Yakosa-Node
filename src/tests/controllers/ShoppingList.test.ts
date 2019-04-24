import * as chai from 'chai';
import chaiHttp = require('chai-http');
import { app, lists, users } from '../setup';

chai.use(chaiHttp);

const expect = chai.expect;

describe('ShoppingListController should be able to list items', () => {
  it('Should respond with 200', async () => {
    const res = await chai.request(app).get('/lists/');
    expect(res).to.have.status(200);
  });

  it('Should list existing shopping lists', async () => {
    const res = await chai.request(app).get('/lists/');
    expect(res).to.be.json;
    expect(res.body).to.have.length.above(0);
    expect(res.body).to.have.length(lists.length);
    const dbIds = lists.map(list => list.id);
    const responseIds = res.body.map(list => list.id);
    expect(responseIds).to.have.members(dbIds);
  });

  it('Should display user ids', async () => {
    const res = await chai.request(app).get('/lists/');
    const dbIds = lists.map(list => list.userId);
    const responseIds = res.body.map(list => list.userId);
    expect(responseIds).to.have.members(dbIds);
  });
});

describe('ShoppingListController should be able to find lists for a specific user', () => {
  it('Responds with 200', async () => {
    const user = users[0];
    const res = await chai.request(app).get(`/lists/for/${user.id}/`);
    expect(res).to.have.status(200);
  });

  it('Returns the proper lists', async () => {
    const user = users[0];
    const res = await chai.request(app).get(`/lists/for/${user.id}/`);
    const userLists = user.shoppingLists;
    expect(res.body).to.have.length(userLists.length);
    expect(userLists.map(l => l.id)).to.have.members(res.body.map(l => l.id));
  });
});
