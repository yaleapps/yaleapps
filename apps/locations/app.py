import streamlit as st
import pandas as pd
import re

# Load cities from 'worldcities.csv' CSV file, downloaded from https://simplemaps.com/data/world-cities
def load_cities():
    PRIORITY_CITIES = ["New York, New York, United States", "New Haven, Connecticut, United States", "Los Angeles, California, United States"]
    
    # Read the CSV file
    cities_df = pd.read_csv('worldcities.csv')
    # Format city names in the desired format
    cities_df['formatted_city'] = cities_df.apply(lambda row: f"{row['city']}, {row['admin_name']}, {row['country']}", axis=1)
    
    # Extract the priority cities DataFrame
    priority_df = cities_df[cities_df['formatted_city'].isin(PRIORITY_CITIES)]
    
    # Extract the other cities DataFrame and sort by population
    other_cities_df = cities_df[~cities_df['formatted_city'].isin(PRIORITY_CITIES)].sort_values(by='population', ascending=False)
    
    # Concatenate the priority cities with the other cities
    sorted_cities_df = pd.concat([priority_df, other_cities_df])
    
    # Extract the sorted city names into a list
    sorted_cities = sorted_cities_df['formatted_city'].tolist()
    
    return sorted_cities

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

# Load cities and create a city dropdown
cities = load_cities()
selected_city = st.selectbox("Where will you be after graduation?", cities)

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
            "city": selected_city
        })
        st.success("Response submitted successfully!")

# Display responses (for demonstration purposes)
if 'responses' in st.session_state:
    st.write("Submitted Responses:")
    for response in st.session_state['responses']:
        st.write(response)
