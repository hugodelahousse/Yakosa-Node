import { getRepository } from 'typeorm';
import { Delete, Get, JsonController, Param, QueryParam } from 'routing-controllers';
import { Promotion } from '../entity/Promotion';

@JsonController()
export class PromotionController {

  private promotionRepository = getRepository(Promotion);

  @Get('/promotions/')
  async all(@QueryParam('limit') limit: number,
            @QueryParam('store') store: number,
            @QueryParam('brand') brand: number,
            @QueryParam('vote') vote: number,
            @QueryParam('user') user: number) {
    const filter: {[key: string]: number}[] = [];
    if (store) { filter.push({ store }); }
    if (brand) { filter.push({ brand }); }
    if (user) { filter.push({ user }); }
    /* if (vote) { filter.push(vote); } */
    return this.promotionRepository.find({
      relations: ['store', 'brand', 'user'],
      where: filter,
      take: limit,
    });
  }

  @Get('/promotions/:id')
  async one(@Param('id') id: number) {
    return this.promotionRepository.findOne({ id });
  }

  @Delete('/promotions/:id')
  async remove(@Param('id') id: number) {
    const promotionToRemove = await this.promotionRepository.findOne(id);
    if (promotionToRemove) {
      await this.promotionRepository.remove(promotionToRemove);
    }
    return promotionToRemove;
  }
}
