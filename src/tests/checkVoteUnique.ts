import { Vote } from '../entity/Vote';
import { User } from '../entity/User';
import createTypeormConnection from '../utils/createTypeormConnection';
import { BrandPromotion } from '../entity/BrandPromotion';

describe('Vote', () => {
  it('should be able to be created', async () => {
    const connection = await createTypeormConnection();
    const userRepository = connection.getRepository(User);
    const promotionRepository = connection.getRepository(BrandPromotion);
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
