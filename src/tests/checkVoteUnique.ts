import { Vote } from '../entity/Vote';
import { User } from '../entity/User';
import { Promotion } from '../entity/Promotion';
import { expect } from 'chai';
import { connection } from './setup';
import {fail} from 'assert';

describe('Vote', () => {
  it('Should be able to be created vote', async () => {
    const userRepository = connection.getRepository(User);
    const promotionRepository = connection.getRepository(Promotion);
    const voteRepository = connection.getRepository(Vote);

    let user = userRepository.create({
      firstName: 'Login',
      lastName: 'X',
      age: 22,
    });

    let promotion = promotionRepository.create({
      description: 'Description',
      beginDate: new Date(),
      endDate: new Date(),
    });

    user = await userRepository.save(user);
    promotion = await promotionRepository.save(promotion);

    let vote = voteRepository.create({
      user,
      promotion,
      upvote: true,
    });
    vote = await voteRepository.save(vote);
  });
});

describe('Vote', () => {
  it('Should NOT be able to be created vote', async () => {
    const userRepository = connection.getRepository(User);
    const promotionRepository = connection.getRepository(Promotion);
    const voteRepository = connection.getRepository(Vote);

    let user = userRepository.create({
      firstName: 'Login',
      lastName: 'X',
      age: 22,
    });

    let promotion = promotionRepository.create({
      description: 'Description',
      beginDate: new Date(),
      endDate: new Date(),
    });

    user = await userRepository.save(user);
    promotion = await promotionRepository.save(promotion);

    let vote = voteRepository.create({
      user,
      promotion,
      upvote: true,
    });
    vote = await voteRepository.save(vote);
    vote = voteRepository.create({
      user,
      promotion,
      upvote: false,
    });
    voteRepository.save(vote).then(() => fail()).catch();
  });
});
