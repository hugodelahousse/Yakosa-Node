import { getRepository } from 'typeorm';
import {
  Body,
  Delete,
  Get,
  JsonController,
  OnUndefined,
  Param,
  Post,
  Patch,
  HttpCode,
  UseBefore,
} from 'routing-controllers';
import { ListProduct } from '@entities/ListProduct';

import { checkJwt } from '../middlewares/checkJwt';

@UseBefore(checkJwt)
@JsonController()
export class ListProductController {
  private repository = getRepository(ListProduct);

  @Get('/listproduct/fromlist/:id')
  async fromList(@Param('id') id: number) {
    return await this.repository.find({
      relations: ['list', 'product'],
      where: { list: { id } },
    });
  }

  @Get('/listproduct/')
  async all() {
    return await this.repository.find();
  }

  @Get('/listproduct/:id')
  async one(@Param('id') id: number) {
    return await this.repository.findOne(id, {
      relations: ['list', 'product'],
    });
  }

  @Post('/listproduct/')
  @HttpCode(201)
  async save(@Body() listProduct: ListProduct) {
    return await this.repository.save(listProduct);
  }

  @OnUndefined(404)
  @Delete('/listproduct/:id')
  async remove(@Param('id') id: number) {
    const listProductToRemove = await this.repository.findOne(id);
    if (listProductToRemove) {
      await this.repository.remove(listProductToRemove);
    }
    return listProductToRemove;
  }

  @OnUndefined(404)
  @Patch('/listproduct/:id')
  async update(@Param('id') id: number, @Body() listProduct: ListProduct) {
    const existing = await this.repository.findOne(id);
    if (existing === undefined) {
      return undefined;
    }
    const fieldsToChange = ['quantity', 'list', 'product'];
    for (let i = 0; i < fieldsToChange.length; i += 1) {
      const field = fieldsToChange[i];
      if (listProduct.hasOwnProperty(field)) {
        existing[field] = listProduct[field];
      }
    }
    return await this.repository.save(existing);
  }

  async hasUserRight(userId: number, listproductId: number) {
    const listProduct = await this.repository.findOne(listproductId, {
      relations: ['list'],
    });
    return listProduct && listProduct.list.userId == userId;
  }
}
