import { getRepository } from 'typeorm';
import { Body, Delete, Get, JsonController, OnUndefined, Param, Post } from 'routing-controllers';
import ShoppingList from '@entities/ShoppingList';

@JsonController()
export class ShoppingListController {

  private repository = getRepository(ShoppingList);

  @Get('/lists/')
  async all() {
    return this.repository.find();
  }
}
