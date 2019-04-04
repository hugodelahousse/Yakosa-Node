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
import { debuglog } from 'util';
import { OpenFoodFactProductResponse } from '../types/OpenFoodFactProduct';

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
    const newProd : Product = { barcode: object.code, listProducts: [], promotions: [] };
    await this.create({ barcode: object.code } as Product);
    return newProd;
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
