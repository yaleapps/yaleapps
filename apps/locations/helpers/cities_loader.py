from typing import Dict, List, Optional
from pydantic import BaseModel
import requests
import streamlit as st


class CitiesFormattedList(BaseModel):
    cities: List[str]


class CityCoordinates(BaseModel):
    lat: float
    lng: float


class CitiesFormattedToLatLng(BaseModel):
    cities_formatted_to_lat_lng: Dict[str, CityCoordinates]


class CitiesLoader:
    def load_cities_formatted_list(self) -> Optional[list[str]]:
        url = "https://raw.githubusercontent.com/yaleapps/yaleapps/main/apps/locations/data/cities_formatted_list.json"
        response = requests.get(url)
        if response.status_code == 200:
            cities_formatted_list = CitiesFormattedList(cities=response.json())
            return cities_formatted_list.cities
        else:
            st.error("Failed to load cities. Please try again later.")
            return None

    def load_cities_formatted_to_lat_lng(
        self,
    ) -> Optional[Dict[str, CityCoordinates]]:
        url = "https://raw.githubusercontent.com/yaleapps/yaleapps/main/apps/locations/data/cities_formatted_to_lat_lng.json"
        response = requests.get(url)
        if response.status_code == 200:
            cities_formatted_to_lat_lng = CitiesFormattedToLatLng(
                cities_formatted_to_lat_lng=response.json()
            )
            return cities_formatted_to_lat_lng.cities_formatted_to_lat_lng
        else:
            st.error("Failed to load cities. Please try again later.")
            return None
