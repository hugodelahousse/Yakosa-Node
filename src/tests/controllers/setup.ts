import createApp from '@utils/createApp';
import createTypeormConnection from '@utils/createTypeormConnection';
import loadFixtures from '../utils/loadFixtures';
import { getRepository } from 'typeorm';
import ShoppingList from '@entities/ShoppingList';
import { User } from '@entities/User';
import { Store } from '@entities/Store';

export let app;

export let lists: ShoppingList[];
export let stores: Store[];
export let users: User[];

before(async () => {
  app = await createApp();
  this.connection = await createTypeormConnection();
  await loadFixtures('User.yml', 'ShoppingList.yml', 'Brand.yml', 'Store.yml');
  lists = await getRepository(ShoppingList).find();
  stores = await getRepository(Store).find();
  users = await getRepository(User).find({ relations: ['shoppingLists'] });
});
