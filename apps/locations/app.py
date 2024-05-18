import streamlit as st
import re
import requests
import pycountry

# Constants
MAJOR_CITIES_API_URL = "https://api.teleport.org/api/urban_areas/"
POPULATION_THRESHOLD = 500000  # Example threshold for population

# Function to fetch major cities from an API
def fetch_major_cities(threshold):
    response = requests.get(MAJOR_CITIES_API_URL)
    cities = response.json()["_links"]["ua:item"]
    city_names = []
    for city in cities:
        city_name = city["name"]
        city_url = city["href"]
        city_info = requests.get(city_url + "details/").json()
        for category in city_info["categories"]:
            if category["id"] == "population":
                population = category["data"][0]["float_value"]
                if population and population >= threshold:
                    city_names.append(city_name)
                break
    return city_names

# Input validation functions
def is_valid_email(email):
    regex = r'^\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
    return re.match(regex, email) is not None

def is_valid_phone(phone):
    regex = r'^\+?1?\d{9,15}$'
    return re.match(regex, phone) is not None

# Streamlit application
st.title("Post-Graduation Location Survey")

# Input fields
name = st.text_input("Name")
personal_email = st.text_input("Personal Email")
university_email = st.text_input("University Email")
phone_number = st.text_input("Phone Number")

# Validate inputs
if personal_email and not is_valid_email(personal_email):
    st.error("Invalid personal email format")
if university_email and not is_valid_email(university_email):
    st.error("Invalid university email format")
if phone_number and not is_valid_phone(phone_number):
    st.error("Invalid phone number format")

# Country selection
countries = [country.name for country in pycountry.countries]
selected_country = st.selectbox("Select your country:", countries)

# Fetch major cities based on population threshold
threshold = st.number_input("Set population threshold for major cities:", value=POPULATION_THRESHOLD)
if st.button("Fetch Cities"):
    cities = fetch_major_cities(threshold)
    if cities:
        selected_city = st.selectbox("Where will you be after graduation?", cities)
    else:
        st.warning("No cities found with the specified population threshold.")

# Submit button
if st.button("Submit"):
    if not name or not personal_email or not university_email or not phone_number:
        st.error("Please fill in all the fields")
    elif not is_valid_email(personal_email) or not is_valid_email(university_email) or not is_valid_phone(phone_number):
        st.error("Please correct the invalid fields")
    else:
        # Data storage options (example with Streamlit's session state)
        if 'responses' not in st.session_state:
            st.session_state['responses'] = []
        st.session_state['responses'].append({
            "name": name,
            "personal_email": personal_email,
            "university_email": university_email,
            "phone_number": phone_number,
            "country": selected_country,
            "city": selected_city
        })
        st.success("Response submitted successfully!")

# Display responses (for demonstration purposes)
if 'responses' in st.session_state:
    st.write("Submitted Responses:")
    for response in st.session_state['responses']:
        st.write(response)
