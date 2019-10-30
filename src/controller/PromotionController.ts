import { getRepository } from 'typeorm';
import {
  Body,
  Delete,
  Get,
  JsonController,
  Param,
  Post,
  QueryParam,
  OnUndefined,
  Patch,
  HttpCode,
  UseBefore,
  BadRequestError,
  CurrentUser,
  ForbiddenError,
} from 'routing-controllers';
import { Promotion } from '@entities/Promotion';

import { checkJwt } from '../middlewares/checkJwt';
import { User } from '@entities/User';

function hasPermission(
  user: User,
  promotion: Promotion,
): [boolean, Error | null] {
  if (user.isAdmin) {
    return [true, null];
  }
  if (promotion.userId !== user.id) {
    return [false, new ForbiddenError('Invalid promotion userId')];
  }
  return [true, null];
}

@UseBefore(checkJwt)
@JsonController()
export class PromotionController {
  private repository = getRepository(Promotion);

  @Get('/promotions/')
  async all(
    @QueryParam('limit') limit: number,
    @QueryParam('storeId') storeId: number,
    @QueryParam('brandId') brandId: number,
    @QueryParam('userId') userId: number,
    @QueryParam('type') type: number,
  ) {
    const filter: { [key: string]: number }[] = [];
    if (storeId) {
      filter.push({ storeId });
    }
    if (brandId) {
      filter.push({ brandId });
    }
    if (userId) {
      filter.push({ userId });
    }
    if (type) {
      filter.push({ type });
    }

    return this.repository.find({
      where: filter,
      take: limit,
      relations: ['product'],
    });
  }

  @Get('/promotions/:id')
  async one(@Param('id') id: number) {
    return this.repository.findOne(
      { id },
      {
        relations: ['store', 'brand', 'user', 'product'],
      },
    );
  }

  @Post('/promotions/')
  @HttpCode(201)
  async create(
    @CurrentUser({ required: true }) user: User,
    @Body() promotion: Promotion,
  ) {
    const [authorized, error] = hasPermission(user, promotion);
    if (error !== null) {
      throw error;
    }
    try {
      return await this.repository.save(promotion);
    } catch (e) {
      throw new BadRequestError(e.detail);
    }
  }

  @Delete('/promotions/:id')
  @OnUndefined(404)
  async remove(
    @CurrentUser({ required: true }) user: User,
    @Param('id') id: number,
  ) {
    const promotionToRemove = await this.repository.findOne(id);
    if (promotionToRemove) {
      const [authorized, error] = hasPermission(user, promotionToRemove);
      if (error !== null) {
        throw error;
      }

      return await this.repository.remove(promotionToRemove);
    }
    return promotionToRemove;
  }

  @OnUndefined(404)
  @Patch('/promotions/:id')
  async update(
    @CurrentUser({ required: true }) user: User,
    @Param('id') id: number,
    @Body() promotion: Promotion,
  ) {
    const existing = await this.repository.findOne(id);

    if (existing === undefined) {
      return undefined;
    }

    const [authorized, error] = hasPermission(user, existing);
    if (error !== null) {
      throw error;
    }

    const fieldsToChange = [
      'store',
      'beginDate',
      'endDate',
      'description',
      'user',
      'product',
      'brand',
    ];
    for (let i = 0; i < fieldsToChange.length; i += 1) {
      const field = fieldsToChange[i];
      if (promotion.hasOwnProperty(field)) {
        existing[field] = promotion[field];
      }
    }
    return this.repository.save(existing);
  }

  async hasUserRight(userId: number, promotionId: number) {
    const promotion = await this.repository.findOne(promotionId);
    return promotion && promotion.userId === userId;
  }
}
