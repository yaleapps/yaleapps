import pandas as pd
import re


def clean_phone_number(phone_number):
    # Remove all non-numeric characters
    digits = re.sub(r"\D", "", phone_number)

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
        # Invalid phone number
        return None


def standardize_phone_numbers(input_csv, output_csv):
    # Read the CSV file into a DataFrame
    df = pd.read_csv(input_csv)

    # Check if the phone number column exists
    if "phone_number" not in df.columns:
        raise ValueError("The input CSV file does not contain a 'phone_number' column")

    # Apply the transformation to the phone_number column
    df["phone_number"] = df["phone_number"].apply(clean_phone_number)

    # Write the transformed data to a new CSV file
    df.to_csv(output_csv, index=False)
    print(f"Transformed data has been written to {output_csv}")


input_csv = "input_phone_numbers.csv"
output_csv = "output_phone_numbers.csv"
standardize_phone_numbers(input_csv, output_csv)
