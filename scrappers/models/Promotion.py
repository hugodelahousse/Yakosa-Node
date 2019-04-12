from scripts.utils import brand_by_name_get, product_by_name_get


class Promotion:
    def __init__(self, store_name, begin_date, end_date, name, price, promo):
        self.store_name = store_name
        self.beginDate = begin_date
        self.endDate = end_date
        self.name = name
        self.price = price
        self.promo = promo

    def __str__(self):
        return "Store: {} / Product name: {} / Product price: {} / Promotion: {}" \
            .format(self.store_name, self.name, self.price, self.promo)

    def convertToPromotion(self, url, user_id):
        brand_id = brand_by_name_get(url + "brands", self.store_name)
        if brand_id is not None:
            brand_id = brand_id["id"]
        product = product_by_name_get(url + "products/name/" + self.name)
        if product is not None:
            product = product["barcode"]
        return MetaPromotion("", self.beginDate, self.endDate, user_id, None, brand_id, product, self.price, self.promo)


class MetaPromotion:
    def __init__(self, description, begin_date, end_date, user_id, store_id, brand_id, product, price, promo):
        self.description = description
        self.beginDate = begin_date
        self.endDate = end_date
        self.user_id = user_id
        self.store_id = store_id
        self.brand_id = brand_id
        self.product = product
        self.price = price
        self.promo = promo
