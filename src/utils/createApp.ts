import * as bodyParser from 'body-parser';
import * as express from 'express';
import { useExpressServer } from 'routing-controllers';
import { UserController } from '../controller/UserController';
import createTypeormConnection from '../utils/createTypeormConnection';
import { ShoppingListController } from '../controller/ShoppingListController';

export default async function createApp() {

  const app = express();
  useExpressServer(app, {
    controllers: [UserController, ShoppingListController],
  });
  app.use(bodyParser.json());

  await createTypeormConnection();

  return app;
}
