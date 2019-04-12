from bs4 import BeautifulSoup

from scripts.newspaper_scraper import scrap_newspaper
from scripts.utils import simple_get

HISTORY_FILE = "../misc/history"
URL = "http://anti-crise.fr/les-catalogues-avec-optimisations/"


def get_history():
    values = []
    with open(HISTORY_FILE, "r") as file:
        for line in file:
            values.append(line[:len(line) - 1])
    return values


def run():
    page = BeautifulSoup(simple_get(URL), 'html.parser')
    history = get_history()

    brand_names = []
    for brand_name in page.find_all("h2")[1:]:
        brand_names.append(brand_name.text.strip())

    stores = page.find_all("div", {"class": "block-items-catalogue"})
    with open(HISTORY_FILE, "a") as file:
        for i in range(len(stores)):
            newspapers = stores[i].find_all("div")

            for newspaper in newspapers:
                dates = newspaper.find("h6").text.split("-")
                begin_date = dates[0].strip()
                end_date = dates[1].strip()
                id = '{}-{}-{}'.format(brand_names[i], begin_date, end_date)

                if id not in history:
                    link = newspaper.find("a", {"class": "info"})['href']
                    file.write(id + '\n')

                    scrap_newspaper(link, brand_names[i], begin_date, end_date)


if __name__ == "__main__":
    run()
