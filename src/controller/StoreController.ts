import { getRepository } from 'typeorm';
import {
  Body,
  Delete,
  Get,
  JsonController,
  Param,
  Post,
  OnUndefined,
  Patch,
} from 'routing-controllers';
import { Store } from '../entity/Store';

@JsonController()
export class StoreController {

  private storeRepository = getRepository(Store);

  @Get('/stores/')
  async all() {
    return this.storeRepository.find({
      relations: ['brand'],
    });
  }

  @Get('/stores/:id')
  async one(@Param('id') id: number) {
    return this.storeRepository.findOne({ id }, {
      relations: ['brand'],
    });
  }

  @Post('/stores/')
  async save(@Body() store: Store) {
    return this.storeRepository.save(store);
  }

  @OnUndefined(404)
  @Delete('/stores/:id')
  async remove(@Param('id') id: number) {
    const storeToRemove = await this.storeRepository.findOne(id);
    if (storeToRemove) {
      await this.storeRepository.remove(storeToRemove);
    }
    return storeToRemove;
  }

  @Patch('/stores/:id')
  async update(@Param('id') id: number,
               @Body() store: Store) {
    return this.storeRepository.update(id, store);
  }
}
