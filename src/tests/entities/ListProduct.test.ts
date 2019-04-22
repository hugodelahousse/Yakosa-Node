import { User } from 'entities/User';
import { ListProduct } from 'entities/ListProduct';
import ShoppingList from 'entities/ShoppingList';
import { testConnection } from './setup';
import { fail } from 'assert';

describe('ListProduct Entity', () => {
  it('Should be able to be created', async () => {
    const userRepository = testConnection.getRepository(User);
    const userListRepository = testConnection.getRepository(ShoppingList);
    const listProductRepository = testConnection.getRepository(ListProduct);

    let user = userRepository.create({
      firstName: 'Login',
      lastName: 'X',
      age: 22,
    });

    user = await userRepository.save(user);

    let userList = userListRepository.create({
      user,
      creationDate: new Date(),
    });

    userList = await userListRepository.save(userList);

    const listProduct = listProductRepository.create({
      list: userList,
      quantity: 10,
    });
    await listProductRepository.save(listProduct);
  });

  it('Should NOT be able to be created', async () => {
    const userRepository = testConnection.getRepository(User);
    const userListRepository = testConnection.getRepository(ShoppingList);
    const listProductRepository = testConnection.getRepository(ListProduct);

    let user = userRepository.create({
      firstName: 'Login',
      lastName: 'X',
      age: 22,
    });

    user = await userRepository.save(user);

    let userList = userListRepository.create({
      user,
      creationDate: new Date(),
    });

    userList = await userListRepository.save(userList);

    let listProduct = listProductRepository.create({
      list: userList,
      quantity: 10,
    });
    await listProductRepository.save(listProduct);
    listProduct = listProductRepository.create({
      list: userList,
      quantity: 10,
    });
    listProductRepository.save(listProduct).then(() => fail()).catch(() => {});
  });
});
