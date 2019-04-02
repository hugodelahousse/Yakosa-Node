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
} from 'routing-controllers';
import { Promotion } from '../entities/Promotion';

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
    return await this.repository.save(promotion);
  }

  @Delete('/promotions/:id')
  async remove(@Param('id') id: number) {
    const promotionToRemove = await this.repository.findOne(id);
    if (promotionToRemove) {
      await this.repository.remove(promotionToRemove);
    }
    return promotionToRemove;
  }

  @OnUndefined(404)
  @Patch('/promotions/:id')
  async patch(@Param('id') id: number,
              @Body() promotion: Promotion) {
    const existing = await this.repository.findOne(id);
    if (existing === undefined) {
      return undefined;
    }
    const fieldsToChange = ['store', 'beginDate', 'endDate', 'description', 'user', 'product',
      'brand'];
    for (const field in fieldsToChange) {
      if (promotion.hasOwnProperty(field)) { existing[field] = promotion[field]; }
    }
    return this.repository.save(existing);
  }
}
