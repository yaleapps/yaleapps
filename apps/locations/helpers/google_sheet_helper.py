from typing import Any, Dict, List, Union
import gspread
from oauth2client.service_account import ServiceAccountCredentials
import streamlit as st
from pydantic import BaseModel, Field, ValidationError, HttpUrl, validator


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


class Response(BaseModel):
    Name: str
    NetID: str
    Personal_Email: str = Field(..., alias="Personal Email")
    Phone_Number: str = Field(..., alias="Phone Number")
    Visibility: bool
    First_City: List[str] = Field(..., alias="First City")
    Future_Cities: List[str] = Field(..., alias="Future Cities")

    @validator("First_City", "Future_Cities", pre=True)
    def split_cities(cls, value):
        if isinstance(value, str):
            return value.split("\n")
        return value

    @validator("Phone_Number", pre=True)
    def coerce_phone_number(cls, value: Union[str, int]) -> str:
        return str(value)

    @validator("Visibility", pre=True)
    def coerce_visibility(cls, value: str) -> bool:
        return value == "TRUE"


def validate_record(record: Dict[str, Any]) -> Union[Response, None]:
    if isinstance(record, dict):
        try:
            return Response(**record)
        except ValidationError as e:
            st.error(f"Validation error for record {record}: {e}")
            return None
    else:
        st.error(f"Record is not a dictionary: {record}")
        return None


class ResponsesWorksheet(gspread.Worksheet):
    def get_all_records(self, *args, **kwargs) -> List[Response]:
        records = super().get_all_records(*args, **kwargs)
        responses = [
            response
            for record in records
            if (response := validate_record(record)) is not None
        ]
        return responses


def init_google_worksheet(sheet_name: str) -> ResponsesWorksheet | None:
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
    custom_sheet = ResponsesWorksheet(sheet.spreadsheet, sheet._properties)
    return custom_sheet
