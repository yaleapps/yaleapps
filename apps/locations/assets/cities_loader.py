from typing import List
from pydantic import BaseModel
import requests


class Cities(BaseModel):
    cities: List[str]


class CitiesLoader:
    def load_all_cities(self) -> list[str]:
        url = "https://raw.githubusercontent.com/yaleapps/yaleapps/main/apps/locations/assets/sorted_cities.json"
        response = requests.get(url)
        if response.status_code == 200:
            city_list = Cities(cities=response.json())
            return city_list.cities
        else:
            print(f"Failed to retrieve data: {response.status_code}")
            return []
