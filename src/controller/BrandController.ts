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
  HttpCode, UseBefore,
} from 'routing-controllers';
import { Brand } from '@entities/Brand';
import {checkJwt} from '../middlewares/checkJwt';

@UseBefore(checkJwt)
@JsonController()
export class BrandController {
  private repository = getRepository(Brand);

  @Get('/brands/')
  async all() {
    return await this.repository.find();
  }

  @Get('/brands/:idOrName')
  async one(@Param('idOrName') idOrName: string) {
    let where: { name: string } | { id: number } = { name: idOrName };
    if (idOrName.match(/[0-9]+/)) {
      where = { id: parseFloat(idOrName) };
    }
    return await this.repository.findOne(where);
  }

  @Post('/brands/')
  @HttpCode(201)
  async save(@Body() brand: Brand) {
    return await this.repository.save(brand);
  }

  @OnUndefined(404)
  @Delete('/brands/:id')
  async remove(@Param('id') id: number) {
    const brandToRemove = await this.repository.findOne(id);
    if (brandToRemove) {
      await this.repository.remove(brandToRemove);
    }
    return brandToRemove;
  }

  @OnUndefined(404)
  @Patch('/brands/:id')
  async update(@Param('id') id: number, @Body() promotion: Brand) {
    const existing = await this.repository.findOne(id);
    if (existing === undefined) {
      return undefined;
    }
    const fieldsToChange = ['name'];
    for (let i = 0; i < fieldsToChange.length; i += 1) {
      const field = fieldsToChange[i];
      if (promotion.hasOwnProperty(field)) {
        existing[field] = promotion[field];
      }
    }
    return await this.repository.save(existing);
  }

  async hasUserRight(userId: number, brandId: number) {
    const brand = await this.repository.findOne(brandId);
    return brand && brand.managersId.includes(userId);
  }
}
