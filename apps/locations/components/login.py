from typing import Callable
import streamlit as st
from pydantic import BaseModel, EmailStr, ValidationError, validator
import re
from helpers.st_print_validation_error import st_print_validation_error
from helpers.google_sheet_helper import GoogleSheetManager


class LoginCredentials(BaseModel):
    personal_email: EmailStr
    phone_number: str

    @validator("phone_number")
    def validate_phone_number(cls, value):
        if not re.match(r"^\+?\d+$", value):
            raise ValueError(
                """
Invalid phone number format.
**US Numbers**: Enter exactly 10 digits (e.g., 1234567890). 
**International Numbers**: Start with a plus (+) followed by the country code and the rest of your number (e.g., +441234567890). 
No spaces or other characters are allowed.
"""
            )

        digits = re.sub(r"\D", "", value)
        if len(digits) == 10:
            return digits
        elif len(digits) > 10:
            if digits.startswith("1") and len(digits) == 11:
                return digits[-10:]
            else:
                return "+" + digits
        else:
            raise ValueError(
                """
Invalid phone number format.
**US Numbers**: Enter exactly 10 digits (e.g., 1234567890). 
**International Numbers**: Start with a plus (+) followed by the country code and the rest of your number (e.g., +441234567890). 
No spaces or other characters are allowed.
"""
            )


def login_form(manager: GoogleSheetManager):
    st.title("Login")
    with st.form("login_form"):
        personal_email = st.text_input(
            "Personal Email (The email you used to fill out your response)",
            placeholder="example@gmail.com",
        )
        phone_number = st.text_input(
            "Phone Number",
            placeholder="1234567890 if US, +441234567890 if international, no spaces or other characters...",
            help="**Phone Number Format Instructions:**\n\n- **US Numbers**: Enter exactly 10 digits (e.g., 1234567890).\n- **International Numbers**: Start with a plus (+) followed by the country code and the rest of your number (e.g., +441234567890).\n\n**No spaces or other characters.**",
        )
        submitted = st.form_submit_button("Login")

        if submitted:
            try:
                credentials = LoginCredentials(
                    personal_email=personal_email, phone_number=phone_number
                )
                if manager.is_email_phone_number_in_responses(
                    credentials.personal_email, credentials.phone_number
                ):
                    st.session_state.authenticated = True
                    st.rerun()
                else:
                    st.error("Invalid email or phone number. Please try again.")
            except ValidationError as e:
                st_print_validation_error(e)


def wrap_with_login_form(main_content: Callable[[], None], manager: GoogleSheetManager):
    if "authenticated" not in st.session_state:
        st.session_state.authenticated = False

    if not st.session_state.authenticated:
        login_form(manager)
    else:
        main_content()
