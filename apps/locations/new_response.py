import streamlit as st
from helpers.google_sheet_helper import GoogleSheetManager, Response
import requests
from oauth2client.service_account import ServiceAccountCredentials

st.set_page_config(layout="wide")

MIN_POPULATION = 15_000


# Load cities from github repository
def load_all_cities():
    url = "https://raw.githubusercontent.com/yaleapps/yaleapps/main/apps/locations/assets/sorted_cities.json"
    response = requests.get(url)
    if response.status_code == 200:
        return response.json()
    else:
        print(f"Failed to retrieve data: {response.status_code}")


# Streamlit application
st.title("Post-Graduation Location Survey")

# Explanation at the top
st.markdown(
    "Hey there, Class of 2024! 🎓 Please provide your name, contact information, and where you'll be after graduation. Your participation is completely optional but greatly appreciated."
)

# Load cities and create a city dropdown
all_cities = load_all_cities()
if not all_cities:
    st.error("Failed to load cities. Please try again later.")
    st.stop()
# Show only the top n cities
cities = all_cities[:MIN_POPULATION]

# Create a form
with st.form("post_grad_form"):
    name = st.text_input("Name", placeholder="First Last")
    net_id = st.text_input("NetID", placeholder="abc12").lower()
    personal_email = st.text_input(
        "Personal Email (This email will be used to keep in touch after graduation)",
        placeholder="example@gmail.com",
    )
    phone_number = st.text_input("Phone Number", placeholder="+1234567890")
    selected_first_cities = st.multiselect(
        "Which city will you be in right after graduation?",
        placeholder="Right after graduation, I'll be in...",
        options=cities,
    )
    selected_future_cities = st.multiselect(
        "Which cities will you most likely be living in the next 5 years?",
        placeholder="In the next 5 years, I'll most likely be living in...",
        options=cities,
    )
    visibility = st.checkbox(
        "Include me in the Google Sheet!",
        value=True,
        help="If unchecked, your information will only be shared with people in your city and will not be included in the Google Sheet by others.",
    )

    # Every form must have a submit button.
    submitted = st.form_submit_button("Submit")

    if submitted:
        try:
            form_data = Response(
                name=name,
                net_id=net_id,
                personal_email=personal_email,
                phone_number=phone_number,
                selected_first_cities=selected_first_cities,
                selected_future_cities=selected_future_cities,
                visibility=visibility,
            )
            sh = GoogleSheetManager(sheet_name="Locations")
            sh.append_response(form_data)
            st.success("Response submitted successfully!")
            st.stop()
        except ValueError as e:
            error_messages = []
            for error in e.errors():
                field = error["loc"][0]
                message = error["msg"]
                error_messages.append(f"{field}: {message}")

            error_string = "\n".join(error_messages)
            st.error(f"Please correct the following errors:\n\n{error_string}")
        except Exception as e:
            st.error("An error occurred while submitting the form. Please try again.")
            st.exception(e)  # This will log the full exception traceback
