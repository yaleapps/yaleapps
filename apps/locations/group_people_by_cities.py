from dataclasses import dataclass, asdict
from typing import Any, Dict, List, Union
import streamlit as st
from helpers.google_sheet_helper import GoogleSheetManager

st.set_page_config(layout="wide")


@dataclass
class Person:
    Name: str
    NetID: str
    Personal_Email: str
    Phone_Number: str
    Visibility: bool


# Open the Google Sheet by key and get the data from the first sheet
manager = GoogleSheetManager(sheet_name="Locations")
if manager.sheet is None:
    st.error("Failed to initialize Google Worksheet")
    st.stop()
responses = manager.get_all_records()


# st.text("Original Data:")
# st.table([response.model_dump() for response in responses])

# Split cities by new lines and gather unique cities
first_city_list = [city for response in responses for city in response.First_City]
future_city_list = [city for response in responses for city in response.Future_Cities]

unique_first_cities = list(set(first_city_list))
unique_future_cities = list(set(future_city_list))

# Create dictionaries to store people under each city for First City and Future Cities separately
city_people_one_year: Dict[str, List[Person]] = {
    city: [] for city in unique_first_cities
}
city_people_five_years: Dict[str, List[Person]] = {
    city: [] for city in unique_future_cities
}

# Fill the dictionaries with names for each city
for response in responses:
    person = Person(
        Name=response.Name,
        NetID=response.NetID,
        Personal_Email=response.Personal_Email,
        Phone_Number=response.Phone_Number,
        Visibility=response.Visibility,
    )

    for city in response.First_City:
        city_people_one_year[city].append(person)

    for city in response.Future_Cities:
        city_people_five_years[city].append(person)

# Create tabs for each form
tab1, tab2 = st.tabs(
    [
        "Find people by city (right after graduation)",
        "Find people by city (next 5 years)",
    ]
)

with tab1:
    with st.form("find_people_by_city_right_after_graduation"):
        selected_first_cities: List[str] = st.multiselect(
            "Find people by city (right after graduation)",
            placeholder="Find people in...",
            options=unique_first_cities,
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
                    tab1_view, tab2_view = st.tabs(["Table View", "List View"])
                    tab1_view.table(
                        [
                            asdict(person)
                            for person in people_in_city
                            if person.Visibility
                        ]
                    )
                    for person in people_in_city:
                        tab2_view.write(person)

with tab2:
    with st.form("find_people_by_city_in_five_years"):
        selected_future_cities: List[str] = st.multiselect(
            "Find people by city (next 5 years)",
            placeholder="Find people who, in the next 5 years, will most likely be living in...",
            options=unique_future_cities,
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
                    tab1_view, tab2_view = st.tabs(["Table View", "List View"])
                    tab1_view.table(
                        [
                            asdict(person)
                            for person in people_in_city
                            if person.Visibility
                        ]
                    )
                    for person in people_in_city:
                        tab2_view.write(person)
