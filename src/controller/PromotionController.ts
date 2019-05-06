import { getRepository } from 'typeorm';
import {
  Body,
  Delete,
  Get,
  JsonController,
  Param,
  Post,
  QueryParam,
  OnUndefined,
  Patch, HttpCode,
  UseBefore, BadRequestError,
} from 'routing-controllers';
import { Promotion } from '@entities/Promotion';

import { checkJwt } from '../middlewares/checkJwt';

@UseBefore(checkJwt)
@JsonController()
export class PromotionController {

  private repository = getRepository(Promotion);

  @Get('/promotions/')
  async all(@QueryParam('limit') limit: number,
            @QueryParam('storeId') storeId: number,
            @QueryParam('brandId') brandId: number,
            @QueryParam('userId') userId: number) {
    const filter: {[key: string]: number}[] = [];
    if (storeId) { filter.push({ storeId }); }
    if (brandId) { filter.push({ brandId }); }
    if (userId) { filter.push({ userId }); }

    return this.repository.find({
      where: filter,
      take: limit,
    });
  }

  @Get('/promotions/:id')
  async one(@Param('id') id: number) {
    return this.repository.findOne({ id }, {
      relations: ['store', 'brand', 'user'],
    });
  }

  @Post('/promotions/')
  @HttpCode(201)
  async create(@Body() promotion: Promotion) {
    try {
      return await this.repository.save(promotion);
    } catch (e) {
      throw new BadRequestError(e.detail);
    }
  }

  @Delete('/promotions/:id')
  @OnUndefined(404)
  async remove(@Param('id') id: number) {
    const promotionToRemove = await this.repository.findOne(id);
    if (promotionToRemove) {
      return await this.repository.remove(promotionToRemove);
    }
    return promotionToRemove;
  }

  @OnUndefined(404)
  @Patch('/promotions/:id')
  async update(@Param('id') id: number,
               @Body() promotion: Promotion) {
    const existing = await this.repository.findOne(id);
    if (existing === undefined) {
      return undefined;
    }
    const fieldsToChange = ['store', 'beginDate', 'endDate', 'description', 'user', 'product',
      'brand'];
    for (let i = 0; i < fieldsToChange.length; i += 1) {
      const field = fieldsToChange[i];
      if (promotion.hasOwnProperty(field)) { existing[field] = promotion[field]; }
    }
    return this.repository.save(existing);
  }
}
