import pandas as pd
import json

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

cities_df = pd.read_csv("worldcities.csv")

cities_df["formatted_city"] = cities_df.apply(
    lambda row: f"{row['city']}, {row['admin_name']}, {row['country']}", axis=1
)

cities_df["is_priority"] = cities_df["formatted_city"].isin(PRIORITY_CITIES)

sorted_cities_df = cities_df.sort_values(
    by=["is_priority", "population"], ascending=[False, False]
)

sorted_cities_df.to_pickle("sorted_cities.pkl")

sorted_cities = sorted_cities_df["formatted_city"].tolist()

# Save the sorted cities list into a JSON file
with open("sorted_cities.json", "w") as f:
    json.dump(sorted_cities, f, indent=4)
