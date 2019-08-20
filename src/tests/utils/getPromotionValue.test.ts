import { expect } from 'chai';
import {
  createRandomPromotion,
  createRandomProductWithbarcode,
  createRandomListProduct,
  createRandomShop,
} from './CreateRandomObject';
import { PromotionType } from '@entities/Promotion';
import { getPromoValue, getPromoDiffValue } from '@utils/CreateShoppingRoute';

describe('test Promotion Value', () => {
  const product = createRandomProductWithbarcode('12345');
  const promotion1 = createRandomPromotion(5, 4, product);
  const promotion2 = createRandomPromotion(
    5,
    4,
    product,
    PromotionType.THREEFORTWO,
  );
  const promotion3 = createRandomPromotion(
    5,
    4,
    product,
    PromotionType.TWOSECONDHALF,
  );

  const listproduct = createRandomListProduct(5, product);

  it('should work for simple promotion', () => {
    const res = getPromoValue(promotion1, listproduct);
    expect(res).equal(20);
  });

  it('should work for three for two promotion', () => {
    const res = getPromoValue(promotion2, listproduct);
    expect(res).equal(4);
  });

  it('should work for two seconde half promotion', () => {
    const res = getPromoValue(promotion3, listproduct);
    expect(res).equal(8);
  });
});

describe('test promotion Value using previous promotion', () => {
  const product = createRandomProductWithbarcode('12345');
  const promotion1 = createRandomPromotion(5, 4, product);
  const promotion2 = createRandomPromotion(
    5,
    4,
    product,
    PromotionType.THREEFORTWO,
  );
  const promotion3 = createRandomPromotion(
    5,
    4,
    product,
    PromotionType.TWOSECONDHALF,
  );

  const listproduct = createRandomListProduct(5, product);

  it('should find that promotion1 is worse than promotion (5 instead of )', () => {
    const res = getPromoDiffValue(promotion1, promotion2, listproduct);
    expect(res).equal(-(5 - ((5 / 3) * 2 + 1)));
  });

  it('and the other way around that promotion 2 is worse than promotion 1', () => {
    const res = getPromoDiffValue(promotion2, promotion1, listproduct);
    expect(res).equal(5 - ((5 / 3) * 2 + 1));
  });

  it('should find that promotion2 is also better than promotion3', () => {
    const res = getPromoDiffValue(promotion2, promotion3, listproduct);
    expect(res).equal(4.5 - ((5 / 3) * 2 + 1));
  });
});
