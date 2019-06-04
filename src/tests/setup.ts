import createApp from '@utils/createApp';
import createTypeormConnection from '@utils/createTypeormConnection';
import loadFixtures from './utils/loadFixtures';
import { getRepository } from 'typeorm';
import ShoppingList from '@entities/ShoppingList';
import { User } from '@entities/User';
import { Store } from '@entities/Store';
import { Promotion } from '@entities/Promotion';
import { Vote } from '@entities/Vote';
import { beforeEach } from 'mocha';
import { Brand } from '@entities/Brand';
import { Product } from '@entities/Product';
import { ListProduct } from '@entities/ListProduct';
import * as jwt from 'jsonwebtoken';
import config from 'config';

export let app;

export let lists: ShoppingList[];
export let stores: Store[];
export let users: User[];
export let promotions: Promotion[];
export let brands: Brand[];
export let votes: Vote[];
export let products: Product[];
export let listProduct: ListProduct[];

export let jwtToken: string;

before(async () => {
  try {
    app = await createApp();
    this.connection = await createTypeormConnection();
    await loadFixtures(
      'User.yml',
      'ShoppingList.yml',
      'Brand.yml',
      'Store.yml',
      'Product.yml',
      'Promotion.yml',
      'vote.yml',
      'ListProduct.yml',
    );
    jwtToken =
      'JWT ' +
      jwt.sign({ userId: 1, googleId: 1 }, config.JWT_SECRET, {
        expiresIn: '1h',
      });
  } catch (err) {
    console.error(err);
  }
});

beforeEach(fillDb);

async function fillDb() {
  votes = await getRepository(Vote).find({ relations: ['user', 'promotion'] });
  lists = await getRepository(ShoppingList).find();
  stores = await getRepository(Store).find();
  users = await getRepository(User).find({
    relations: ['shoppingLists', 'postedPromotions'],
  });
  products = await getRepository(Product).find();
  promotions = await getRepository(Promotion).find();
  brands = await getRepository(Brand).find();
  listProduct = await getRepository(ListProduct).find({
    relations: ['list', 'product'],
  });
}

async function clearDb() {
  await getRepository(ListProduct).delete({});
  await getRepository(Promotion).delete({});
  await getRepository(Vote).delete({});
  await getRepository(ShoppingList).delete({});
  await getRepository(Store).delete({});
  await getRepository(User).delete({});
  await getRepository(Brand).delete({});
  await getRepository(Product).delete({});
}

after(async () => {
  await clearDb();
});
