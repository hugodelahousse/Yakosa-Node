import { getRepository } from 'typeorm';
import {
  BadRequestError,
  Body,
  Get, HttpCode,
  JsonController,
  Param, Patch,
  Post,
} from 'routing-controllers';
import ShoppingList from '@entities/ShoppingList';

@JsonController()
export class ShoppingListController {

  private repository = getRepository(ShoppingList);

  @Get('/lists/')
  async all() {
    return this.repository.find();
  }

  @Get('/lists/:id')
  async one(@Param('id') id: number) {
    return this.repository.findOne(id, { relations: ['products', 'products.product'] });
  }

  @Get('/lists/for/:userId')
  async allForUser(@Param('userId') userId: number) {
    return this.repository.find({ userId });
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
    return existing;
  }
}
