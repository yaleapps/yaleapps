from typing import Dict
import pandas as pd
import json
from pydantic import BaseModel

worldcities_csv_path = "worldcities.csv"


class CityCoordinates(BaseModel):
    lat: float
    lng: float


class CityData(BaseModel):
    city_data: Dict[str, CityCoordinates]

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

# Save the sorted cities list into a JSON file (array of city_formatted strings)
city_formatted_list = sorted_cities_df["city_formatted"].tolist()
with open("cities_formatted_list.json", "w") as f:
    json.dump(city_formatted_list, f, indent=4)

# Create the JSON object for city coordinates
city_data = {
    row["city_formatted"]: {"lat": row["lat"], "lng": row["lng"]}
    for _, row in sorted_cities_df.iterrows()
}

# Save the JSON object to a file (dictionary of city_formatted to lat and lng)
with open("cities_formatted_to_lat_lng.json", "w") as f:
    json.dump(city_data, f, indent=4)
