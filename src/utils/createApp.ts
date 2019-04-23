import * as bodyParser from 'body-parser';
import * as express from 'express';
import { useExpressServer } from 'routing-controllers';
import { UserController } from '../controller/UserController';
import { ShoppingListController } from '../controller/ShoppingListController';
import { StoreController } from '../controller/StoreController';
import { PromotionController } from '../controller/PromotionController';
import { ProductController} from '../controller/ProductController';
import createTypeormConnection from './createTypeormConnection';
import { BrandController } from 'controller/BrandController';
import { VoteController } from 'controller/VoteController';

export let connection;

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
    ],
  });
  app.use(bodyParser.json());

  connection = await createTypeormConnection();

  return app;
}
