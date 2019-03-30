import createApp from '@utils/createApp';
import * as chai from 'chai';
import chaiHttp = require('chai-http');
import ShoppingList from '@entities/ShoppingList';
import { User } from '@entities/User';
import { getOrCreateConnection } from '@utils/createTypeormConnection';
import { getRepository } from 'typeorm';
chai.use(chaiHttp);

const expect = chai.expect;

let app;
before(async () => {
  app = await createApp();
});

describe('ShoppingListController should be able to list items', () => {
  it('Should respond with 200', async () => {
    const res = await chai.request(app).get('/lists/');
    console.log(res);
    expect(res).to.have.status(200);
  });

  it('Should list existing shopping lists', async () => {
    const listRepository = getRepository(ShoppingList);
    const userRepository = getRepository(User);
    const user = await userRepository.save({ firstName: 'Login', lastName: 'X', age: 22 });
    const lists = await listRepository.save([
      { user, creationDate: new Date(), lastUsed: new Date() },
      { user, creationDate: new Date(), lastUsed: new Date() },
    ]);

    const res = await chai.request(app).get('/lists/');
    expect(res).to.be.json;
    expect(res.body).to.have.length(2);
    console.log(lists);
    const dbIds = lists.map(list => list.id);
    const responseIds = lists.map(list => list.id);
    expect(responseIds).to.have.members(dbIds);
  });
});
