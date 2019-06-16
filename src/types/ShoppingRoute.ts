import ShoppingList from '@entities/ShoppingList';
import { Store } from '@entities/Store';
import { Promotion } from '@entities/Promotion';

export interface ShoppingRoute {
  shoppingList: ShoppingList;
  stores: Store[];
  promotions: Promotion[];
  economie: number;
}

export interface StoreWithValueAndPromotion {
  store: Store;
  value: number;
  promotions: Promotion[];
}
