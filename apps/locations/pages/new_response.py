from pydantic import ValidationError
import streamlit as st
from helpers.cities_loader import CitiesLoader
from helpers.st_print_validation_error import st_print_validation_error
from helpers.google_sheet_manager import GoogleSheetManager, Response

st.set_page_config(layout="wide")

MIN_POPULATION = 15_000

# Streamlit application
st.title("Post-Graduation Location Survey")

# Explanation at the top
st.markdown(
    "Hey there, Class of 2024! 🎓 Please provide your name, contact information, and where you'll be after graduation. Your participation is completely optional but greatly appreciated."
)

# Load cities and create a city dropdown
cities_formatted_list = CitiesLoader().load_cities_formatted_list()
if not cities_formatted_list:
    st.error("Failed to load cities. Please try again later.")
    st.stop()
# Show only the top n cities
cities = cities_formatted_list[:MIN_POPULATION]

# Create a form
with st.form("post_grad_form"):
    name = st.text_input("Name", placeholder="First Last")
    net_id = st.text_input("NetID", placeholder="abc12").lower()
    personal_email = st.text_input(
        "Personal Email (This email will be used to keep in touch after graduation)",
        placeholder="example@gmail.com",
    )
    phone_number = st.text_input(
        "Phone Number",
        placeholder="1234567890 if US, +441234567890 if international, no spaces or other characters...",
        help="**Phone Number Format Instructions:**\n\n- **US Numbers**: Enter exactly 10 digits (e.g., 1234567890).\n- **International Numbers**: Start with a plus (+) followed by the country code and the rest of your number (e.g., +441234567890).\n\n**No spaces or other characters.**",
    )
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
            locations_sheet = GoogleSheetManager(sheet_name="Locations")
            locations_sheet.append_response(form_data)
            st.success("Response submitted successfully!")
            st.stop()
        except ValidationError as e:
            st_print_validation_error(e)
        except Exception as e:
            st.error("An error occurred while submitting the form. Please try again.")
            st.exception(e)  # This will log the full exception traceback
