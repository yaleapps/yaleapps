from yalies import Person, API
import os
from dotenv import load_dotenv
import pandas as pd
from datetime import datetime


def get_academic_year_range():
    """
    Get the academic year range based on the current date.

    Returns:
        str: The academic year range in the format "YYYY-YYYY".

    Examples:
        >>> get_academic_year_range()
        '2020-2021'
    """
    current_date = datetime.now()
    current_year = current_date.year
    august_31 = datetime(current_year, 8, 31)

    if current_date <= august_31:
        start_year = current_year - 1
        end_year = current_year
    else:
        start_year = current_year
        end_year = current_year + 1

    return f"{start_year}-{end_year}"


load_dotenv()
api = API(os.getenv("YALIES_API_KEY"))

PAGE_SIZE = 1000

year_range = get_academic_year_range()

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

# Export to all formats using the dynamically generated year_string
save_path = f"yalies-archive/{year_range}"
if not os.path.exists(save_path):
    os.makedirs(save_path)

file_path_without_extension = f"{save_path}/{year_range}_yalies"

yalies_df.to_csv(f"{file_path_without_extension}.csv", index=False, encoding="utf-8")
yalies_df.to_pickle(f"{file_path_without_extension}.pkl", protocol=4)
yalies_df.to_excel(
    f"{file_path_without_extension}.xlsx",
    index=False,
    sheet_name=f"{year_range}_yalies",
    engine="openpyxl",
)
yalies_df.to_json(
    f"{file_path_without_extension}.json",
    orient="records",
    date_format="iso",
    indent=4,
)
yalies_df.to_sql(
    f"{file_path_without_extension}",
    f"sqlite:///{file_path_without_extension}.db",
    index=False,
    if_exists="replace",
)
