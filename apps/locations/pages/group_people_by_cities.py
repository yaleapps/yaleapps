from dataclasses import dataclass, asdict
from typing import Dict, List
import streamlit as st
from components.login import wrap_with_login_form
from helpers.google_sheet_helper import GoogleSheetManager, GoogleSheetManagerError

st.set_page_config(layout="wide")


@dataclass
class Person:
    name: str
    net_id: str
    personal_email: str
    phone_number: str
    visibility: bool


try:
    locations_sheet = GoogleSheetManager(sheet_name="Locations")
except GoogleSheetManagerError as e:
    st.error(e)
    st.stop()


# Function to display the main content
def main_content():
    responses = locations_sheet.get_all_records()

    # st.text("Original Data:")
    # st.table([response.model_dump() for response in responses])

    # Split cities by new lines and gather unique cities
    first_cities = [
        city for response in responses for city in response.selected_first_cities
    ]
    future_cities = [
        city for response in responses for city in response.selected_future_cities
    ]

    unique_first_cities = list(set(first_cities))
    unique_future_cities = list(set(future_cities))

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
            name=response.name,
            net_id=response.net_id,
            personal_email=response.personal_email,
            phone_number=response.phone_number,
            visibility=response.visibility,
        )

        for city in response.selected_first_cities:
            city_people_one_year[city].append(person)

        for city in response.selected_future_cities:
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
                                if person.visibility
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
                                if person.visibility
                            ]
                        )
                        for person in people_in_city:
                            tab2_view.write(person)


if __name__ == "__main__":
    wrap_with_login_form(main_content, locations_sheet)
