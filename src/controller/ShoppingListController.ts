import { getRepository } from 'typeorm';
import ShoppingList from '../entity/ShoppingList';
import { Body, Delete, Get, JsonController, OnUndefined, Param, Post } from 'routing-controllers';

@JsonController()
export class UserController {

  private listRepository = getRepository(ShoppingList);

  @Get('/lists/')
  async list() {
    return this.listRepository.find();
  }
}
