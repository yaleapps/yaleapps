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

# Create dictionaries to store people under each city for First City and Future Cities separately
city_people_one_year = {city: [] for city in first_city_series.unique()}
city_people_five_years = {city: [] for city in future_city_series.unique()}

# Fill the dictionaries with names for each city
for _, response in df.iterrows():
    # Get names of people
    person = {
        "Name": response["Name"],
        "NetID": response["NetID"],
        "Personal Email": response["Personal Email"],
        "Phone Number": response["Phone Number"],
        "Visibility": response["Visibility"],
    }

    # Split the cities for the current response
    first_cities = response["First City"].split("\n")
    future_cities = response["Future Cities"].split("\n")

    # Append names to respective city lists in one year dictionary
    for city in first_cities:
        city_people_one_year[city].append(person)

    # Append names to respective city lists in five years dictionary
    for city in future_cities:
        city_people_five_years[city].append(person)

# Convert the dictionaries to DataFrames
result_df_one_year = pd.DataFrame(
    {
        "City": list(city_people_one_year.keys()),
        "People": ["\n".join(people) for people in city_people_one_year.values()],
    }
)

result_df_five_years = pd.DataFrame(
    {
        "City": list(city_people_five_years.keys()),
        "People": ["\n".join(people) for people in city_people_five_years.values()],
    }
)

st.text("People in each city right after graduation:")
st.write(result_df_one_year)

st.text("People in each city in the next 5 years:")
st.write(result_df_five_years)
