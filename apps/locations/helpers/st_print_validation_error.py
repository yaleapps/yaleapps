from pydantic import ValidationError
import streamlit as st


def st_print_validation_error(e: ValidationError):
    error_messages = []
    for error in e.errors():
        field = error["loc"][0]
        message = error["msg"]
        error_messages.append(f"{field}: {message}")

    error_string = "\n\n".join(error_messages)
    st.error(f"Please correct the following errors:\n\n{error_string}")
