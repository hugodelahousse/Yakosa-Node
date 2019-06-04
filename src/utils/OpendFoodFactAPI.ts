import {
  OpenFoodFactProduct,
  OpenFoodFactProductResponse,
  OpenFoodFactProductsResponse,
} from 'types/OpenFoodFactProduct';
import * as request from 'request-promise';
import { tedis } from './redis';

export async function getProductFromBarcode(
  barcode: string,
): Promise<OpenFoodFactProduct | null> {
  let objectString: string;
  console.log(`Fetching info for ${barcode}`);
  if ((await tedis.exists(barcode)) === 1) {
    console.log(`Using cache for ${barcode}`);
    objectString = (await tedis.get(barcode)) as string;
    return JSON.parse(objectString) as OpenFoodFactProduct;
  }

  console.log(`Fetching OpenFoodFact for ${barcode}`);
  const object: OpenFoodFactProductResponse = await request(
    `https://fr.openfoodfacts.org/api/v0/produit/${barcode}`,
    { json: true },
  );

  const product = object.product ? object.product : null;

  await tedis.set(barcode, JSON.stringify(product));
  await tedis.expire(barcode, 604800);
  return product;
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
