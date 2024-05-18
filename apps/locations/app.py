import streamlit as st
import pandas as pd
import re
import phonenumbers
from validate_email import validate_email


# Load cities from 'worldcities.csv' CSV file, downloaded from https://simplemaps.com/data/world-cities
def load_cities():
    PRIORITY_CITIES = [
        "New York, New York, United States",
        "New Haven, Connecticut, United States",
        "Boston, Massachusetts, United States",
        "Washington, District of Columbia, United States",
        "San Francisco, California, United States",
        "Los Angeles, California, United States",
        "Chicago, Illinois, United States",
        "Seattle, Washington, United States",
        "London, England, United Kingdom",
        "Austin, Texas, United States",
        "Houston, Texas, United States",
        "Atlanta, Georgia, United States",
        "Miami, Florida, United States",
    ]

    # Read the CSV file
    cities_df = pd.read_csv("worldcities.csv")

    # Format city names in the desired format
    cities_df["formatted_city"] = cities_df.apply(
        lambda row: f"{row['city']}, {row['admin_name']}, {row['country']}", axis=1
    )

    # Create a priority column
    cities_df["is_priority"] = cities_df["formatted_city"].isin(PRIORITY_CITIES)

    # Sort by priority first (descending) and then by population (descending)
    sorted_cities_df = cities_df.sort_values(
        by=["is_priority", "population"], ascending=[False, False]
    )

    # Extract the sorted city names into a list
    sorted_cities = sorted_cities_df["formatted_city"].tolist()

    return sorted_cities


# Input validation functions
def is_valid_email(email):
    return validate_email(email, verify=True)


def is_valid_phone(phone):
    try:
        phone_obj = phonenumbers.parse(phone, None)
        return phonenumbers.is_valid_number(phone_obj)
    except phonenumbers.phonenumberutil.NumberParseException:
        return False


# Streamlit application
st.title("Post-Graduation Location Survey")

# Input fields with placeholder texts
name = st.text_input("Name", placeholder="First, Last")

university_email = st.text_input(
    "University Email", placeholder="example@university.edu"
)
if university_email and not is_valid_email(university_email):
    st.error("Invalid university email format")

personal_email = st.text_input("Personal Email", placeholder="example@domain.com")
if personal_email and not is_valid_email(personal_email):
    st.error("Invalid personal email format")

if personal_email and university_email and personal_email == university_email:
    st.error("Personal email and university email should not be the same")

phone_number = st.text_input("Phone Number", placeholder="+1234567890")
if phone_number and not is_valid_phone(phone_number):
    st.error("Invalid phone number format")

# Load cities and create a city dropdown
cities = load_cities()
selected_city = st.selectbox("Where will you be after graduation?", cities)

# Submit button
if st.button("Submit"):
    if not name or not personal_email or not university_email or not phone_number:
        st.error("Please fill in all the fields")
    elif (
        not is_valid_email(personal_email)
        or not is_valid_email(university_email)
        or not is_valid_phone(phone_number)
    ):
        st.error("Please correct the invalid fields")
    elif personal_email == university_email:
        st.error("Personal email and university email should not be the same")
    else:
        # Data storage options (example with Streamlit's session state)
        if "responses" not in st.session_state:
            st.session_state["responses"] = []
        st.session_state["responses"].append(
            {
                "name": name,
                "personal_email": personal_email,
                "university_email": university_email,
                "phone_number": phone_number,
                "city": selected_city,
            }
        )
        st.success("Response submitted successfully!")

# Display responses (for demonstration purposes)
if "responses" in st.session_state:
    st.write("Submitted Responses:")
    for response in st.session_state["responses"]:
        st.write(response)
