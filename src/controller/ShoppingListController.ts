import { getRepository } from 'typeorm';
import {
  BadRequestError,
  Body,
  Get,
  HttpCode,
  JsonController,
  Param,
  Patch,
  Post,
  UseBefore
} from 'routing-controllers';
import ShoppingList from '@entities/ShoppingList';
import { checkJwt } from '../middlewares/checkJwt';
<<<<<<< HEAD
import { User } from '@entities/User';
=======
>>>>>>> jwt: add middleware and token creation

@UseBefore(checkJwt)
@JsonController()
export class ShoppingListController {
  private repository = getRepository(ShoppingList);

  @Get('/lists/')
  async all() {
    return await this.repository.find();
  }

  @Get('/lists/for/:userId')
  async allForUser(@Param('userId') userId: number) {
    return await this.repository
      .createQueryBuilder('shopingList')
      .innerJoin('shopingList.user', 'user')
      .where('user.id = :id', { id: userId })
      .getMany();
  }

  @Get('/lists/:id')
  async one(@Param('id') id: number) {
    return await this.repository.findOne(id, {
      relations: ['products', 'products.product'],
    });
  }

  @Post('/lists/')
  @HttpCode(201)
  async create(@Body() list: ShoppingList) {
    try {
      return await this.repository.save(list);
    } catch (e) {
      throw new BadRequestError(e.detail);
    }
  }

  @Patch('/lists/:id/')
  async patch(@Param('id') id: number, @Body() list: ShoppingList) {
    const existing = await this.repository.findOne(id);
    if (existing === undefined) {
      return undefined;
    }
    existing.creationDate = list.creationDate || existing.creationDate;
    existing.lastUsed = list.lastUsed || existing.lastUsed;
    return await this.repository.save(existing);
  }

  async hasUserRight(userId: number, listId: number) {
    const list = await this.repository.findOne(listId);
    return list && list.userId == userId;
  }
}
