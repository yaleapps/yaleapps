import re
import streamlit as st
import pandas as pd
from validate_email import validate_email
from streamlit_gsheets import GSheetsConnection
import gspread
from oauth2client.service_account import ServiceAccountCredentials


# Load cities from 'worldcities.csv' CSV file
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
        "Philadelphia, Pennsylvania, United States",
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


def is_valid_netid(netid):
    netid_regex = r"^[a-zA-Z-]{2,3}\d+$"
    return re.match(netid_regex, netid)


# Streamlit application
st.title("Post-Graduation Location Survey")

# Load cities and create a city dropdown
cities = load_cities()

# Create a form
with st.form("post_grad_form"):
    name = st.text_input("Name", placeholder="First Last")
    netid = st.text_input("NetID", placeholder="abc12").lower()
    personal_email = st.text_input(
        "Personal Email (This email will be used to keep in touch after graduation)",
        placeholder="example@gmail.com",
    )
    phone_number = st.text_input("Phone Number", placeholder="+1234567890")

    selected_first_city = st.selectbox(
        "Which city will you be in right after graduation?",
        placeholder="Right after graduation, I'll be in...",
        options=cities,
    )

    selected_future_cities = st.multiselect(
        "Which cities will you be in the next 5 years?",
        placeholder="In the next 5 years, I'll be in...",
        options=cities,
    )

    # Checkbox for visibility
    visibility = st.checkbox(
        "Include me in the Google Sheet!",
        value=True,
        help="If unchecked, your information will only be shared with people in your city and will not be included in the Google Sheet by others.",
    )

    # Every form must have a submit button.
    submitted = st.form_submit_button("Submit")

    if submitted:
        if (
            not name
            or not personal_email
            or not netid
            or not phone_number
            or not selected_first_city
            or not selected_future_cities
        ):
            st.error("Please fill in all the fields")
        elif not validate_email(personal_email) or not is_valid_netid(netid):
            st.error("Please correct the invalid fields")
        else:
            # Append to Google Sheet
            scope = [
                "https://spreadsheets.google.com/feeds",
                "https://www.googleapis.com/auth/drive",
            ]
            creds = ServiceAccountCredentials.from_json_keyfile_name(
                "yaleapps-569c08f4a07a.json", scope
            )
            client = gspread.authorize(creds)
            sh = client.open("Yalies by Cities 2024").worksheet("Locations")
            row = [
                name,
                netid,
                personal_email,
                phone_number,
                selected_first_city,
                "\n".join(selected_future_cities),
                visibility,
            ]
            sh.append_row(row)

            st.success("Response submitted successfully!")

# Display responses (for demonstration purposes)
if "responses" in st.session_state:
    st.write("Submitted Responses:")
    for response in st.session_state["responses"]:
        st.write(response)
