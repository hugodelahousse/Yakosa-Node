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
import { Store } from '../entities/Store';

@JsonController()
export class StoreController {

  private repository = getRepository(Store);

  @Get('/stores/')
  async all() {
    return this.repository.find({
      relations: ['brand'],
    });
  }

  @Get('/stores/:id')
  async one(@Param('id') id: number) {
    return this.repository.findOne({ id }, {
      relations: ['brand'],
    });
  }

  @Post('/stores/')
  async save(@Body() store: Store) {
    return this.repository.save(store);
  }

  @OnUndefined(404)
  @Delete('/stores/:id')
  async remove(@Param('id') id: number) {
    const storeToRemove = await this.repository.findOne(id);
    if (storeToRemove) {
      await this.repository.remove(storeToRemove);
    }
    return storeToRemove;
  }

  @Patch('/stores/:id')
  async update(@Param('id') id: number,
               @Body() store: Store) {
    return this.repository.update(id, store);
  }
}
