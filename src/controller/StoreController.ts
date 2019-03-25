import { getRepository } from 'typeorm';
import { Delete, Get, JsonController, Param, QueryParam } from 'routing-controllers';
import { Store } from '../entity/Store';

@JsonController()
export class StoreController {

  private storeRepository = getRepository(Store);

  @Get('/stores/')
  async all() {
    /* if (vote) { filter.push(vote); } */
    return this.storeRepository.find();
  }

  @Get('/stores/:id')
  async one(@Param('id') id: number) {
    return this.storeRepository.findOne({ id });
  }

  @Delete('/stores/:id')
  async remove(@Param('id') id: number) {
    const storeToRemove = await this.storeRepository.findOne(id);
    if (storeToRemove) {
      await this.storeRepository.remove(storeToRemove);
    }
    return storeToRemove;
  }
}
