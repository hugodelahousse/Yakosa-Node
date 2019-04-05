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
import * as request from 'request-promise';
import {
  OpenFoodFactProductResponse,
  OpenFoodFactProductsResponse,
} from '../types/OpenFoodFactProduct';

@JsonController()
export class ProductController {
  private repository = getRepository(Product);

  @Get('/products/')
  async all() {
    return this.repository.find();
  }

  @Get('/products/:barcode')
  async one(@Param('barcode') barcode: string) {
    const product = await this.repository.findOne(barcode);
    if (product) {
      return product;
    }
    const object : OpenFoodFactProductResponse =
      await request(`https://fr.openfoodfacts.org/api/v0/produit/${barcode}`, { json : true });
    return await this.create({ barcode: object.code } as Product);
  }

  @Get('/products/name/:name')
  async find(@Param('name') name: string) {
    const url = 'https://world.openfoodfacts.org/cgi/search.pl' +
      `?search_terms=${name}&search_simple=1&action=process&json=1`;
    const object : OpenFoodFactProductsResponse =
      await request(url, { json : true });
    if (object.products.length === 0) {
      return null;
    }
    const product = await this.repository.findOne(object.products[0].code);
    if (product) {
      return product;
    }
    return await this.create({ barcode: object.products[0].code } as Product);
  }

  @Post('/products/')
  @HttpCode(201)
  async create(@Body() products: Product) {
    return this.repository.save(products);
  }

  @Delete('/products/:barcode')
  async remove(@Param('barcode') barcode: string) {
    const productToRemove = await this.repository.findOne(barcode);
    if (productToRemove) {
      await this.repository.remove(productToRemove);
    }
    return productToRemove;
  }

  @Patch('/products/:barcode')
  async update(@Param('barcode') barcode: string,
               @Body() product: Product) {
    return this.repository.update(barcode, product);
  }
}
