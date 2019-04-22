import { getRepository } from 'typeorm';
import { Body, Delete, Get, JsonController, OnUndefined, Param, Post, Patch } from 'routing-controllers';
import { Brand } from '@entities/Brand';

@JsonController()
export class BrandController {

  private brandRepository = getRepository(Brand);

  @Get('/brands/')
  async all() {
    return await this.brandRepository.find();
  }

  @Get('/brands/:id')
  async one(@Param('id') id: number) {
    return await this.brandRepository.findOne(id);
  }

  @Post('/brands/')
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
  async update(@Param('id') id: number,
               @Body() promotion: Brand) {
    const existing = await this.brandRepository.findOne(id);
    if (existing === undefined) {
      return undefined;
    }
    const fieldsToChange = ['name'];
    for (let i = 0; i < fieldsToChange.length; i += 1) {
      const field = fieldsToChange[i];
      if (promotion.hasOwnProperty(field)) { existing[field] = promotion[field]; }
    }
    return await this.brandRepository.save(existing);
  }

}