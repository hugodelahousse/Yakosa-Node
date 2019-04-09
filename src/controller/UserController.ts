import { getRepository } from 'typeorm';
import { User } from '../entities/User';
import { Body, Delete, Get, JsonController, OnUndefined, Param, Post, UseBefore } from 'routing-controllers';
import { checkJwt } from '../middlewares/checkJwt';

@UseBefore(checkJwt)
@JsonController()
export class UserController {

  private userRepository = getRepository(User);

  @Get('/users/')
  async all() {
    return this.userRepository.find();
  }

  @Get('/users/:id')
  async one(@Param('id') id: number) {
    console.log('Getting user id ' + id);
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
