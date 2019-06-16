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
  it('should select the only promotion', async () => {
    // Given

    const product: Product = {
      barcode: '12345',
      promotions: [],
      listProducts: [],
    };

    const store: Store = {
      id: 1,
      position: '',
      brand: new Brand(),
      brandId: 0,
      promotions: [],
      managers: [],
      managersId: [],
    };

    const promotion: Promotion = {
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
      product,
      user: new User(),
      brand: new Brand(),
      store,
      votes: [],
    };
    store.promotions.push(promotion);

    const shoppingList = new ShoppingList();
    shoppingList.products = [];
    const listProduct: ListProduct = {
      id: 1,
      quantity: 1,
      list: shoppingList,
      listId: 0,
      product,
      productBarcode: '12345',
    };
    shoppingList.products.push(listProduct);

    const result = getShopValue(shoppingList, store);
    expect(result.value).to.be.equal(1);
    expect(result.Promotions).to.have.length.above(0);
    expect(result.Promotions.length).to.be.equal(1);
    expect(result.Promotions[0]).to.be.equal(promotion);
  });
});
