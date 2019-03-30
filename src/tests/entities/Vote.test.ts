import { fail } from 'assert';
import { expect } from 'chai';
import { Vote } from '@entities/Vote';
import { User } from '@entities/User';
import { Promotion } from '@entities/Promotion';
import { Product } from '@entities/Product';
import { connection } from './setup';

describe('Vote Entity', () => {
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
    await voteRepository.save(vote);
    vote = voteRepository.create({
      user,
      promotion,
      upvote: true,
    });
    voteRepository.save(vote).then(() => fail()).catch(() => {});
  });
  it('The vote status of the promotion should be +2', async () => {

    const productRepository = connection.getRepository(Product);
    const promotionRepository = connection.getRepository(Promotion);
    const userRepository = connection.getRepository(User);
    const voteRepository = connection.getRepository(Vote);

    let user1 = userRepository.create({
      firstName: 'Login',
      lastName: 'X',
      age: 22,
    });
    user1 = await userRepository.save(user1);
    let user2 = userRepository.create({
      firstName: 'Test',
      lastName: 'toto',
      age: 23,
    });
    user2 = await userRepository.save(user2);

    let product = productRepository.create({
      barcode: '3259426022227',
    });
    product = await productRepository.save(product);

    let promotion = promotionRepository.create({
      product,
      user: user1,
      description: 'test',
      beginDate: new Date(),
    });
    promotion = await promotionRepository.save(promotion);

    let vote = voteRepository.create({
      promotion: promotion.id,
      user: user1.id,
      upvote: true,
    });
    await voteRepository.save(vote);

    vote = voteRepository.create({
      promotion,
      user: user2,
      upvote: true,
    });
    await voteRepository.save(vote);

    const data = await voteRepository.find({
      where: { upvote: true },
    });

    expect(4).to.equal(data.length);
  });
});
