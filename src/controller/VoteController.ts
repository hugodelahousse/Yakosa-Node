import { getRepository } from 'typeorm';
import { Body, Delete, Get, JsonController, OnUndefined, Param, Post, Patch } from 'routing-controllers';
import { Vote } from '@entities/Vote';

@JsonController()
export class BrandController {

  private voteRepository = getRepository(Vote);

  @Get('/votes/')
  async all() {
    return await this.voteRepository.find({
      relations: ['user', 'promotion']
    });
  }

  @Get('/votes/:id')
  async one(@Param('id') id: number) {
    return await this.voteRepository.findOne(id, {
      relations: ['user', 'promotion']
    });
  }

  @Post('/votes/')
  async save(@Body() vote: Vote) {
    return await this.voteRepository.save(vote);
  }

  @OnUndefined(404)
  @Delete('/votes/:id')
  async remove(@Param('id') id: number) {
    const VoteToRemove = await this.voteRepository.findOne(id);
    if (VoteToRemove) {
      await this.voteRepository.remove(VoteToRemove);
    }
    return VoteToRemove;
  }

  @OnUndefined(404)
  @Patch('/votes/:id')
  async update(@Param('id') id: number,
               @Body() vote: Vote) {
    const existing = await this.voteRepository.findOne(id);
    if (existing === undefined) {
      return undefined;
    }
    const fieldsToChange = ['upvote', 'user', 'promotion'];
    for (let i = 0; i < fieldsToChange.length; i += 1) {
      const field = fieldsToChange[i];
      if (vote.hasOwnProperty(field)) { existing[field] = vote[field]; }
    }
    return await this.voteRepository.save(existing);
  }

}