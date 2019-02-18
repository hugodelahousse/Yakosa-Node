import { getRepository } from 'typeorm';
import { User } from '../entity/User';
import { Body, Delete, Get, JsonController, OnUndefined, Param, Post } from 'routing-controllers';

@JsonController()
export class UserController {

  private userRepository = getRepository(User);

  @Get('/users/')
  async all() {
    return this.userRepository.find();
  }

  @Get('/users/:id')
  async one(@Param('id') id: number) {
    return this.userRepository.findOne(id);
  }

  @Post('/users/')
  async save(@Body() user: any) {
    return this.userRepository.save(user);
  }

  @OnUndefined(404)
  @Delete('/users/:id')
  async remove(@Param('id') id: number) {
    const userToRemove = await this.userRepository.findOne(id);
    if (userToRemove) {
      await this.userRepository.remove(userToRemove);
    }
    return userToRemove;
  }

}
