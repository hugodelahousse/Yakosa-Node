import 'reflect-metadata';
import { createConnection } from 'typeorm';
import * as bodyParser from 'body-parser';
import { User } from './entity/User';
import { createExpressServer } from 'routing-controllers';
import { UserController } from './controller/UserController';

createConnection().then(async (connection) => {

  // create express app
  const app = createExpressServer({
    controllers: [UserController],
  });
  app.use(bodyParser.json());

  // setup express app here
  // ...

  // start express server
  app.listen(process.env.PORT || 3000);

  // insert new users for test
  await connection.manager.save(connection.manager.create(User, {
    firstName: 'Timber',
    lastName: 'Saw',
    age: 27,
  }));
  await connection.manager.save(connection.manager.create(User, {
    firstName: 'Phantom',
    lastName: 'Assassin',
    age: 24,
  }));

  console.log(`Express server has started on port 3000.
Open http://localhost:3000/users to see results`);

}).catch(error => console.log(error));
