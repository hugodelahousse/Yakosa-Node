import * as bodyParser from 'body-parser';
import * as express from 'express';
import { Action, useExpressServer } from 'routing-controllers';
import { UserController } from '../controller/UserController';
import { ShoppingListController } from '../controller/ShoppingListController';
import { StoreController } from '../controller/StoreController';
import { PromotionController } from '../controller/PromotionController';
import { ProductController } from '../controller/ProductController';
import createTypeormConnection from './createTypeormConnection';
import { BrandController } from '../controller/BrandController';
import { VoteController } from '../controller/VoteController';
import { ListProductController } from '../controller/ListProductController';
import * as jwt from 'jsonwebtoken';
import config from 'config';
import { JWT } from '../middlewares/checkJwt';
import { User } from '@entities/User';
import { Connection, getRepository } from 'typeorm';

export let connection: Connection;

export default async function createApp() {
  const app = express();
  useExpressServer(app, {
    controllers: [
      UserController,
      ShoppingListController,
      StoreController,
      PromotionController,
      BrandController,
      ProductController,
      VoteController,
      ListProductController,
    ],
    currentUserChecker: async (action: Action) => {
      const token = action.request.headers.authorization;
      const jwtDecoded = jwt.verify(
        token.split(' ')[1],
        config.JWT_SECRET,
      ) as JWT;
      return getRepository(User).find({
        id: Number.parseInt(jwtDecoded.userId, 10),
      });
    },
  });
  app.use(bodyParser.json());

  connection = await createTypeormConnection();

  return app;
}
