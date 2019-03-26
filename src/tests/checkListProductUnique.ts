import { User } from '../entity/User';
import { ListProduct } from '../entity/ListProduct';
import { UserList } from '../entity/UserList';
import { connection } from './setup';
import { fail } from 'assert';

describe('ListProduct', () => {
  it('Should be able to be created', async () => {
    const userRepository = connection.getRepository(User);
    const userListRepository = connection.getRepository(UserList);
    const listProductRepository = connection.getRepository(ListProduct);

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
      userList,
      quantity: 10,
    });
    await listProductRepository.save(listProduct);
  });
});

describe('ListProduct', () => {
  it('Should NOT be able to be created', async () => {
    const userRepository = connection.getRepository(User);
    const userListRepository = connection.getRepository(UserList);
    const listProductRepository = connection.getRepository(ListProduct);

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
      userList,
      quantity: 10,
    });
    await listProductRepository.save(listProduct);
    listProduct = listProductRepository.create({
      userList,
      quantity: 10,
    });
    listProductRepository.save(listProduct).then(() => fail()).catch();
  });
});
