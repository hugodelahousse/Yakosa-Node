from bs4 import BeautifulSoup

from models.Promotion import Promotion, MetaPromotion
from scripts.utils import simple_get, promotion_post

USER_ID = 1
API_URL = "http://localhost:3000/"


def extract_information(page, store_name, begin_date, end_date):
    promotion_array = page.find("div", {"id": "price-table"}) \
        .find("div", {"id": "price-table-table"}) \
        .find("table") \
        .find_all("tr")
    promotion_array = promotion_array[1:]

    scraped_promotions = []

    for promotion_data in promotion_array:
        cell = promotion_data.find_all("td")
        product_name = cell[1].string
        product_price = cell[3].string.replace("€", "")
        product_promo = cell[4].string.replace("€", "")
        promotion = Promotion(store_name, begin_date, end_date, product_name, product_price, product_promo)
        scraped_promotions.append(promotion)

    return scraped_promotions


def scrap_newspaper(url, store_name, begin_date, end_date):
    page = BeautifulSoup(simple_get(url), 'html.parser')
    promotions = extract_information(page, store_name, begin_date, end_date)
    for scraped_promotion in promotions:
        promotion = scraped_promotion.convertToPromotion(API_URL, USER_ID)
        if promotion is not None:
            promotion_post(API_URL + "promotions/", promotion)
