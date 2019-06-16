import { Promotion } from '@entities/Promotion';
import { Product } from '@entities/Product';
import { promotions, listProduct } from 'tests/setup';
import { User } from '@entities/User';
import { Brand } from '@entities/Brand';
import { Store } from '@entities/Store';
import { ListProduct } from '@entities/ListProduct';
import ShoppingList from '@entities/ShoppingList';
import { getShopValue } from '@utils/CreateShoppingRoute';
import { expect } from 'chai';
import { from } from 'apollo-link';

describe('should create score associate with promotion', () => {
  const product1: Product = {
    barcode: '12345',
    promotions: [],
    listProducts: [],
  };

  const store1: Store = {
    id: 1,
    position: '',
    brand: new Brand(),
    brandId: 0,
    promotions: [],
    managers: [],
    managersId: [],
  };

  const promotion1: Promotion = {
    id: 1,
    description: '',
    price: 2,
    promotion: 1,
    beginDate: new Date(),
    endDate: new Date(),
    type: 1,
    userId: 0,
    storeId: 0,
    brandId: 0,
    product: product1,
    user: new User(),
    brand: new Brand(),
    store: store1,
    votes: [],
  };

  const promotion2: Promotion = {
    id: 1,
    description: '',
    price: 2,
    promotion: 1.5,
    beginDate: new Date(),
    endDate: new Date(),
    type: 1,
    userId: 0,
    storeId: 0,
    brandId: 0,
    product: product1,
    user: new User(),
    brand: new Brand(),
    store: store1,
    votes: [],
  };
  store1.promotions.push(promotion1);

  const shoppingList1 = new ShoppingList();
  shoppingList1.products = [];
  const listProduct1: ListProduct = {
    id: 1,
    quantity: 1,
    list: shoppingList1,
    listId: 0,
    product: product1,
    productBarcode: '12345',
  };
  shoppingList1.products.push(listProduct1);

  it('should select the only promotion', () => {
    // Given

    const result = getShopValue(shoppingList1, store1);
    expect(result.value).to.be.equal(1);
    expect(result.Promotions).to.have.length.above(0);
    expect(result.Promotions.length).to.be.equal(1);
    expect(result.Promotions[0]).to.be.equal(promotion1);
  });

  it('should select the best promotion between the 2', () => {
    store1.promotions.push(promotion2);
    const result = getShopValue(shoppingList1, store1);
    expect(result.value).to.be.equal(1.5);
    expect(result.Promotions).to.have.length.above(0);
    expect(result.Promotions.length).to.be.equal(1);
    expect(result.Promotions[0]).to.be.equal(promotion2);
  });
});
