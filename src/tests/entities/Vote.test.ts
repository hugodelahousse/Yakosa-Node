import { fail } from 'assert';
import { expect } from 'chai';
import { Vote } from '@entities/Vote';
import { User } from '@entities/User';
import { Promotion } from '@entities/Promotion';
import { Product } from '@entities/Product';
import { testConnection } from './setup';

describe('Vote Entity', () => {
  it('Should be able to be created vote', async () => {
    const userRepository = testConnection.getRepository(User);
    const promotionRepository = testConnection.getRepository(Promotion);
    const voteRepository = testConnection.getRepository(Vote);

    let user = userRepository.create({
      firstName: 'Login',
      lastName: 'X',
      age: 22,
    });
    user = await userRepository.save(user);

    let promotion = promotionRepository.create({
      description: 'Description',
      price: 50,
      type: 2,
      promotion: 10.5,
      beginDate: new Date(),
      endDate: new Date(),
      userId: user.id,
      quantity: 1,
      unit: 0,
    });
    promotion = await promotionRepository.save(promotion);

    const vote = voteRepository.create({
      user,
      promotion,
      upvote: true,
    });
    await voteRepository.save(vote);
  });

  it('Should NOT be able to be created vote', async () => {
    const userRepository = testConnection.getRepository(User);
    const promotionRepository = testConnection.getRepository(Promotion);
    const voteRepository = testConnection.getRepository(Vote);

    let user = userRepository.create({
      firstName: 'Login',
      lastName: 'X',
      age: 22,
    });
    user = await userRepository.save(user);

    let promotion = promotionRepository.create({
      description: 'Description',
      price: 50,
      type: 0,
      promotion: 10.5,
      beginDate: new Date(),
      endDate: new Date(),
      userId: user.id,
      quantity: 1,
      unit: 0,
    });
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
    voteRepository
      .save(vote)
      .then(() => fail())
      .catch(() => {});
  });

  it('The vote status of the promotion should be +2', async () => {
    const productRepository = testConnection.getRepository(Product);
    const promotionRepository = testConnection.getRepository(Promotion);
    const userRepository = testConnection.getRepository(User);
    const voteRepository = testConnection.getRepository(Vote);
    voteRepository.delete({});

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
      price: 50,
      promotion: 10.5,
      type: 1,
      user: user1,
      description: 'test',
      beginDate: new Date(),
      userId: user1.id,
      quantity: 1,
      unit: 0,
    });
    promotion = await promotionRepository.save(promotion);

    let vote = voteRepository.create({
      promotion,
      user: user1,
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

    expect(data.length).to.equal(2);
  });
});
