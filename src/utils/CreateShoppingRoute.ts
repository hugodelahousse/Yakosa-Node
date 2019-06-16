import ShoppingList from '@entities/ShoppingList';
import { Store } from '@entities/Store';
import { promotions } from 'tests/setup';
import { Promotion } from '@entities/Promotion';
import { StoreWithValueAndPromotion } from 'types/ShoppingRoute';

function getShopValue(
  shoppingList: ShoppingList,
  store: Store,
): StoreWithValueAndPromotion {
  let score = 0;
  const promotionsChoice: Promotion[] = [];
  shoppingList.products.forEach(product => {
    let actualPromo = 0;
    let promoChosen: Promotion | null = null;
    store.promotions
      .filter(promotion => promotion.product.barcode == product.product.barcode)
      .forEach(promotion => {
        if (promotion.promotion * product.quantity > actualPromo) {
          promoChosen = promotion;
          actualPromo = promotion.promotion * product.quantity;
        }
      });
    if (actualPromo > 0) {
      score += actualPromo;
      promotionsChoice.push(promoChosen!);
    }
  });
  return {
    Store: store,
    value: score,
    Promotions: promotionsChoice,
  };
}
