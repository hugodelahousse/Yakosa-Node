import json

from bs4 import BeautifulSoup

from models.Promotion import Promotion, ScrapperPromotion
from scripts.utils import simple_get, promotion_post

USER_ID = 1
API_URL = "http://localhost:3000/"


def extract_information(page, store_name, begin_date, end_date):
    promotion_array = page.find("div", {"id": "price-table"}) \
        .find("div", {"id": "price-table-table"}) \
        .find("table") \
        .find_all("tr")
    promotion_array = promotion_array[1:]

    scrapped_promotions = []

    for promotion_data in promotion_array:
        cell = promotion_data.find_all("td")
        product_name = cell[1].string
        product_price = cell[3].string.replace("€", "")
        product_promo = cell[4].string.replace("€", "")
        promotion = ScrapperPromotion(store_name, begin_date, end_date, product_name, product_price, product_promo)
        scrapped_promotions.append(promotion)

    return scrapped_promotions


def scrap_newspaper(url, store_name, begin_date, end_date):
    page = BeautifulSoup(simple_get(url), 'html.parser')
    promotions = extract_information(page, store_name, begin_date, end_date)
    for scrapped_promotion in promotions:
        promotion = scrapped_promotion.convertToPromotion(API_URL, USER_ID)
        promotion = json.dumps(promotion.__dict__)
        promotion_post(API_URL + "promotions/", promotion)
