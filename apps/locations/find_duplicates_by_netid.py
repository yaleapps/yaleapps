import pandas as pd
import streamlit as st
from oauth2client.service_account import ServiceAccountCredentials
from helpers.google_sheet_helper import GoogleSheetManager


# Open the Google Sheet by key and get the data from the first sheet
locations_sheet = GoogleSheetManager(sheet_name="Locations")
data = locations_sheet.get_all_records()

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
