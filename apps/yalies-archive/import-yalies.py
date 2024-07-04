from yalies import Person, API
import os
from dotenv import load_dotenv
import pandas as pd

load_dotenv()
api = API(os.getenv("YALIES_API_KEY"))

PAGE_SIZE = 1000

all_yalies: list[Person] = []
page = 1

while True:
    current_page_yalies = api.people(page=page, page_size=PAGE_SIZE)
    all_yalies.extend(current_page_yalies)

    is_last_page = len(current_page_yalies) < PAGE_SIZE
    if is_last_page:
        break
    page += 1

print(f"Total records fetched: {len(all_yalies)}")

yalies_df = pd.DataFrame([yalie.raw for yalie in all_yalies])
yalies_df.to_csv("yalies.csv", index=False)
yalies_df.to_pickle("yalies.pkl")
