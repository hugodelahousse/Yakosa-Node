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
  Patch, HttpCode, BadRequestError,
} from 'routing-controllers';
import { Promotion } from '../entities/Promotion';

@JsonController()
export class PromotionController {

  private repository = getRepository(Promotion);

  @Get('/promotions/')
  async all(@QueryParam('limit') limit: number,
            @QueryParam('store') store: number,
            @QueryParam('brand') brand: number,
            @QueryParam('user') user: number) {
    const filter: {[key: string]: number}[] = [];
    if (store) { filter.push({ store }); }
    if (brand) { filter.push({ brand }); }
    if (user) { filter.push({ user }); }

    return this.repository.find({
      relations: ['store', 'brand', 'user'],
      where: filter,
      take: limit,
    });
  }

  @OnUndefined(404)
  @Get('/promotions/:id')
  async one(@Param('id') id: number) {
    return this.repository.findOne({ id },{
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

  @OnUndefined(404)
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
    existing.store = promotion.store || existing.store;
    existing.brand = promotion.brand || existing.brand;
    existing.user = promotion.user || existing.brand;
    existing.product = promotion.product || existing.product;
    existing.beginDate = promotion.beginDate || existing.beginDate;
    existing.endDate = promotion.endDate || existing.endDate;
    existing.description = promotion.description || existing.description;
    return this.repository.save(existing);
  }
}
