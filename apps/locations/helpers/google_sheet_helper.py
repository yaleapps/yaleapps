import gspread
from oauth2client.service_account import ServiceAccountCredentials
import streamlit as st


def init_google_worksheet(sheet_name: str):
    scope = [
        "https://spreadsheets.google.com/feeds",
        "https://www.googleapis.com/auth/drive",
    ]
    creds = ServiceAccountCredentials.from_json_keyfile_dict(
        {
            "type": "service_account",
            "project_id": st.secrets["gcp_service_account"]["project_id"],
            "private_key_id": st.secrets["gcp_service_account"]["private_key_id"],
            "private_key": st.secrets["gcp_service_account"]["private_key"],
            "client_email": st.secrets["gcp_service_account"]["client_email"],
            "client_id": st.secrets["gcp_service_account"]["client_id"],
            "auth_uri": st.secrets["gcp_service_account"]["auth_uri"],
            "token_uri": st.secrets["gcp_service_account"]["token_uri"],
            "auth_provider_x509_cert_url": st.secrets["gcp_service_account"][
                "auth_provider_x509_cert_url"
            ],
            "client_x509_cert_url": st.secrets["gcp_service_account"][
                "client_x509_cert_url"
            ],
        },
        scope,
    )
    client = gspread.authorize(creds)
    sheet = client.open_by_key(
        key=st.secrets["spreadsheet"]["spreadsheet_id"]
    ).worksheet(sheet_name)
    return sheet
