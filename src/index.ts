import 'reflect-metadata';
import { createConnection } from 'typeorm';
import * as bodyParser from 'body-parser';
import { User } from './entity/User';
import { createExpressServer } from 'routing-controllers';
import { UserController } from './controller/UserController';
import {
  PokemonSpeciesController,
} from './controller/PokemonSpeciesController';
import { TypeController } from './controller/TypeController';
import { buildVesperSchema } from 'vesper';
import PokemonSpecies from './entity/PokemonSpecies';

createConnection().then(async (connection) => {

  // create express app
  const app = createExpressServer({
    controllers: [UserController, PokemonSpeciesController, TypeController],
  });
  app.use(bodyParser.json());

  // setup express app here
  // ...

  // start express server
  app.listen(3000);

  console.log(`Express server has started on port 3000.
Open http://localhost:3000/users to see results`);

}).catch(error => console.log(error));
