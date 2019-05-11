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
} from 'routing-controllers';
import { Brand } from '@entities/Brand';

@JsonController()
export class BrandController {
  private brandRepository = getRepository(Brand);

  @Get('/brands/')
  async all() {
    return await this.brandRepository.find();
  }

  @Get('/brands/:idOrName')
  async one(@Param('idOrName') idOrName: string) {
    let where: { name: string } | { id: number } = { name: idOrName };
    if (idOrName.match(/[0-9]+/)) {
      where = { id: parseFloat(idOrName) };
    }
    const brand = await this.brandRepository.findOne(where);
    if (brand === undefined && !idOrName.match(/[0-9]+/)) {
      const brand = {
        name: idOrName,
      };
      return await this.brandRepository.save(brand);
    }
    return brand;
  }

  @Post('/brands/')
  @HttpCode(201)
  async save(@Body() brand: Brand) {
    return await this.brandRepository.save(brand);
  }

  @OnUndefined(404)
  @Delete('/brands/:id')
  async remove(@Param('id') id: number) {
    const brandToRemove = await this.brandRepository.findOne(id);
    if (brandToRemove) {
      await this.brandRepository.remove(brandToRemove);
    }
    return brandToRemove;
  }

  @OnUndefined(404)
  @Patch('/brands/:id')
  async update(@Param('id') id: number, @Body() promotion: Brand) {
    const existing = await this.brandRepository.findOne(id);
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
    return await this.brandRepository.save(existing);
  }
}
