import { getRepository } from 'typeorm';
import {
  Body,
  Delete,
  Get,
  JsonController,
  Param,
  Post,
  Patch,
  HttpCode, BadRequestError,
} from 'routing-controllers';
import { Store } from '../entities/Store';

@JsonController()
export class StoreController {

  private repository = getRepository(Store);

  @Get('/stores/')
  async all() {
    return this.repository.find();
  }

  @Get('/stores/:id')
  async one(@Param('id') id: number) {
    return this.repository.findOne({ id }, {
      relations: ['brand'],
    });
  }

  @Post('/stores/')
  @HttpCode(201)
  async create(@Body() store: Store) {
    try {
      return await this.repository.save(store);
    } catch (e) {
      throw new BadRequestError(e.detail);
    }
  }

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
    const existing = await this.repository.findOne(id);
    if (existing === undefined) {
      return undefined;
    }
    existing.brand = store.brand || existing.brand;
    existing.position = store.position || existing.position;
    return this.repository.save(existing);
  }
}
