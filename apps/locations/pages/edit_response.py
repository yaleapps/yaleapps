import streamlit as st
from helpers.google_sheet_helper import GoogleSheetManager, Response
import requests
import re
from validate_email import validate_email

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
if not all_cities:
    st.error("Failed to load cities. Please try again later.")
    st.stop()
# Show only the top n cities
cities = all_cities[:MIN_POPULATION]

worksheet = GoogleSheetManager(sheet_name="Locations")

st.session_state.setdefault('form_submitted', False)
st.session_state.setdefault('user_netid', '')

if st.session_state.get('form_submitted', False) or st.session_state.get('user_netid'):
    netid = st.session_state.get('user_netid', '')
    existing_response = worksheet.get_row_by_net_id(netid)
    if existing_response:
        return Response(**existing_response.model_dump())
else:
    response = Response()

with st.form("post_grad_form"):
    name = st.text_input("Name", value=response.Name, placeholder="First Last")
    netid = st.text_input("NetID", value=response.NetID, placeholder="abc12").lower()
    personal_email = st.text_input(
        "Personal Email (This email will be used to keep in touch after graduation)",
        value=response.Personal_Email,
        placeholder="example@gmail.com",
    )
    phone_number = st.text_input("Phone Number", value=response.Phone_Number, placeholder="+1234567890")

    selected_first_city = st.multiselect(
        "Which city will you be in right after graduation?",
        placeholder="Right after graduation, I'll be in...",
        options=cities,
        default=response.First_City,
    )

    selected_future_cities = st.multiselect(
        "Which cities will you most likely be living in the next 5 years?",
        placeholder="In the next 5 years, I'll most likely be living in...",
        options=cities,
        default=response.Future_Cities,
    )

    # Checkbox for visibility
    visibility = st.checkbox(
        "Include me in the Google Sheet!",
        value=response.Visibility,
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
            row_data = [
                name,
                netid,
                personal_email,
                phone_number,
                "\n".join(selected_first_city),
                "\n".join(selected_future_cities),
                visibility,
            ]
            if existing_response:
                worksheet.update_existing_response(netid, worksheet, row_data)
            else:
                worksheet.append_row(row_data)
            st.success("Response submitted successfully!")
            st.session_state.form_submitted = True
            st.session_state.user_netid = netid
            st.experimental_rerun()
else:
    st.title("Thank you for your submission!")
    st.markdown("Your response has been recorded. We appreciate your participation.")