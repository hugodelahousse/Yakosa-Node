import { connection } from './setup';
import { User } from '../entity/User';
import { UserList } from '../entity/UserList';
import { expect } from 'chai';

describe('UserList', () => {
  it('Object before and after insertion should be the same', async () => {
    const userRepository = connection.getRepository(User);
    const userListRepository = connection.getRepository(UserList);

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

    const filter: {[key: string]: number}[] = [];
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
      id: data.id,
      firstName: data.user.firstName,
      lastName: data.user.lastName,
    });
  });
});
