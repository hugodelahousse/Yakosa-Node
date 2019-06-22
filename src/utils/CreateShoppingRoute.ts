import ShoppingList from '@entities/ShoppingList';
import { Store } from '@entities/Store';
import { Promotion } from '@entities/Promotion';
import { StoreWithValueAndPromotion, ShoppingRoute } from 'types/ShoppingRoute';
import { ListProduct } from '@entities/ListProduct';
import { PromotionType } from '@entities/Promotion';

/**
 * Function that must find the the stores tou must travel to
 * to get the most promotions
 * @param stores
 * @param shoppingList
 * @param numMaxOfStore
 */
export function createShopingRoute(
  stores: Store[],
  shoppingList: ShoppingList,
  numMaxOfStore: number = 10,
): ShoppingRoute {
  // We calculate the value of each shop,
  // keep only the one that are usefull
  // and sort them to have the more usefull first
  const storeAndData = stores
    .map(store => getShopValue(shoppingList, store))
    .filter(store => store.value > 0)
    .sort((a, b) => (a.value < b.value ? 1 : a.value > b.value ? -1 : 0));

  const shoppingRoute: ShoppingRoute = {
    shoppingList,
    stores: [],
    promotions: [],
    economie: 0,
  };
  // then we create our route with another function
  return selectNextStore(shoppingRoute, numMaxOfStore, storeAndData);
}

/**
 * Select a new shop to add to the route
 * @param actualRoute
 * @param numLeftStore
 * @param storeAndDataLeft
 */
export function selectNextStore(
  actualRoute: ShoppingRoute,
  numLeftStore: number,
  storeAndDataLeft: StoreWithValueAndPromotion[],
): ShoppingRoute {
  if (storeAndDataLeft.length > 0 && numLeftStore > 0) {
    // we add the best shop to our route
    const bestStoreWithData = storeAndDataLeft.shift() as StoreWithValueAndPromotion;
    actualRoute.economie += bestStoreWithData.value;
    actualRoute.stores.push(bestStoreWithData.store);
    actualRoute.promotions = actualRoute.promotions.concat(
      bestStoreWithData.promotions,
    );

    let maxValue = 0;
    //  We re-evaluate value before of each store using the promotion we are currently using
    storeAndDataLeft = storeAndDataLeft
      .map(shop => {
        // We optimise our re-evaluation by only re-evaluing shop that have a chance to be used.
        const res = reEvaluateShopValue(actualRoute, shop, maxValue);
        if (res.value > maxValue) maxValue = res.value;
        return res;
      })
      .filter(store => store.value > 0)
      .sort((a, b) => (a.value < b.value ? 1 : a.value > b.value ? -1 : 0));

    // Then we continue our recursion
    return selectNextStore(actualRoute, numLeftStore - 1, storeAndDataLeft);
  }
  return actualRoute;
}

/**
 * Simple function to get the number of item needed to profit of a promo
 * @param type
 */
function getNumberOfProductFromPromoType(type: PromotionType) {
  return type === PromotionType.THREEFORTWO
    ? 3
    : type === PromotionType.TWOSECONDHALF
    ? 2
    : 1;
}

/**
 * Calculate the value of a promotion (without comparaison to other products)
 * @param promotion
 * @param listProduct
 */
export function getPromoValue(
  promotion: Promotion,
  listProduct: ListProduct,
): number {
  const quantityByPromo = getNumberOfProductFromPromoType(promotion.type);
  const numPromo = Math.trunc(listProduct.quantity / quantityByPromo);
  return numPromo * promotion.promotion;
}

/**
 * Calculate the value of a promotion in comparaison to another promotion
 * If the value returned is positive then the newPromo is better than the lastPromo
 * @param newPromo
 * @param lastPromo
 * @param listProduct
 */

export function getPromoDiffValue(
  newPromo: Promotion,
  lastPromo: Promotion,
  listProduct: ListProduct,
): number {
  // We calculate the total price of the product in the list with the new promotion
  const quantityOfNewPromo = getNumberOfProductFromPromoType(newPromo.type);
  const newPromoValue =
    Math.trunc(listProduct.quantity / quantityOfNewPromo) * newPromo.promotion;
  const realPriceWithNewPromo =
    (listProduct.quantity / quantityOfNewPromo) * newPromo.price -
    newPromoValue;

  // Then we do the same calcul with the last promotion
  const quantityOfLastPromo = getNumberOfProductFromPromoType(lastPromo.type);
  const LastPromoValue =
    Math.trunc(listProduct.quantity / quantityOfLastPromo) *
    lastPromo.promotion;
  const realPriceWithLastPromo =
    (listProduct.quantity / quantityOfLastPromo) * lastPromo.price -
    LastPromoValue;

  // And we return the diff between those to price
  return realPriceWithLastPromo - realPriceWithNewPromo;
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
      const promotionValue = getPromoValue(promotion, product);
      if (promotionValue > actualPromo) {
        promoChosen = promotion;
        actualPromo = promotionValue;
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

/**
 * Re-evaluate the score of a shop using the promotion already used in the route
 * @param shoppingRoute
 * @param store
 */
export function reEvaluateShopValue(
  shoppingRoute: ShoppingRoute,
  store: StoreWithValueAndPromotion,
  maxvalue: number = 0,
): StoreWithValueAndPromotion {
  // If we are already sure that re-evaluating the score will not change
  // anithing with the order of choosen store we don't recalculate it.
  if (store.value < maxvalue) {
    return store;
  }
  let newScore = 0;
  const newPromotion: Promotion[] = [];
  // For each promotion that are still relevant in the shop we recalculate his value
  for (const promotion of store.promotions) {
    // We find the item in the list relatred to the promotion
    const relatedListProduct = shoppingRoute.shoppingList.products.find(
      lp => lp.product.barcode == promotion.product.barcode,
    );
    // And we search if we already have a promotion used on this product
    const relatedPromotion = shoppingRoute.promotions.find(
      promo => promo.product.barcode === promotion.product.barcode,
    );
    if (!relatedPromotion) {
      // If we don't have another promotion on this product we simply use this promotion
      // To update the score of the store
      const promoScore = getPromoValue(
        promotion,
        relatedListProduct as ListProduct,
      );
      newScore += promoScore;
      newPromotion.push(promotion);
    } else {
      // If we already use a promotion we calculate the gain of using this promotion
      // instead of the other one
      const relatifPromoScore = getPromoDiffValue(
        promotion,
        relatedPromotion,
        relatedListProduct as ListProduct,
      );
      if (relatifPromoScore > 0) {
        // If using this promotion is better we update the score of the store
        newScore += relatifPromoScore;
        newPromotion.push(promotion);
      }
    }
  }

  // At last we returned the store with his score and the promotion relevant used to calculate this score
  return {
    store: store.store,
    promotions: newPromotion,
    value: newScore,
  };
}
