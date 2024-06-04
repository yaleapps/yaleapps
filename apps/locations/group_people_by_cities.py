from typing import List
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
    response_first_cities: List[str] = response["First City"].split("\n")
    response_future_cities: List[str] = response["Future Cities"].split("\n")

    # Append names to respective city lists in one year dictionary
    for city in response_first_cities:
        city_people_one_year[city].append(person)

    # Append names to respective city lists in five years dictionary
    for city in response_future_cities:
        city_people_five_years[city].append(person)

all_first_cities = list(city_people_one_year.keys())
all_future_cities = list(city_people_five_years.keys())

# Create a form
with st.form("find_people_by_city_right_after_graduation"):
    selected_first_cities: List[str] = st.multiselect(
        "Find people by city (right after graduation)",
        placeholder="Find people in...",
        options=all_first_cities,
    )

    # Every form must have a submit button.
    submitted = st.form_submit_button("Submit")

    if submitted:
        if not selected_first_cities:
            st.error("Please select a city")
        else:
            for city in selected_first_cities:
                st.write("People in", city)
                people_in_city = city_people_one_year[city]
                tab1, tab2 = st.tabs(["Table View", "List View"])
                tab1.table(pd.DataFrame(people_in_city))
                for person in city_people_one_year[city]:
                    tab2.write(person)


with st.form("find_people_by_city_in_five_years"):
    selected_future_cities: List[str] = st.multiselect(
        "Find people by city (next 5 years)",
        placeholder="Find people who, in the next 5 years, will most likely be living in...",
        options=all_future_cities,
    )

    # Every form must have a submit button.
    submitted = st.form_submit_button("Submit")

    if submitted:
        if not selected_future_cities:
            st.error("Please select a city")
        else:
            for city in selected_future_cities:
                st.write("People in", city)
                people_in_city = city_people_five_years[city]
                tab1, tab2 = st.tabs(["Table View", "List View"])
                tab1.table(pd.DataFrame(people_in_city))
                for person in city_people_five_years[city]:
                    tab2.write(person)
