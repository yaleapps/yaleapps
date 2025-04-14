const SUPABASE_URL = 'https://your_supabase_url_here';
const SUPABASE_ANON_KEY = 'your_supabase_anon_key_here';
const TABLE = 'your_table_name_here';
const SHEET = 'your_sheet_name_here';

const HEADER_ROW = 1;
const DATA_START_ROW = HEADER_ROW + 1;

/**
 * Processes an array of row values from Supabase to ensure they're properly serialized for Google Sheets.
 *
 * You can customize this function to handle different data types as needed.
 *
 * @param {Array<any>} rowValues - Array of values from a Supabase row that need to be written to Google Sheets
 * @returns {Array<string>} An array of serialized values safe for Google Sheets insertion
 *
 * @remarks
 * - Handles complex data types (objects, arrays) by converting them to JSON strings
 * - Ensures data consistency when writing to Google Sheets
 * - Used by writeToSheet() to process each row before insertion
 *
 * @example
 * const row = ['text', { complex: 'object' }, ['array'], null];
 * const processed = processRowValues(row);
 * // Returns: ['text', '{"complex":"object"}', '["array"]', '']
 */
function processRowValues(rowValues) {
  return rowValues.map((value) => {
    if (value === null || value === undefined) {
      return '';
    }
    if (value instanceof Date) {
      return value.toISOString();
    }
    if (typeof value === 'object') {
      return JSON.stringify(value);
    }
    return String(value);
  });
}

/**
 * Main execution function that orchestrates the data synchronization process.
 * Clears the spreadsheet and then fetches and writes new data.
 *
 * @returns {void}
 */
function mainFunction() {
  clearEntireSpreadsheet();
  fetchDataAndWriteToSheet();
}

/**
 * Clears all content from the specified Google Sheet.
 * This includes all data, formatting, and formulas.
 *
 * @returns {void}
 * @throws {Error} If the sheet is not found or if the clear operation fails
 */
function clearEntireSpreadsheet() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET);
  sheet.clear();
}

/**
 * Fetches data from Supabase and writes it to the Google Sheet.
 * Uses the Supabase REST API to retrieve data and processes it for sheet insertion.
 *
 * @returns {void}
 * @throws {Error} If the Supabase API request fails or if data processing encounters an error
 */
function fetchDataAndWriteToSheet() {
  const url = `${SUPABASE_URL}/rest/v1/${TABLE}`;
  const options = {
    headers: {
      Apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      'Content-Type': 'application/json',
    },
  };
  const response = UrlFetchApp.fetch(url, options);
  const jsonData = JSON.parse(response.getContentText());
  writeToSheet(jsonData);
}

/**
 * Writes the provided data to the specified Google Sheet.
 * Handles both the header row and data rows, processing values for proper sheet insertion.
 *
 * @param {Array<Record<string, any>>} data - Array of objects containing the data to be written to the sheet
 * @returns {void}
 * @throws {Error} If the sheet is not found or if writing operations fail
 */
function writeToSheet(data) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET);

  const cols = Object.keys(data[0]);
  const rows = data.map((row) => Object.values(row));

  sheet.getRange(HEADER_ROW, 1, 1, cols.length).setValues([cols]);
  sheet.getRange(DATA_START_ROW, 1, rows.length, cols.length).setValues(rows.map(processRowValues));
}
