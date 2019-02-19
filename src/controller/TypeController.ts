import { Get, JsonController, Param } from 'routing-controllers';
import { getRepository } from 'typeorm';
import Type from '../entity/Type';

@JsonController('/pokemons')
export class TypeController {
  private repository = getRepository(Type);

  @Get('/types/')
  async all() {
    return this.repository.find();
  }

  @Get('/types/:name')
  async one(@Param('name') name: string) {
    return this.repository.findOne({ name });
  }

  @Get('/types/:name/users')
  async users(@Param('name') name: string) {
    const type = await this.repository.findOne({ where: { name }, relations: ['primaryUsers'] });
    if (!type) { return undefined; }
    return [...(type.primaryUsers || []), ...(type.secondaryUsers || [])];
  }
}
