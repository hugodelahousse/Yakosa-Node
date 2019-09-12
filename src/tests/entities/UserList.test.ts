import { testConnection } from './setup';
import { User } from '@entities/User';
import ShoppingList from '../../entities/ShoppingList';
import { expect } from 'chai';

describe('UserList Entity', () => {
  it('Object before and after insertion should be the same', async () => {
    const userRepository = testConnection.getRepository(User);
    const userListRepository = testConnection.getRepository(ShoppingList);

    let user = userRepository.create({
      firstName: 'Login',
      lastName: 'X',
      age: 22,
    });
    user = await userRepository.save(user);
    let userList = userListRepository.create({
      user,
      name: 'ShoppingList',
      creationDate: new Date(),
    });
    userList = await userListRepository.save(userList);

    const filter: { [key: string]: any }[] = [];
    filter.push({ user });
    const data = await userListRepository.findOne({
      relations: ['user'],
      where: filter,
    });

    expect({
      id: userList.id,
      firstName: 'Login',
      lastName: 'X',
    }).to.deep.equal({
      id: data ? data.id : -1,
      firstName: data ? data.user.firstName : -1,
      lastName: data ? data.user.lastName : -1,
    });
  });
});
