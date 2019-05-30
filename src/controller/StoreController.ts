import { getRepository, Repository, Brackets } from 'typeorm';
import {
  Body,
  Delete,
  Get,
  JsonController,
  Param,
  Post,
  Patch,
  HttpCode,
  UseBefore,
  QueryParam,
  OnUndefined,
  BadRequestError,
} from 'routing-controllers';
import { Store } from '@entities/Store';
import { checkJwt } from '../middlewares/checkJwt';
import { connection } from '@utils/createApp';

@UseBefore(checkJwt)
@JsonController()
export class StoreController {
  private repository = getRepository(Store);

  /* Query example
    http://localhost:3000/stores
    ?position={"type":"Point","coordinates":[-48.23456,20.12345]}&distance=100000000&limit=5 */

  @Get('/stores/')
  async all(
    @QueryParam('distance') distance: string,
    @QueryParam('position') position: string,
    @QueryParam('limit') limit: number,
  ) {
    if (position === undefined) {
      return await connection.createQueryBuilder(Store, 'store').getMany();
    }
    return await connection
      .createQueryBuilder(Store, 'store')
      .where(
        `ST_Distance(position, ST_GeomFromGeoJSON('${position}'))` +
          `< ${distance || 1000}`,
      )
      .orderBy(`ST_Distance(position, ST_GeomFromGeoJSON('${position}'))`)
      .limit(limit || 100)
      .getMany();
  }

  @Get('/stores/withPromotion/:barcode')
  async storesWithPromotion(
    @QueryParam('distance') distance: string,
    @QueryParam('position') position: string,
    @QueryParam('limit') limit: number,
    @Param('barcode') barcode: string,
  ) {
    let query = this.repository
      .createQueryBuilder('store')
      .leftJoin('store.promotions', 'shopPromotion')
      .leftJoin('shopPromotion.product', 'shopProduct')
      .leftJoin('store.brand', 'brand')
      .leftJoin('brand.promotions', 'brandPromotion')
      .leftJoin('brandPromotion.product', 'brandProduct')
      .where(
        new Brackets(qb => {
          qb.where('shopProduct.barcode = :barcode', {
            barcode,
          }).orWhere('brandProduct.barcode = :barcode2', { barcode2: barcode });
        }),
      );
    if (position != null) {
      query = query
        .andWhere(
          `ST_Distance(position, ST_GeomFromGeoJSON('${position}'))` +
            `< ${distance || 1000}`,
        )
        .orderBy(`ST_Distance(position, ST_GeomFromGeoJSON('${position}'))`);
    }
    return await query.limit(limit | 100).getMany();
  }

  @Get('/stores/:id')
  async one(@Param('id') id: number) {
    return this.repository.findOne(
      { id },
      {
        relations: ['brand'],
      },
    );
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
  @OnUndefined(404)
  async remove(@Param('id') id: number) {
    const storeToRemove = await this.repository.findOne(id);
    if (storeToRemove) {
      return await this.repository.remove(storeToRemove);
    }
    return storeToRemove;
  }

  @Patch('/stores/:id')
  async update(@Param('id') id: number, @Body() store: Store) {
    const existing = await this.repository.findOne(id);
    if (existing === undefined) {
      return undefined;
    }
    existing.brand = store.brand || existing.brand;
    existing.position = store.position || existing.position;
    return this.repository.save(existing);
  }

  async hasUserRight(userId: number, storeId: number) {
    const store = await this.repository.findOne(storeId);
    return store && store.managersId.includes(userId);
  }
}
