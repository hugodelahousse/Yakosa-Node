import { expect } from 'chai';
import {
  createShopWithPositon,
  createRandomProductWithbarcode,
  createRandomShoppingList,
  createRandomListProduct,
  createRandomPromotion,
} from './CreateRandomObject';
import { Store } from '@entities/Store';
import { createShopingRoute } from '@utils/CreateShoppingRoute';

describe('createShopingRoute test', () => {
  const shop1 = createShopWithPositon(1, 1);
  const shop2 = createShopWithPositon(2, 2);
  const shop3 = createShopWithPositon(3, 3);
  const shop4 = createShopWithPositon(4, 4);
  const shoplist: Store[] = [shop1, shop2, shop3, shop4];
  const product1 = createRandomProductWithbarcode('11111');
  const product2 = createRandomProductWithbarcode('22222');
  const product3 = createRandomProductWithbarcode('33333');
  const product4 = createRandomProductWithbarcode('44444');
  const product5 = createRandomProductWithbarcode('55555');
  const product6 = createRandomProductWithbarcode('66666');
  const product7 = createRandomProductWithbarcode('77777');

  const promotion1 = createRandomPromotion(10, 5, product1);
  const promotion2 = createRandomPromotion(10, 4, product1);
  const promotion3 = createRandomPromotion(1, 0.3, product2);
  const promotion4 = createRandomPromotion(1, 0.4, product3);
  const promotion5 = createRandomPromotion(1, 0.7, product3);
  const promotion6 = createRandomPromotion(20, 12, product4);
  const promotion7 = createRandomPromotion(0.8, 0.6, product5);
  const promotion8 = createRandomPromotion(11, 1, product6);
  const promotion9 = createRandomPromotion(11, 2, product6);
  const promotion10 = createRandomPromotion(10, 1, product7);

  shop1.promotions.push(promotion1, promotion3, promotion5); // total value = 20 + 0.6 + 0.7 = 21.3
  shop2.promotions.push(promotion2, promotion4, promotion10); // total value = 16 + 0.4 + 1 = 17.4
  shop3.promotions.push(promotion6, promotion7, promotion8);
  shop3.brand.promotions.push(promotion9); // total value 36 + 0.6 + 2 = 38.6

  const shoppinglist = createRandomShoppingList();
  shoppinglist.products.push(
    createRandomListProduct(4, product1),
    createRandomListProduct(2, product2),
    createRandomListProduct(1, product3),
    createRandomListProduct(3, product4),
    createRandomListProduct(1, product5),
    createRandomListProduct(1, product6),
    createRandomListProduct(1, product7),
  );

  it('should return an empty result', () => {
    const result = createShopingRoute(shoplist, shoppinglist, 0);
    expect(result.economie).equal(0);
    expect(result.promotions.length).equal(0);
    expect(result.stores.length).equal(0);
  });

  it('choose the best shop to have more promotions', () => {
    const result = createShopingRoute(shoplist, shoppinglist, 1);
    expect(result.economie).equal(38.6);
    expect(result.stores).to.have.length.above(0);
    expect(result.stores.length).equal(1);
    expect(result.promotions).to.have.length.above(0);
    expect(result.promotions.length).equal(3);
  });

  it('choose the 2 best shops to have more promotions', () => {
    const result = createShopingRoute(shoplist, shoppinglist, 2);
    expect(result.economie).equal(38.6 + 21.3);
    expect(result.stores).to.have.length.above(0);
    expect(result.stores.length).equal(2);
    expect(result.promotions).to.have.length.above(0);
    expect(result.promotions.length).equal(6);
  });

  it('choose the 3 best shops to have more promotions', () => {
    const result = createShopingRoute(shoplist, shoppinglist, 3);
    expect(result.economie).equal(38.6 + 21.3 + (17.4 - 16.4));
    expect(result.stores).to.have.length.above(0);
    expect(result.stores.length).equal(3);
    expect(result.promotions).to.have.length.above(0);
    expect(result.promotions.length).equal(7);
  });

  it('choose more shops than usefull', () => {
    const result = createShopingRoute(shoplist, shoppinglist);
    expect(result.economie).equal(38.6 + 21.3 + (17.4 - 16.4));
    expect(result.stores).to.have.length.above(0);
    expect(result.stores.length).equal(3);
    expect(result.promotions).to.have.length.above(0);
    expect(result.promotions.length).equal(7);
  });
});
