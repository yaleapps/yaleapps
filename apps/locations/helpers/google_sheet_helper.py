import gspread
from oauth2client.service_account import ServiceAccountCredentials
import streamlit as st
from pydantic import BaseModel, ValidationError, HttpUrl


# Define Pydantic models for validation
class GCPServiceAccount(BaseModel):
    type: str
    project_id: str
    private_key_id: str
    private_key: str
    client_email: str
    client_id: str
    auth_uri: HttpUrl
    token_uri: HttpUrl
    auth_provider_x509_cert_url: HttpUrl
    client_x509_cert_url: HttpUrl


class SpreadsheetConfig(BaseModel):
    spreadsheet_id: str


class Secrets(BaseModel):
    gcp_service_account: GCPServiceAccount
    spreadsheet: SpreadsheetConfig


def init_google_worksheet(sheet_name: str) -> gspread.Worksheet | None:
    # Load and validate secrets
    try:
        secrets = Secrets(**st.secrets)
    except ValidationError as e:
        st.error(f"Secrets validation error: {e}")
        return None

    # Define the required scope
    scope = [
        "https://spreadsheets.google.com/feeds",
        "https://www.googleapis.com/auth/drive",
    ]

    # Extracting GCP service account details
    gcp_service_account = secrets.gcp_service_account

    creds = ServiceAccountCredentials.from_json_keyfile_dict(
        {
            "type": gcp_service_account.type,
            "project_id": gcp_service_account.project_id,
            "private_key_id": gcp_service_account.private_key_id,
            "private_key": gcp_service_account.private_key,
            "client_email": gcp_service_account.client_email,
            "client_id": gcp_service_account.client_id,
            "auth_uri": gcp_service_account.auth_uri,
            "token_uri": gcp_service_account.token_uri,
            "auth_provider_x509_cert_url": gcp_service_account.auth_provider_x509_cert_url,
            "client_x509_cert_url": gcp_service_account.client_x509_cert_url,
        },
        scope,
    )

    # Authorize and get the worksheet
    client = gspread.authorize(creds)

    sheet = client.open_by_key(key=secrets.spreadsheet.spreadsheet_id).worksheet(
        sheet_name
    )
    return sheet
