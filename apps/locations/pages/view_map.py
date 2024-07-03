import streamlit as st
from streamlit_folium import folium_static
import folium
from typing import Dict, List
from collections import Counter
from dataclasses import dataclass
from typing import Counter, Dict, List
import streamlit as st
from helpers.cities_loader import CitiesLoader, CityCoordinates
from components.login import wrap_with_login_form
from helpers.google_sheet_manager import (
    GoogleSheetManager,
    GoogleSheetManagerError,
    Response,
)

st.set_page_config(layout="wide")


@dataclass
class DisplayPersonInDataTable:
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


def create_map(
    cities_counter: Dict[str, int],
    cities_formatted_to_lat_lng: Dict[str, CityCoordinates],
) -> folium.Map:
    m = folium.Map(location=[0, 0], zoom_start=2)

    max_count = max(cities_counter.values())

    for city, count in cities_counter.items():
        coords = cities_formatted_to_lat_lng.get(city)
        if not coords:
            continue
        lat, lng = coords.lat, coords.lng
        if coords:
            size = 3 + (count / max_count) * 8  # Scale size between 5 and 25
            folium.CircleMarker(
                location=[lat, lng],
                radius=size,
                tooltip=f"{city} ({count})",
                fill=True,
                fillColor="#00356B",
                color="#00356B",
                fillOpacity=0.7,
            ).add_to(m)

    return m


def main_content(_: Response):
    cities_formatted_to_lat_lng = CitiesLoader().load_cities_formatted_to_lat_lng()
    if not cities_formatted_to_lat_lng:
        st.error("Failed to load cities. Please try again later.")
        st.stop()

    st.title("View Map (Bonus)🌎")
    st.markdown("The size of each circle represents the number of people in that city.")
    st.markdown(
        "**This form is only for viewing a summary and not the list of people.** "
        'To see the list of people in a city, please go to the "group people by cities" page and click "Submit".'
    )

    if st.button('Go to "group people by cities" page'):
        st.switch_page("pages/group_people_by_cities.py")

    responses = locations_sheet.get_all_records()

    # Count occurrences of each city
    first_cities_counter: Counter[str] = Counter()
    future_cities_counter: Counter[str] = Counter()

    # Feed in all the responses's selected cities arrays to the counters
    for response in responses:
        first_cities_counter.update(response.selected_first_cities)
        future_cities_counter.update(response.selected_future_cities)

    # Sort cities by count in descending order
    sorted_first_cities = sorted(
        first_cities_counter.items(),
        key=lambda city_and_count: city_and_count[1],
        reverse=True,
    )
    sorted_future_cities = sorted(
        future_cities_counter.items(),
        key=lambda city_and_count: city_and_count[1],
        reverse=True,
    )

    # Create dictionaries to store people under each city for First City and Future Cities separately
    city_people_one_year: Dict[str, List[DisplayPersonInDataTable]] = {
        city: [] for city, _ in sorted_first_cities
    }
    city_people_five_years: Dict[str, List[DisplayPersonInDataTable]] = {
        city: [] for city, _ in sorted_future_cities
    }

    # Fill the dictionaries with names for each city
    for response in responses:
        person = DisplayPersonInDataTable(
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
        m = create_map(
            first_cities_counter,
            cities_formatted_to_lat_lng=cities_formatted_to_lat_lng,
        )
        folium_static(m)

    with tab2:
        m = create_map(
            future_cities_counter,
            cities_formatted_to_lat_lng=cities_formatted_to_lat_lng,
        )
        folium_static(m)


if __name__ == "__main__":
    wrap_with_login_form(main_content, locations_sheet)
