import pandas as pd
import gspread
import streamlit as st
from oauth2client.service_account import ServiceAccountCredentials

# Set up the credentials and authorize access to the Google Sheets API
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

# Open the Google Sheet by key and get the data from the first sheet
sh = client.open_by_key(key=st.secrets["spreadsheet"]["spreadsheet_id"]).worksheet(
    "Locations"
)
data = sh.get_all_records()

# Convert the data to a pandas DataFrame
df = pd.DataFrame(data)

st.text("Original DataFrame:")
st.write(df)

st.text("All rows where 'NetID' column has duplicate values:")
duplicates = df[df.duplicated(subset="NetID", keep=False)]
st.write(duplicates)

st.text("All rows where 'NetID' column has duplicate values and other columns differ:")
# Filter duplicates where at least one other column is different
# Group by 'NetID' and filter groups where not all rows are identical
different_columns = duplicates.groupby("NetID").filter(
    lambda x: not x.drop(columns="NetID").apply(lambda y: y.nunique() == 1).all()
)
st.write(different_columns)
