import pandas as pd
import json


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


unsorted_cities_df = pd.read_csv("worldcities.csv")
sorted_cities_df = sort_cities_df(unsorted_cities_df)

# Save the sorted cities df into a pickle file
sorted_cities_df.to_pickle("sorted_cities_df.pkl")

# Save the sorted cities list into a JSON file
with open("sorted_cities.json", "w") as f:
    cities_formatted_list = sorted_cities_df["city_formatted"].tolist()
    json.dump(cities_formatted_list, f, indent=4)
