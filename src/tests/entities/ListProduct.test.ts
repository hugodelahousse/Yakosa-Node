import { User } from 'entities/User';
import { ListProduct } from 'entities/ListProduct';
import ShoppingList from 'entities/ShoppingList';
import { connection } from './setup';
import { fail } from 'assert';
import { lists, users, products } from '../setup';

describe('ListProduct Entity', () => {
  it('Should be able to be created', async () => {
    const listProductRepository = connection.getRepository(ListProduct);

    const listProduct = listProductRepository.create({
      list: lists[0],
      product: products[0],
      quantity: 10,
    });
    await listProductRepository.save(listProduct);
  });

  it('Should NOT be able to be created', async () => {
    const listProductRepository = connection.getRepository(ListProduct);

    let listProduct = listProductRepository.create({
      list: lists[1],
      product: products[1],
      quantity: 10,
    });
    await listProductRepository.save(listProduct);
    listProduct = listProductRepository.create({
      list: lists[1],
      product: products[1],
      quantity: 10,
    });
    listProductRepository.save(listProduct).then(() => fail()).catch(() => {});
  });
});
