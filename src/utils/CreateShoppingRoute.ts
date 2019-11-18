import ShoppingList from '@entities/ShoppingList';
import { Store } from '@entities/Store';
import { Promotion } from '@entities/Promotion';
import { StoreWithValueAndPromotion, ShoppingRoute } from 'types/ShoppingRoute';
import { ListProduct } from '@entities/ListProduct';
import { PromotionType } from '@entities/Promotion';
import { Position } from 'types/PositionType';
import { calculateDist } from './positionUtils';
import { findOptimalRoute } from './traveler';

/**
 * Function that must find the list of stores
 * to get the most promotions
 * @param stores
 * @param shoppingList
 * @param numMaxOfStore
 */
export function createShopingRoute(
  stores: Store[],
  shoppingList: ShoppingList,
  numMaxOfStore: number = 10,
  position: Position,
  maxDistTravel: number,
): ShoppingRoute {
  // We use a lesser value for distTravel because we will use
  // the distance as the crow flies
  const approximativeMaxDistTravel = 0.8 * maxDistTravel;
  // We calculate the value of each shop,
  // keep only the one that are usefull
  // and sort them to have the more usefull first
  const storeAndData = stores
    .map(store => getShopValue(shoppingList, store))
    .filter(store => store.value > 0)
    .filter(
      store =>
        calculateDist(position, store.store.position) * 2 <
        approximativeMaxDistTravel,
    )
    .sort((a, b) => (a.value < b.value ? 1 : a.value > b.value ? -1 : 0));

  const shoppingRoute: ShoppingRoute = {
    shoppingList,
    stores: [],
    promotions: [],
    economie: 0,
  };
  // then we create our route with another function
  const route = selectNextStore(
    shoppingRoute,
    numMaxOfStore,
    storeAndData,
    position,
    maxDistTravel,
    approximativeMaxDistTravel,
  );

  route.stores = findOptimalRoute(route.stores, position);

  return route;
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
  position: Position,
  maxDistTravel: number,
  approximativeMaxDistTravel: number,
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
    //  We re-evaluate value before of each store using the promotions we are currently using
    storeAndDataLeft = storeAndDataLeft
      .filter(shop =>
        canStoreBeAddToRoute(
          shop.store,
          actualRoute,
          approximativeMaxDistTravel,
          position,
        ),
      )
      .map(shop => {
        // We optimise our re-evaluation by only re-evaluing shop that have a chance to be used.
        const res = reEvaluateShopValue(actualRoute, shop, maxValue);
        if (res.value > maxValue) maxValue = res.value;
        return res;
      })
      .filter(store => store.value > 0)
      .sort((a, b) => (a.value < b.value ? 1 : a.value > b.value ? -1 : 0));

    // Then we continue our recursion
    return selectNextStore(
      actualRoute,
      numLeftStore - 1,
      storeAndDataLeft,
      position,
      maxDistTravel,
      approximativeMaxDistTravel,
    );
  }
  return actualRoute;
}

/**
 * Calculate if we can add a store to a route without breaking the rule of maxDistance.
 * @param store
 * @param route
 * @param maxDist
 * @param originalPosition
 */
function canStoreBeAddToRoute(
  store: Store,
  route: ShoppingRoute,
  maxDist: number,
  originalPosition: Position,
) {
  // We will only work with position so we get them
  let positions: Position[] = route.stores
    .map(s => s.position)
    .concat([store.position]);
  // our fist position is the position of the user
  let actualPosition = originalPosition;
  let actualDistTravel = 0;
  // We will treat his position one by one
  while (positions.length > 0) {
    // We will always choose the position nearest to the previous one.
    // It's easiest than calculating avery possibility and should be
    // not far from the best combinaison.
    // TODO : Passer a une solution optimale, le nombre de magasin etant
    // faible (<= 10) tester toutes les possibilite n'est pas forcement trop long
    // Le probleme reste que ce test est executer de nombreuse fois
    let bestPosition = positions[0];
    let distTravel = calculateDist(actualPosition, positions[0]);
    for (let index = 1; index < positions.length; index++) {
      const element = positions[index];
      const dist = calculateDist(actualPosition, element);
      if (dist < distTravel) {
        distTravel = dist;
        bestPosition = element;
      }
    }
    actualDistTravel += distTravel;
    actualPosition = bestPosition;
    positions = positions.filter(p => p != actualPosition);
  }
  actualDistTravel += calculateDist(actualPosition, originalPosition);
  return actualDistTravel < maxDist;
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
  if (promotion.unit != listProduct.unit) return 0;
  const quantityByPromo = getNumberOfProductFromPromoType(promotion.type);
  const numPromo = Math.trunc(
    listProduct.quantity / (quantityByPromo * promotion.quantity),
  );
  return -numPromo * promotion.promotion;
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
    (listProduct.quantity / quantityOfNewPromo) * newPromo.price +
    newPromoValue;

  // Then we do the same calcul with the last promotion
  const quantityOfLastPromo = getNumberOfProductFromPromoType(lastPromo.type);
  const LastPromoValue =
    Math.trunc(listProduct.quantity / quantityOfLastPromo) *
    lastPromo.promotion;
  const realPriceWithLastPromo =
    (listProduct.quantity / quantityOfLastPromo) * lastPromo.price +
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
    let promoChosen: Promotion;

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
