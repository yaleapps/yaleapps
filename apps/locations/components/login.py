from typing import Callable
import streamlit as st
from helpers.google_sheet_helper import GoogleSheetManager, GoogleSheetManagerError


def login_form(manager: GoogleSheetManager):
    st.title("Login")
    with st.form("login_form"):
        email = st.text_input("Email")
        phone_number = st.text_input("Phone Number")
        submitted = st.form_submit_button("Login")

        if submitted:
            if manager.is_email_phone_number_in_responses(email, phone_number):
                st.session_state.authenticated = True
                st.rerun()
            else:
                st.error("Invalid email or phone number. Please try again.")


def wrap_with_login_form(main_content: Callable[[], None], manager: GoogleSheetManager):
    if "authenticated" not in st.session_state:
        st.session_state.authenticated = False

    if not st.session_state.authenticated:
        login_form(manager)
    else:
        main_content()
