import { getShopValue } from '@utils/CreateShoppingRoute';
import { expect } from 'chai';
import {
  createRandomProductWithbarcode,
  createRandomShop,
  createRandomPromotion,
  createRandomShoppingList,
  createRandomListProduct,
  createRandomBrand,
  createRandomShopWithBrand,
} from './CreateRandomObject';

describe('should create score associate with promotion', () => {
  const product1 = createRandomProductWithbarcode('12345');

  const store1 = createRandomShop();
  const promotion1 = createRandomPromotion(2, 1, product1);
  store1.promotions.push(promotion1);

  const shoppingList1 = createRandomShoppingList();
  const listProduct1 = createRandomListProduct(1, product1);
  shoppingList1.products.push(listProduct1);

  it('should select the only promotion', () => {
    const result = getShopValue(shoppingList1, store1);
    expect(result.value).to.be.equal(1);
    expect(result.promotions).to.have.length.above(0);
    expect(result.promotions.length).to.be.equal(1);
    expect(result.promotions[0]).to.be.equal(promotion1);
  });

  const promotion2 = createRandomPromotion(2, 1.5, product1);

  it('should select the best promotion between the 2', () => {
    store1.promotions.push(promotion2);
    const result = getShopValue(shoppingList1, store1);
    expect(result.value).to.be.equal(1.5);
    expect(result.promotions).to.have.length.above(0);
    expect(result.promotions.length).to.be.equal(1);
    expect(result.promotions[0]).to.be.equal(promotion2);
  });

  const brand1 = createRandomBrand();
  const store2 = createRandomShopWithBrand(brand1);

  it('should found no promotion', () => {
    const result = getShopValue(shoppingList1, store2);
    expect(result.value).to.be.equal(0);
    expect(result.promotions.length).to.be.equal(0);
  });

  const promotion3 = createRandomPromotion(2, 1.7, product1);

  it('should found the promotion related to the brand', () => {
    brand1.promotions.push(promotion3);

    const result = getShopValue(shoppingList1, store2);
    expect(result.value).to.be.equal(1.7);
    expect(result.promotions).to.have.length.above(0);
    expect(result.promotions.length).to.be.equal(1);
    expect(result.promotions[0]).to.be.equal(promotion3);
  });

  const product2 = createRandomProductWithbarcode('12344');
  const promotion4 = createRandomPromotion(2, 1, product2);

  const listProduct2 = createRandomListProduct(2, product2);

  it('should found the two promotion related to the two products of the shopping list', () => {
    brand1.promotions.push(promotion3);
    shoppingList1.products.push(listProduct2);
    store2.promotions.push(promotion4);

    const result = getShopValue(shoppingList1, store2);
    expect(result.value).to.be.equal(3.7);
    expect(result.promotions).to.have.length.above(0);
    expect(result.promotions.length).to.be.equal(2);
    expect(result.promotions).to.contains(promotion3);
    expect(result.promotions).to.contains(promotion4);
  });
});
