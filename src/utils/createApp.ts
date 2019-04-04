import * as bodyParser from 'body-parser';
import * as express from 'express';
import { useExpressServer } from 'routing-controllers';
import { UserController } from '../controller/UserController';
import { ShoppingListController } from '../controller/ShoppingListController';
import { StoreController } from '../controller/StoreController';
import { PromotionController } from '../controller/PromotionController';
import createTypeormConnection from './createTypeormConnection';

export let connection;

export default async function createApp() {

  const app = express();
  useExpressServer(app, {
    controllers: [UserController, ShoppingListController, StoreController, PromotionController],
  });
  app.use(bodyParser.json());

  connection = await createTypeormConnection();

  return app;
}
