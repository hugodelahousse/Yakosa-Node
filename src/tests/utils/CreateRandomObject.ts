import { Store } from '@entities/Store';
import { Brand } from '@entities/Brand';
import { Product } from '@entities/Product';
import { Promotion, PromotionType } from '@entities/Promotion';
import { User } from '@entities/User';
import ShoppingList from '@entities/ShoppingList';
import { ListProduct } from '@entities/ListProduct';

export function createRandomBrand(): Brand {
  const brand = new Brand();
  brand.promotions = [];
  return brand;
}

export function createRandomShop(): Store {
  const store = new Store();
  store.position = {
    type: 'Point',
    coordinates: [0, 0],
  };
  store.promotions = [];
  store.brand = createRandomBrand();
  return store;
}

export function createShopWithPositon(x: number, y: number) {
  const store = new Store();
  store.position = {
    type: 'Point',
    coordinates: [x, y],
  };
  store.promotions = [];
  store.brand = createRandomBrand();
  return store;
}

export function createRandomShopWithBrand(brand: Brand): Store {
  const store = new Store();
  store.promotions = [];
  store.brand = brand;
  return store;
}

export function createRandomProductWithbarcode(barcode: string): Product {
  return {
    barcode,
    promotions: [],
    listProducts: [],
  };
}

export function createRandomPromotion(
  price: number,
  promotion: number,
  product: Product,
  type: PromotionType = PromotionType.SIMPLE,
): Promotion {
  return {
    id: 1,
    description: '',
    price,
    promotion,
    beginDate: new Date(),
    endDate: new Date(),
    type,
    userId: 0,
    storeId: 0,
    brandId: 0,
    product,
    user: new User(),
    brand: createRandomBrand(),
    store: createRandomShop(),
    votes: [],
    quantity: 1,
    unit: 0,
  };
}

export function createRandomShoppingList(): ShoppingList {
  const shoppingList = new ShoppingList();
  shoppingList.products = [];

  return shoppingList;
}

export function createRandomListProduct(
  quantity: number,
  product: Product,
): ListProduct {
  return {
    id: 1,
    unit: 0,
    quantity,
    list: new ShoppingList(),
    listId: 0,
    product,
    productBarcode: product.barcode,
  };
}
