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

    storeAndDataLeft = storeAndDataLeft
      .map(shop => reEvaluateShopValue(actualRoute, shop))
      .filter(store => store.value > 0)
      .sort((a, b) => (a.value < b.value ? 1 : a.value > b.value ? -1 : 0));
    // TODO: We should re-evaluate value before continuing the recursion first

    // Then we continue our recursion
    return selectNextStore(actualRoute, numLeftStore - 1, storeAndDataLeft);
  }
  return actualRoute;
}

function getNumberOfProductFromPromoType(type: PromotionType) {
  return type === PromotionType.THREEFORTWO
    ? 3
    : type === PromotionType.TWOSECONDHALF
    ? 2
    : 1;
}

/**
 *
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

export function getPromoDiffValue(
  newPromo: Promotion,
  lastPromo: Promotion,
  listProduct: ListProduct,
): number {
  const quantityOfNewPromo = getNumberOfProductFromPromoType(newPromo.type);
  const newPromoValue =
    Math.trunc(listProduct.quantity / quantityOfNewPromo) * newPromo.promotion;
  const realPriceWithNewPromo =
    (listProduct.quantity / quantityOfNewPromo) * newPromo.price -
    newPromoValue;

  const quantityOfLastPromo = getNumberOfProductFromPromoType(lastPromo.type);
  const LastPromoValue =
    Math.trunc(listProduct.quantity / quantityOfLastPromo) *
    lastPromo.promotion;
  const realPriceWithLastPromo =
    (listProduct.quantity / quantityOfLastPromo) * lastPromo.price -
    LastPromoValue;

  return realPriceWithNewPromo - realPriceWithLastPromo;
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

export function reEvaluateShopValue(
  shoppingRoute: ShoppingRoute,
  store: StoreWithValueAndPromotion,
): StoreWithValueAndPromotion {
  let newScore = 0;
  const newPromotion: Promotion[] = [];
  for (const promotion of store.promotions) {
    const relatedListProduct = shoppingRoute.shoppingList.products.find(
      lp => lp.product.barcode == promotion.product.barcode,
    );
    const relatedPromotion = shoppingRoute.promotions.find(
      promo => promo.product.barcode === promotion.product.barcode,
    );
    if (!relatedPromotion) {
      const promoScore = getPromoValue(
        promotion,
        relatedListProduct as ListProduct,
      );
      newScore += promoScore;
      newPromotion.push(promotion);
    } else {
      const relatifPromoScore = getPromoDiffValue(
        promotion,
        relatedPromotion,
        relatedListProduct as ListProduct,
      );
      if (relatifPromoScore > 0) {
        newScore += relatifPromoScore;
        newPromotion.push(promotion);
      }
    }
  }

  return {
    store: store.store,
    promotions: newPromotion,
    value: newScore,
  };
}
