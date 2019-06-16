import ShoppingList from '@entities/ShoppingList';
import { Store } from '@entities/Store';
import { Promotion } from '@entities/Promotion';
import { StoreWithValueAndPromotion } from 'types/ShoppingRoute';

/**
 * This function calculated the value of a shop for our algo
 * @param shoppingList
 * @param store
 */
export function getShopValue(
  shoppingList: ShoppingList,
  store: Store,
): StoreWithValueAndPromotion {
  let score = 0; // total economy on this shop
  const promotionsChoice: Promotion[] = []; // list of the promotion choosen in this shop
  shoppingList.products.forEach(product => {
    // for each product in the shopping list we choose the
    // best promotion related to it

    let actualPromo = 0;
    let promoChosen: Promotion | null = null;

    const filterToRelatedPromo = (promotion: Promotion) =>
      promotion.product.barcode == product.product.barcode;

    const findBestPromo = (promotion: Promotion) => {
      if (promotion.promotion * product.quantity > actualPromo) {
        promoChosen = promotion;
        actualPromo = promotion.promotion * product.quantity;
      }
    };

    // we search in the promotions of the shop
    store.promotions.filter(filterToRelatedPromo).forEach(findBestPromo);
    if (store.brand && store.brand.promotions) {
      // and in the promotion of the brand
      store.brand.promotions
        .filter(filterToRelatedPromo)
        .forEach(findBestPromo);
    }
    if (actualPromo > 0) {
      // If we found at least one promotion related to the product we add it
      // to our total
      score += actualPromo;
      promotionsChoice.push(promoChosen!);
    }
  });
  // The struct returned containes all our result
  // And will be usefull for optimisation
  return {
    Store: store,
    value: score,
    Promotions: promotionsChoice,
  };
}
