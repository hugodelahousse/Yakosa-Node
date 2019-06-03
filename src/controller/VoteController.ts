import { getRepository } from 'typeorm';
import {
  Body,
  Delete,
  Get,
  JsonController,
  OnUndefined,
  Param,
  Post,
  Patch,
  HttpCode, UseBefore,
} from 'routing-controllers';
import { Vote } from '@entities/Vote';
import { checkJwt } from '../middlewares/checkJwt';

@UseBefore(checkJwt)
@JsonController()
export class VoteController {
  private repository = getRepository(Vote);

  @Get('/votes/')
  async all() {
    return await this.repository.find();
  }

  @Get('/votes/:id')
  async one(@Param('id') id: number) {
    return await this.repository.findOne(id, {
      relations: ['user', 'promotion'],
    });
  }

  @Post('/votes/')
  @HttpCode(201)
  async save(@Body() vote: Vote) {
    return await this.repository.save(vote);
  }

  @OnUndefined(404)
  @Delete('/votes/:id')
  async remove(@Param('id') id: number) {
    const voteToRemove = await this.repository.findOne(id);
    if (voteToRemove) {
      await this.repository.remove(voteToRemove);
    }
    return voteToRemove;
  }

  @OnUndefined(404)
  @Patch('/votes/:id')
  async update(@Param('id') id: number, @Body() vote: Vote) {
    const existing = await this.repository.findOne(id);
    if (existing === undefined) {
      return undefined;
    }
    const fieldsToChange = ['upvote', 'user', 'promotion'];
    for (let i = 0; i < fieldsToChange.length; i += 1) {
      const field = fieldsToChange[i];
      if (vote.hasOwnProperty(field)) {
        existing[field] = vote[field];
      }
    }
    return await this.repository.save(existing);
  }

  async hasUserRight(userId: number, voteId: number) {
    const vote = await this.repository.findOne(voteId);
    return vote && vote.userId === userId;
  }
}
