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
  Patch,
} from 'routing-controllers';
import { Promotion } from '../entity/Promotion';

@JsonController()
export class PromotionController {

  private promotionRepository = getRepository(Promotion);

  @Get('/promotions/')
  async all(@QueryParam('limit') limit: number,
            @QueryParam('store') store: number,
            @QueryParam('brand') brand: number,
            @QueryParam('user') user: number) {
    const filter: {[key: string]: number}[] = [];
    if (store) { filter.push({ store }); }
    if (brand) { filter.push({ brand }); }
    if (user) { filter.push({ user }); }

    return this.promotionRepository.find({
      relations: ['store', 'brand', 'user'],
      where: filter,
      take: limit,
    });
  }

  @Get('/promotions/:id')
  async one(@Param('id') id: number) {
    return this.promotionRepository.findOne({ id },{
      relations: ['store', 'brand', 'user'],
    });
  }

  @Post('/promotions/')
  async save(@Body() promotion: Promotion) {
    console.debug(promotion);
    if ((promotion.store == null && promotion.brand == null)
      || promotion.product == null || promotion.user == null) {
      return null;
    }
    return this.promotionRepository.save(promotion);
  }

  @OnUndefined(404)
  @Delete('/promotions/:id')
  async remove(@Param('id') id: number) {
    const promotionToRemove = await this.promotionRepository.findOne(id);
    if (promotionToRemove) {
      await this.promotionRepository.remove(promotionToRemove);
    }
    return promotionToRemove;
  }

  @Patch('/promotions/:id')
  async update(@Param('id') id: number,
               @Body() promotion: Promotion) {
    console.debug(promotion);
    return this.promotionRepository.update(id, promotion);
  }
}
