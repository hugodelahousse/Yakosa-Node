import json

from requests.exceptions import RequestException
from contextlib import closing
import requests


def is_good_response(resp):
    content_type = resp.headers['Content-Type'].lower()
    return (resp.status_code == 200
            and content_type is not None
            and content_type.find('html') > -1)


def log_error(e):
    print(e)


def simple_get(url):
    try:
        with closing(requests.get(url, stream=True)) as resp:
            if is_good_response(resp):
                return resp.content
            else:
                return None

    except RequestException as e:
        log_error('Error during requests to {0} : {1}'.format(url, str(e)))
        return None


def brand_by_name_get(url, brand_name):
    param = {'name': brand_name}
    try:
        with closing(requests.get(url, params=param)) as resp:
            if resp.status_code == 200:
                return json.loads(resp.content)
            else:
                return None
    except RequestException as e:
        log_error('Error during requests to {0} : {1}'.format(url, str(e)))
        return None


def product_by_name_get(url):
    try:
        with closing(requests.get(url)) as resp:
            if resp.status_code == 200:
                return json.loads(resp.content)
            else:
                return None
    except RequestException as e:
        log_error('Error during requests to {0} : {1}'.format(url, str(e)))
        return None


def promotion_post(url, promotion):
    try:
        with closing(requests.post(url, data=promotion)) as resp:
            if resp.status_code == 200:
                return json.loads(resp.content)
            else:
                return None
    except RequestException as e:
        log_error('Error during requests to {0} : {1}'.format(url, str(e)))
        return None
