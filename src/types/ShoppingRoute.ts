import ShoppingList from '@entities/ShoppingList';
import { Store } from '@entities/Store';
import { Promotion } from '@entities/Promotion';

export interface ShoppingRoute {
  shoppingList: ShoppingList;
  Stores: Store[];
  Promotions: Promotion[];
  Economie: number;
}

export interface StoreWithValueAndPromotion {
  Store: Store;
  value: number;
  Promotions: Promotion[];
}
