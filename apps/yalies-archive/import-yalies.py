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

# Export to all formats
yalies_df.to_csv("2023-2024_yalies.csv", index=False, encoding="utf-8")
yalies_df.to_pickle("2023-2024_yalies.pkl", protocol=4)
yalies_df.to_excel(
    "2023-2024_yalies.xlsx",
    index=False,
    sheet_name="2023-2024_yalies",
    engine="openpyxl",
)
yalies_df.to_json(
    "2023-2024_yalies.json", orient="records", date_format="iso", indent=4
)
yalies_df.to_sql(
    "2023-2024_yalies", "sqlite:///yalies.db", index=False, if_exists="replace"
)
