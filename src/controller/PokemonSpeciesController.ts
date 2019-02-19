import { getRepository } from 'typeorm';
import { Get, JsonController , Param } from 'routing-controllers';
import PokemonSpecies from '../entity/PokemonSpecies';

@JsonController('/pokemons')
export class PokemonSpeciesController {
  private repository = getRepository(PokemonSpecies);

  @Get('/pokemons/')
  async all() {
    return this.repository.find();
  }

  @Get('/pokemons/:idOrName')
  async one(@Param('idOrName') idOrName: string) {
    let where : {name: string} | {id: number} = { name: idOrName };
    if (idOrName.match(/[0-9]+/)) {
      where = { id: parseInt(idOrName, 10) };
    }
    console.log(where);
    return this.repository.findOne({ where, relations: ['primaryType', 'secondaryType'] });
  }
}
