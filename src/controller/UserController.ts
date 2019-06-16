import { getRepository } from 'typeorm';
import { User } from '../entities/User';
import {
  Body,
  Delete,
  Get,
  JsonController,
  OnUndefined,
  Param,
  Post,
  UseBefore,
  BadRequestError,
  Patch,
  HttpCode,
} from 'routing-controllers';
import { checkJwt } from '../middlewares/checkJwt';

@UseBefore(checkJwt)
@JsonController()
export class UserController {
  private repository = getRepository(User);

  @Get('/users/')
  async all() {
    return this.repository.find();
  }

  @Get('/users/:id')
  async one(@Param('id') id: number) {
    return this.repository.findOne(id);
  }

  @Post('/users/')
  @HttpCode(201)
  async create(@Body() user: User) {
    try {
      return await this.repository.save(user);
    } catch (e) {
      throw new BadRequestError(e.detail);
    }
  }

  @OnUndefined(404)
  @Delete('/users/:id')
  async remove(@Param('id') id: number) {
    const userToRemove = await this.repository.findOne(id);
    if (userToRemove) {
      await this.repository.remove(userToRemove);
    }
    return userToRemove;
  }

  @Patch('/users/:id')
  async update(@Param('id') id: number, @Body() user: User) {
    const existing = await this.repository.findOne(id);
    if (existing === undefined) {
      return undefined;
    }
    const fieldsToChange = ['firstName', 'lastName', 'age', 'googleId'];
    for (let i = 0; i < fieldsToChange.length; i += 1) {
      const field = fieldsToChange[i];
      if (user.hasOwnProperty(field)) {
        existing[field] = user[field];
      }
    }
    return this.repository.save(existing);
  }
}
