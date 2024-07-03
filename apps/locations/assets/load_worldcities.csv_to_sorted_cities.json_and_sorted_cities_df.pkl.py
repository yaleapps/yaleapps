import pandas as pd
import json
from pydantic import BaseModel

worldcities_csv_path = "worldcities.csv"


class CityData(BaseModel):
    id: int
    city: str
    admin_name: str
    country: str
    population: float
    lat: float
    lng: float
    city_formatted: str

    class Config:
        coerce_numbers_to_str = True


def sort_cities_df(cities_df: pd.DataFrame) -> pd.DataFrame:
    PRIORITY_CITIES = [
        "New York, New York, United States",
        "New Haven, Connecticut, United States",
        "Boston, Massachusetts, United States",
        "Washington, District of Columbia, United States",
        "San Francisco, California, United States",
        "Los Angeles, California, United States",
        "Chicago, Illinois, United States",
        "Seattle, Washington, United States",
        "London, England, United Kingdom",
        "Austin, Texas, United States",
        "Houston, Texas, United States",
        "Atlanta, Georgia, United States",
        "Miami, Florida, United States",
        "Philadelphia, Pennsylvania, United States",
    ]
    cities_df["city_formatted"] = cities_df.apply(
        lambda row: f"{row['city']}, {row['admin_name']}, {row['country']}", axis=1
    )
    cities_df["is_priority"] = cities_df["city_formatted"].isin(PRIORITY_CITIES)
    cities_df = cities_df.sort_values(
        by=["is_priority", "population"], ascending=[False, False]
    )
    # Drop the recently created is_priority column
    cities_df = cities_df.drop(columns=["is_priority"])

    return cities_df


unsorted_cities_df = pd.read_csv(
    worldcities_csv_path,
    usecols=["id", "city", "admin_name", "country", "population", "lat", "lng"],
)

sorted_cities_df = sort_cities_df(unsorted_cities_df)

# Save the sorted cities df into a pickle file
sorted_cities_df.to_pickle("sorted_cities_df.pkl")

# Save the sorted cities list into a JSON file
with open("sorted_cities.json", "w") as f:
    json.dump(sorted_cities_df["city_formatted"].tolist(), f, indent=4)
