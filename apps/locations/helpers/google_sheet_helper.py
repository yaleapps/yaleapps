import re
from typing import Any, Dict, List, Union
import gspread
from oauth2client.service_account import ServiceAccountCredentials
import streamlit as st
from pydantic import BaseModel, EmailStr, ValidationError, HttpUrl, validator
from helpers.st_print_validation_error import st_print_validation_error


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
    name: str
    net_id: str
    personal_email: EmailStr
    phone_number: str
    visibility: bool
    selected_first_cities: List[str]
    selected_future_cities: List[str]

    @validator("selected_first_cities", "selected_future_cities", pre=True)
    def split_cities(cls, value):
        if isinstance(value, str):
            return value.split("\n")
        return value

    @validator("phone_number")
    def validate_phone_number(cls, value):
        # Ensure the string contains only numbers or a plus (+) symbol, with no spaces or other characters
        if not re.match(r"^\+?\d+$", value):
            raise ValueError(
                "Invalid phone number format."
                "**US Numbers**: Enter exactly 10 digits (e.g., 1234567890).",
                "**International Numbers**: Start with a plus (+) followed by the country code and the rest of your number (e.g., +441234567890).",
                "No spaces or other characters are allowed.",
            )

        digits = re.sub(r"\D", "", value)
        if len(digits) == 10:
            # It's a US number
            return digits
        elif len(digits) > 10:
            if digits.startswith("1") and len(digits) == 11:
                # It's a US number with an extra leading '1'
                return digits[-10:]
            else:
                # It's an international number
                return "+" + digits
        else:
            raise ValueError(
                "Invalid phone number format."
                "**US Numbers**: Enter exactly 10 digits (e.g., 1234567890).",
                "**International Numbers**: Start with a plus (+) followed by the country code and the rest of your number (e.g., +441234567890).",
                "No spaces or other characters are allowed.",
            )

    @validator("phone_number", pre=True)
    def coerce_phone_number(cls, value: Union[str, int]) -> str:
        return str(value)

    @validator("visibility", pre=True)
    def coerce_visibility(cls, value: Union[str, bool]) -> bool:
        return value if isinstance(value, bool) else value.lower() == "true"

    @validator("net_id")
    def validate_net_id(cls, value):
        netid_regex = r"^[a-zA-Z-]{2,3}\d+$"
        is_valid_net_id = re.match(netid_regex, value)
        if not is_valid_net_id:
            raise ValueError("Invalid net ID format")
        return value


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


class GoogleSheetManagerError(Exception):
    pass


class GoogleSheetManager:
    def __init__(self, sheet_name: str):
        try:
            secrets = Secrets(**st.secrets)
        except ValidationError as e:
            st_print_validation_error(e)
            return None

        scope = [
            "https://spreadsheets.google.com/feeds",
            "https://www.googleapis.com/auth/drive",
        ]

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

        try:
            client = gspread.authorize(creds)
            sheet = client.open_by_key(secrets.spreadsheet.spreadsheet_id).worksheet(
                sheet_name
            )
            self.sheet = sheet
        except gspread.exceptions.GSpreadException as e:
            raise GoogleSheetManagerError(f"Error accessing the Google Sheet: {e}")

    def get_all_records(self) -> List[Response]:
        records = self.sheet.get_all_records()
        return [
            response
            for record in records
            if (response := validate_record(record)) is not None
        ]

    def append_response(self, response: Response) -> bool:
        row = [
            response.name,
            response.net_id,
            response.personal_email,
            response.phone_number,
            "\n".join(response.selected_first_cities),
            "\n".join(response.selected_future_cities),
            response.visibility,
        ]

        self.sheet.append_row(row)
        return True

    def get_row_by_net_id(self, net_id: str) -> Union[Response, None]:
        records = self.get_all_records()
        for record in records:
            if record.net_id == net_id:
                return record
        return None

    def is_email_phone_number_in_responses(self, email: str, phone_number: str) -> bool:
        records = self.get_all_records()
        return any(
            record.personal_email == email and record.phone_number == phone_number
            for record in records
        )

    # def update_response(self, email: str, phone_number: str, updated_data: Response) -> bool:
    #     records = self.get_all_records()
    #     matching_record = next((record for record in records
    #                             if record.personal_email == email
    #                             and record.phone_number == phone_number), None)

    #     if not matching_record:
    #         st.error(f"No record found with email {email} and phone number {phone_number}")
    #         return False

    #     # Find the row index of the matching record
    #     row_index = next(i for i, record in enumerate(records, start=2)
    #                     if record.personal_email == email
    #                     and record.phone_number == phone_number)

    #     print(row_index)

    # # Prepare the updated row
    # updated_row = [
    #     updated_record.name,
    #     updated_record.net_id,
    #     updated_record.personal_email,
    #     updated_record.phone_number,
    #     "\n".join(updated_record.selected_first_cities),
    #     "\n".join(updated_record.selected_future_cities),
    #     updated_record.visibility,
    # ]

    # Update the row in the Google Sheet
    # try:
    #     self.sheet.update(f'A{row_index}:G{row_index}', [updated_row])
    #     return True
    # except gspread.exceptions.GSpreadException as e:
    #     st.error(f"Error updating the Google Sheet: {e}")
    #     return False
