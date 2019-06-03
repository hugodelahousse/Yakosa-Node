import {
  OpenFoodFactProduct,
  OpenFoodFactProductResponse,
  OpenFoodFactProductsResponse,
} from 'types/OpenFoodFactProduct';
import * as request from 'request-promise';
import { tedis } from './redis';

export async function getProductFromBarcode(
  barcode: string,
): Promise<OpenFoodFactProduct> {
  let objectString: string;
  if ((await tedis.exists(barcode)) === 1) {
    console.log('get cache');
    objectString = (await tedis.get(barcode)) as string;
    console.log('cache goten');
    const object = JSON.parse(objectString) as OpenFoodFactProduct;
    return object;
  }
  const object: OpenFoodFactProductResponse = await request(
    `https://fr.openfoodfacts.org/api/v0/produit/${barcode}`,
    { json: true },
  );
  console.log('obj get');
  objectString = JSON.stringify(object.product);
  console.log('obj stringify');
  tedis.set(barcode, objectString);
  console.log('obj set');
  tedis.expire(barcode, 604800);
  return object.product;
}

export async function getProductFromName(
  name: string,
): Promise<OpenFoodFactProduct | null> {
  const url =
    'https://world.openfoodfacts.org/cgi/search.pl' +
    `?search_terms=${name}&search_simple=1&action=process&json=1`;
  const object: OpenFoodFactProductsResponse = await request(url, {
    json: true,
  });
  if (object.products.length === 0) {
    return null;
  }
  return object.products[0];
}
