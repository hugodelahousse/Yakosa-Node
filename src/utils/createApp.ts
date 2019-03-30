import * as bodyParser from 'body-parser';
import * as express from 'express';
import { useExpressServer } from 'routing-controllers';
import { UserController } from '../controller/UserController';
import createTypeormConnection from '../utils/createTypeormConnection';

export default async function createApp() {

  const app = express();
  useExpressServer(app, {
    controllers: [UserController],
  });
  app.use(bodyParser.json());

  await createTypeormConnection();

  return app;
}