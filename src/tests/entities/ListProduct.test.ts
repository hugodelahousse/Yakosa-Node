import { ListProduct } from 'entities/ListProduct';
import { fail } from 'assert';
import { lists } from '../setup';
import { getRepository } from 'typeorm';
import { Product } from '@entities/Product';

describe('ListProduct Entity', () => {
  it('Should be able to be created', async () => {
    const listProductRepository = getRepository(ListProduct);

    const product = await getRepository(Product).save({
      barcode: 'toto',
    });

    const listProduct = listProductRepository.create({
      product,
      list: lists[10],
      quantity: 10,
    });
    await listProductRepository.save(listProduct);
  });

  it('Should NOT be able to be created', async () => {
    const listProductRepository = getRepository(ListProduct);

    const product = await getRepository(Product).save({
      barcode: 'tata',
    });

    let listProduct = listProductRepository.create({
      product,
      list: lists[1],
      quantity: 10,
    });
    await listProductRepository.save(listProduct);
    listProduct = listProductRepository.create({
      product,
      list: lists[1],
      quantity: 10,
    });
    listProductRepository.save(listProduct).then(() => fail()).catch(() => {});
  });
});
