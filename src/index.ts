import 'reflect-metadata';
import * as bodyParser from 'body-parser';
import { createExpressServer } from 'routing-controllers';
import { UserController } from './controller/UserController';
import createTypeormConnection from './utils/createTypeormConnection';

createTypeormConnection().then(async (connection) => {

  // create express app
  const app = createExpressServer({
    controllers: [UserController],
  });
  app.use(bodyParser.json());

  // setup express app here
  // ...

  // start express server
  app.listen(process.env.PORT || 3000);

  console.log(`Express server has started on port 3000.
Open http://localhost:3000/users to see results`);

}).catch(error => console.log(error));
