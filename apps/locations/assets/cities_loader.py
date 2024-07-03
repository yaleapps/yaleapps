from typing import List
from pydantic import BaseModel
import requests


class CitiesFormattedList(BaseModel):
    cities: List[str]


class CitiesFormattedToLatLng(BaseModel):
    cities_formatted_to_lat_lng: dict[str, tuple[float, float]]


class CitiesLoader:
    def load_cities_formatted_list(self) -> list[str]:
        url = "https://raw.githubusercontent.com/yaleapps/yaleapps/main/apps/locations/assets/cities_formatted_list.json"
        response = requests.get(url)
        if response.status_code == 200:
            cities_formatted_list = CitiesFormattedList(cities=response.json())
            return cities_formatted_list.cities
        else:
            print(f"Failed to retrieve data: {response.status_code}")
            return []

    def load_lat_lng(self) -> dict[str, tuple[float, float]]:
        url = "https://raw.githubusercontent.com/yaleapps/yaleapps/main/apps/locations/assets/cities_formatted_to_lat_lng.json"
        response = requests.get(url)
        if response.status_code == 200:
            cities_formatted_to_lat_lng = CitiesFormattedToLatLng(
                cities_formatted_to_lat_lng=response.json()
            )
            return cities_formatted_to_lat_lng.cities_formatted_to_lat_lng
        else:
            print(f"Failed to retrieve data: {response.status_code}")
            return {}
