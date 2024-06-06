from dataclasses import dataclass, asdict
from typing import Any, Dict, List, Union
import streamlit as st
from oauth2client.service_account import ServiceAccountCredentials
from helpers.google_sheet_helper import init_google_worksheet
from pydantic import BaseModel, Field, ValidationError, validator


@dataclass
class Person:
    Name: str
    NetID: str
    Personal_Email: str
    Phone_Number: str
    Visibility: bool


class Response(BaseModel):
    Name: str
    NetID: str
    Personal_Email: str = Field(..., alias="Personal Email")
    Phone_Number: str = Field(..., alias="Phone Number")
    Visibility: bool
    First_City: List[str] = Field(..., alias="First City")
    Future_Cities: List[str] = Field(..., alias="Future Cities")

    @validator("First_City", "Future_Cities", pre=True)
    def split_cities(cls, value):
        if isinstance(value, str):
            return value.split("\n")
        return value

    @validator("Phone_Number", pre=True)
    def coerce_phone_number(cls, value: Union[str, int]) -> str:
        return str(value)

    @validator("Visibility", pre=True)
    def coerce_visibility(cls, value: Union[str, int]) -> bool:
        return bool(value)


# Open the Google Sheet by key and get the data from the first sheet
sh = init_google_worksheet(sheet_name="Locations")
data = sh.get_all_records()


def validate_record(record: Dict[str, Any]) -> Union[Response, None]:
    if isinstance(record, dict):
        try:
            return Response(**record)
        except ValidationError as e:
            st.error(f"Validation error for record {record}: {e}")
            return None
    else:
        st.error(f"Record is not a dictionary: {record}")
        return None


# Convert the data to a list of ResponseModel instances using list comprehension
responses = [
    response for record in data if (response := validate_record(record)) is not None
]

st.text("Original Data:")
st.table([response.model_dump() for response in responses])

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

# Create a form
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
                tab1, tab2 = st.tabs(["Table View", "List View"])
                tab1.table([asdict(person) for person in people_in_city])
                for person in people_in_city:
                    tab2.write(person)

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
                tab1, tab2 = st.tabs(["Table View", "List View"])
                tab1.table([asdict(person) for person in people_in_city])
                for person in people_in_city:
                    tab2.write(person)
