import streamlit as st
from helpers.google_sheet_helper import init_google_worksheet

st.set_page_config(layout="wide")
import requests
import re
from validate_email import validate_email
from oauth2client.service_account import ServiceAccountCredentials

MIN_POPULATION = 15_000


# Load cities from github repository
def load_all_cities():
    url = "https://raw.githubusercontent.com/yaleapps/yaleapps/main/apps/locations/assets/sorted_cities.json"
    response = requests.get(url)
    if response.status_code == 200:
        return response.json()
    else:
        print(f"Failed to retrieve data: {response.status_code}")


def is_valid_netid(netid):
    netid_regex = r"^[a-zA-Z-]{2,3}\d+$"
    return re.match(netid_regex, netid)


# Streamlit application
st.title("Post-Graduation Location Survey")

# Explanation at the top
st.markdown(
    "Hey there, Class of 2024! 🎓 Please provide your name, contact information, and where you'll be after graduation. Your participation is completely optional but greatly appreciated."
)

# Load cities and create a city dropdown
all_cities = load_all_cities()
# Show only the top n cities
cities = all_cities[:MIN_POPULATION]

# Create a form
with st.form("post_grad_form"):
    name = st.text_input("Name", placeholder="First Last")
    netid = st.text_input("NetID", placeholder="abc12").lower()
    personal_email = st.text_input(
        "Personal Email (This email will be used to keep in touch after graduation)",
        placeholder="example@gmail.com",
    )
    phone_number = st.text_input("Phone Number", placeholder="+1234567890")

    selected_first_city = st.multiselect(
        "Which city will you be in right after graduation?",
        placeholder="Right after graduation, I'll be in...",
        options=cities,
    )

    selected_future_cities = st.multiselect(
        "Which cities will you most likely be living in the next 5 years?",
        placeholder="In the next 5 years, I'll most likely be living in...",
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
            sh = init_google_worksheet(sheet_name="Locations")
            row = [
                name,
                netid,
                personal_email,
                phone_number,
                "\n".join(selected_first_city),
                "\n".join(selected_future_cities),
                visibility,
            ]
            sh.append_row(row)

            st.success("Response submitted successfully!")
            st.stop()
