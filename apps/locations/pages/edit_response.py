from typing import Callable
from pydantic import ValidationError
import streamlit as st
from components.login import wrap_with_login_form
from helpers.cities_loader import CitiesLoader
from helpers.st_print_validation_error import st_print_validation_error
from helpers.google_sheet_helper import GoogleSheetManager, Response

st.set_page_config(layout="wide")

MIN_POPULATION = 15_000


def edit_response_page(user_response: Response):
    st.title("Edit Your Post-Graduation Location Survey Response")

    st.markdown(
        "Hey there, Class of 2024! 🎓 You can update your information below. Your participation is completely optional but greatly appreciated."
    )

    # Load cities and create a city dropdown
    cities_formatted_list = CitiesLoader().load_cities_formatted_list()
    if not cities_formatted_list:
        st.error("Failed to load cities. Please try again later.")
        st.stop()
    # Show only the top n cities
    cities = cities_formatted_list[:MIN_POPULATION]

    # Create a form
    with st.form("edit_post_grad_form"):
        name = st.text_input("Name", value=user_response.name)
        net_id = st.text_input("NetID", value=user_response.net_id, disabled=True)
        personal_email = st.text_input(
            "Personal Email",
            value=user_response.personal_email,
            help="This email will be used to keep in touch after graduation",
        )
        phone_number = st.text_input(
            "Phone Number",
            value=user_response.phone_number,
            help="**Phone Number Format Instructions:**\n\n- **US Numbers**: Enter exactly 10 digits (e.g., 1234567890).\n- **International Numbers**: Start with a plus (+) followed by the country code and the rest of your number (e.g., +441234567890).\n\n**No spaces or other characters.**",
        )
        selected_first_cities = st.multiselect(
            "Which city will you be in right after graduation?",
            options=cities,
            default=user_response.selected_first_cities,
        )
        selected_future_cities = st.multiselect(
            "Which cities will you most likely be living in the next 5 years?",
            options=cities,
            default=user_response.selected_future_cities,
        )
        visibility = st.checkbox(
            "Include me in the Google Sheet!",
            value=user_response.visibility,
            help="If unchecked, your information will only be shared with people in your city and will not be included in the Google Sheet by others.",
        )

        submitted = st.form_submit_button("Update Response")

        if submitted:
            try:
                updated_response = Response(
                    name=name,
                    net_id=net_id,
                    personal_email=personal_email,
                    phone_number=phone_number,
                    selected_first_cities=selected_first_cities,
                    selected_future_cities=selected_future_cities,
                    visibility=visibility,
                )
                locations_sheet = GoogleSheetManager(sheet_name="Locations")
                success = locations_sheet.update_response(
                    user_response.personal_email,
                    user_response.phone_number,
                    updated_response,
                )
                if success:
                    st.success("Response updated successfully!")
                    st.session_state.user_response = updated_response
                else:
                    st.error("Failed to update response. Please try again.")
            except ValidationError as e:
                st_print_validation_error(e)
            except Exception as e:
                st.error("An error occurred while updating the form. Please try again.")
                st.exception(e)  # This will log the full exception traceback


def main():
    locations_sheet = GoogleSheetManager(sheet_name="Locations")
    wrap_with_login_form(edit_response_page, locations_sheet)


if __name__ == "__main__":
    main()
