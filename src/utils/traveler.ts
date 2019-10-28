import { Store } from '@entities/Store';
import { calculateDist } from './positionUtils';
import { Position } from 'types/PositionType';

interface StoreNode {
  store: Store;
  index: number;
}

interface StoresAndDist {
  stores: StoreNode[];
  dist: number;
}

/**
 * find optimal route using  travelling salesman problem optimal algorithm
 * @param stores list of stores to travel to
 * @param initialPos initial position
 */
export function findOptimalRoute(
  stores: Store[],
  initialPos: Position,
): Store[] {
  // contain the matrice of ditance between stores
  const distMat: number[][] = [];

  // contain the dist from store to  inital position
  const distToInit: number[] = [];

  // pre-calculate distance between store
  for (let y = 0; y < stores.length; y++) {
    distMat.push([]);
    distToInit.push(calculateDist(initialPos, stores[y].position));
    for (let x = 0; x < stores.length; x++) {
      const dist = calculateDist(stores[x].position, stores[y].position);
      distMat[y].push(dist);
    }
  }

  // prepare store by adding them an index to use with distance matrice
  const storesWithIndex: StoreNode[] = stores.map((store, index) => {
    return {
      store,
      index,
    };
  });

  return findOptimalRouteRec(
    storesWithIndex,
    [],
    distMat,
    distToInit,
  ).stores.map(val => val.store);
}

function findOptimalRouteRec(
  toParcours: StoreNode[],
  alreadyTravel: StoreNode[],
  distMat: number[][],
  distToInit: number[],
): StoresAndDist {
  // stop case
  if (toParcours.length == 0) {
    return {
      stores: alreadyTravel,
      dist: calculateParcourDist(alreadyTravel, distMat, distToInit),
    };
  }

  let minDist = -1;
  let selectTravel: StoreNode[] = [];

  // try every possibility
  for (let index = 0; index < toParcours.length; index++) {
    const element = toParcours[index];
    const actualTravel = findOptimalRouteRec(
      toParcours.filter(val => val !== element),
      alreadyTravel.concat(element),
      distMat,
      distToInit,
    );

    // keep only the best possibility
    if (minDist < 0 || minDist > actualTravel.dist) {
      minDist = actualTravel.dist;
      selectTravel = actualTravel.stores;
    }
  }
  return { stores: selectTravel, dist: minDist };
}

/**
 * calculate the distance of a parcours
 * @param parcours parcours to travel
 * @param distMat matrice of distance to help computing
 * @param distToInit table of distance from the intial position to help computing
 */
function calculateParcourDist(
  parcours: StoreNode[],
  distMat: number[][],
  distToInit: number[],
): number {
  if (parcours.length == 0) return 0;

  // we first calculate the distance from the initial position to the firts store
  // and the last store to the initial position
  let actualDist =
    distToInit[parcours[0].index] +
    distToInit[parcours[parcours.length - 1].index];
  for (let index = 1; index < parcours.length; index++) {
    actualDist += distMat[parcours[index - 1].index][parcours[index].index];
  }
  return actualDist;
}
