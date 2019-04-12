from bs4 import BeautifulSoup

from scripts.newspaper_scrapper import scrap_newspaper
from scripts.utils import simple_get

URL = "http://anti-crise.fr/les-catalogues-avec-optimisations/"


def run():
    page = BeautifulSoup(simple_get(URL), 'html.parser')

    brand_names = []

    for brand_name in page.find_all("h2")[1:]:
        brand_names.append(brand_name.text.strip())

    stores = page.find_all("div", {"class": "block-items-catalogue"})

    for i in range(len(stores)):
        newspapers = stores[i].find_all("div")
        for newspaper in newspapers:
            dates = newspaper.find("h6").text.split("-")
            begin_date = dates[0].strip()
            end_date = dates[1].strip()
            link = newspaper.find("a", {"class": "info"})['href']
            scrap_newspaper(link, brand_names[i], begin_date, end_date)


if __name__ == "__main__":
    run()
