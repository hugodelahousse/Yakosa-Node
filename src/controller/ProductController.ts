import { getRepository } from 'typeorm';
import {
    Body,
    Delete,
    Get,
    JsonController,
    Param,
    Post,
    Patch,
    HttpCode,
} from 'routing-controllers';
import { Product } from '../entities/Product';

@JsonController()
export class ProductController {
  private repository = getRepository(Product);

  @Get('/products/')
  async all() {
    return this.repository.find();
  }

  @Post('/products/')
  @HttpCode(201)
  async create(@Body() products: Product) {
    return this.repository.save(products);
  }
}
