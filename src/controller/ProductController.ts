import { getRepository } from 'typeorm';
import {
  Body,
  Delete,
  Get,
  JsonController,
  Param,
  Post,
  Patch,
  HttpCode, OnUndefined,
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

  /*
   * Get a product by name.
   * Because a name is not precise the product returned should be close to the real product
   * but not always the product researched.
   */
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

  @OnUndefined(404)
  @Delete('/products/:barcode')
  async remove(@Param('barcode') barcode: string) {
    const productToRemove = await this.repository.findOne(barcode);
    if (productToRemove) {
      await this.repository.remove(productToRemove);
    }
    return productToRemove;
  }

  // Useless now because product only have his barcode.
  @Patch('/products/:barcode')
  async update(@Param('barcode') barcode: string,
               @Body() product: Product) {
    const existing = await this.repository.findOne(barcode);
    if (existing === undefined) {
      return undefined;
    }
    const fieldsToChange : string[] = [];
    for (let index = 0; index < fieldsToChange.length; index++) {
      const element = fieldsToChange[index];
      if (product.hasOwnProperty(element)) { existing[element] = product[element]; }
    }
    return this.repository.save(existing);
  }
}
