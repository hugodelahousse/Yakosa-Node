from requests import get
from requests.exceptions import RequestException
from contextlib import closing
from bs4 import BeautifulSoup

STRING_URL = "http://anti-crise.fr/catalogue/catalogue-aldi-du-10-au-16-avril-2019/"


class Promotion:
    def __init__(self, store_name, name, price, promo):
        self.store_name = store_name
        self.name = name
        self.price = price
        self.promo = promo

    def __str__(self):
        return "Store: {} / Product name: {} / Product price: {} / Promotion: {}" \
            .format(self.store_name, self.name, self.price, self.promo)


def simple_get(url):
    try:
        with closing(get(url, stream=True)) as resp:
            if is_good_response(resp):
                return resp.content
            else:
                return None

    except RequestException as e:
        log_error('Error during requests to {0} : {1}'.format(url, str(e)))
        return None


def is_good_response(resp):
    content_type = resp.headers['Content-Type'].lower()
    return (resp.status_code == 200
            and content_type is not None
            and content_type.find('html') > -1)


def log_error(e):
    print(e)


def extract_information(page, store_name):
    promotion_array = page.find("div", {"id": "price-table"}) \
        .find("div", {"id": "price-table-table"}) \
        .find("table") \
        .find_all("tr")
    promotion_array = promotion_array[1:]

    scrapped_promotions = []

    for promotion in promotion_array:
        tmp = promotion.find_all("td")
        store_name = store_name
        product_name = tmp[1].string
        product_price = tmp[3].string.replace("€", "")
        product_promo = tmp[4].string.replace("€", "")
        t = Promotion(store_name, product_name, product_price, product_promo)
        scrapped_promotions.append(t)

    return scrapped_promotions


if __name__ == "__main__":
    soup = BeautifulSoup(simple_get(STRING_URL), 'html.parser')
    promotions = extract_information(soup, "Aldi")
    for i in promotions:
        print(i)
