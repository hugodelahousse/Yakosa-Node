import createApp from '@utils/createApp';
import createTypeormConnection from '@utils/createTypeormConnection';
import loadFixtures from '../utils/loadFixtures';
import { getRepository } from 'typeorm';
import ShoppingList from '@entities/ShoppingList';
import { User } from '@entities/User';
import { Store } from '@entities/Store';
import { Promotion } from '@entities/Promotion';
import * as jwt from 'jsonwebtoken';
import config from 'config';

export let app;

export let lists: ShoppingList[];
export let stores: Store[];
export let users: User[];
export let promotions: Promotion[];
export let jwtToken: string;

before(async () => {
  app = await createApp();
  this.connection = await createTypeormConnection();
  await loadFixtures('User.yml', 'ShoppingList.yml', 'Brand.yml', 'Store.yml', 'Product.yml',
                     'Promotion.yml');
  lists = await getRepository(ShoppingList).find();
  stores = await getRepository(Store).find();
  users = await getRepository(User).find({ relations: ['shoppingLists', 'postedPromotions'] });
  promotions = await getRepository(Promotion).find() ;

  jwtToken = jwt.sign({ userId: 1, googleId: 1 },
    config.JWT_SECRET, { expiresIn: '1h' },
  );
});
