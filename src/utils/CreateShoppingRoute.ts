import ShoppingList from '@entities/ShoppingList';
import { Store } from '@entities/Store';
import { Promotion } from '@entities/Promotion';
import { StoreWithValueAndPromotion, ShoppingRoute } from 'types/ShoppingRoute';

export function createShopingRoute(
  stores: Store[],
  shoppingList: ShoppingList,
  numMaxOfStore: number = 10,
): ShoppingRoute {
  const storeAndData = stores
    .map(store => getShopValue(shoppingList, store))
    .sort((a, b) => (a.value < b.value ? 1 : a.value > b.value ? -1 : 0));
  const shoppingRoute: ShoppingRoute = {
    shoppingList,
    stores: [],
    promotions: [],
    economie: 0,
  };
  return selectNextStore(shoppingRoute, numMaxOfStore, storeAndData);
}

export function selectNextStore(
  actualRoute: ShoppingRoute,
  numLeftStore: number,
  storeAndDataLeft: StoreWithValueAndPromotion[],
): ShoppingRoute {
  // add value
  if (storeAndDataLeft.length > 0 && numLeftStore > 0) {
    const bestStoreWithData = storeAndDataLeft.shift() as StoreWithValueAndPromotion;
    actualRoute.economie += bestStoreWithData.value;
    actualRoute.stores.push(bestStoreWithData.store);
    actualRoute.promotions = actualRoute.promotions.concat(
      bestStoreWithData.promotions,
    );
    return selectNextStore(actualRoute, numLeftStore - 1, storeAndDataLeft);
  }
  return actualRoute;
  // Re-evaluate score
}

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
    store,
    value: score,
    promotions: promotionsChoice,
  };
}
