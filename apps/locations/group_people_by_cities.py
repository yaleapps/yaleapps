import pandas as pd
import streamlit as st
from oauth2client.service_account import ServiceAccountCredentials
from helpers.google_sheet_helper import init_google_worksheet

# Open the Google Sheet by key and get the data from the first sheet
sh = init_google_worksheet(sheet_name="Locations")
data = sh.get_all_records()

# Convert the data to a pandas DataFrame
df = pd.DataFrame(data)

st.text("Original DataFrame:")
st.write(df)



# Split cities by new lines and gather unique cities
first_city_series = df["First City"].str.split("\n").explode()
future_city_series = df["Future Cities"].str.split("\n").explode()

# Combine both series and get unique cities
all_cities = pd.concat([first_city_series, future_city_series]).unique()

# Create a dictionary to store people under each city
city_people = {city: [] for city in all_cities}

# Fill the dictionary with names for each city
for _, row in df.iterrows():
    # Get names of people
    name = row["Name"]

    # Split the cities for the current row
    first_cities = row["First City"].split("\n")
    future_cities = row["Future Cities"].split("\n")

    # Append names to respective city lists
    for city in first_cities:
        city_people[city].append(name)

    for city in future_cities:
        city_people[city].append(name)

# Convert the dictionary to a DataFrame
result_df = pd.DataFrame(
    {
        "City": list(city_people.keys()),
        "People": ["\n".join(people) for people in city_people.values()],
    }
)

st.text("Aggregated City People Data:")
result_df
