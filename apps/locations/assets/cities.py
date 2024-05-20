import pandas as pd
import json


# Load cities from 'worldcities.csv' CSV file
def load_cities():
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

    # Read the CSV file
    cities_df = pd.read_csv("worldcities.csv")

    # Format city names in the desired format
    cities_df["formatted_city"] = cities_df.apply(
        lambda row: f"{row['city']}, {row['admin_name']}, {row['country']}", axis=1
    )

    # Create a priority column
    cities_df["is_priority"] = cities_df["formatted_city"].isin(PRIORITY_CITIES)

    # Sort by priority first (descending) and then by population (descending)
    sorted_cities_df = cities_df.sort_values(
        by=["is_priority", "population"], ascending=[False, False]
    )

    # Extract the sorted city names into a list
    sorted_cities = sorted_cities_df["formatted_city"].tolist()

    return sorted_cities


# Load cities and get the sorted list
sorted_cities = load_cities()

# Save the sorted cities list into a JSON file
with open("sorted_cities.json", "w") as f:
    json.dump(sorted_cities, f, indent=4)
