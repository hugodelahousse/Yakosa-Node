import json
import logging

from requests.exceptions import RequestException
from contextlib import closing
import requests


def is_good_response(resp):
    content_type = resp.headers['Content-Type'].lower()
    return (resp.status_code == 200
            and content_type is not None
            and content_type.find('html') > -1)


def simple_get(url):
    try:
        with closing(requests.get(url, stream=True)) as resp:
            if is_good_response(resp):
                return resp.content
            else:
                return None

    except RequestException as e:
        logging.exception("simple_get")
        return None


def brand_by_name_get(url):
    try:
        with closing(requests.get(url)) as resp:
            if resp.status_code == 200:
                return json.loads(resp.content)
            else:
                return None
    except RequestException as e:
        logging.exception("brand_by_name_get")
        return None


def product_by_name_get(url):
    try:
        with closing(requests.get(url)) as resp:
            if resp.status_code == 200:
                return json.loads(resp.content)
            else:
                return None
    except RequestException as e:
        logging.exception("product_by_name_get")
        return None


def promotion_post(url, promotion):
    try:
        with closing(requests.post(url, json=promotion.__dict__)) as resp:
            if resp.status_code == 201:
                return json.loads(resp.content)
            else:
                return None
    except RequestException as e:
        logging.exception("product_by_name_get")
        return None
