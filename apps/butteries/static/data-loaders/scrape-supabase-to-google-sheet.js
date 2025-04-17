const SUPABASE_URL = 'https://your_supabase_url_here';
const SUPABASE_ANON_KEY = 'your_supabase_anon_key_here';
const SUPABASE_TABLE_NAME = 'your_supabase_table_name_here';
const GOOGLE_SHEET_NAME = 'your_google_sheet_name_here';

const HEADER_ROW_INDEX = 1;
const DATA_START_ROW_INDEX = HEADER_ROW_INDEX + 1;

/**
 * Processes a row from Supabase to ensure it's properly serialized for Google Sheets.
 *
 * You can customize this function to handle different data types as needed.
 *
 * @param {Record<string, any>} row - Object where the keys are the column names and the values are the column values from a Supabase row that need to be written to Google Sheets
 * @returns {Array<string>} An array of serialized values safe for Google Sheets insertion
 *
 * @remarks
 * - Handles complex data types (objects, arrays) by converting them to JSON strings
 * - Ensures data consistency when writing to Google Sheets
 * - Used by writeToSheet() to process each row before insertion
 *
 * @example
 * const row = { text: 'text', complex: { complex: 'object' }, array: ['array'], null: null };
 * const processed = processRow(row);
 * // Returns: ['text', '{"complex":"object"}', '["array"]', '']
 */
function processRow(row) {
  return Object.entries(row).map(([key, value]) => {
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
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(GOOGLE_SHEET_NAME);
  sheet.clear();
  const data = fetchDataFromSupabase(SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_TABLE_NAME);
  writeDataToSheet(data, GOOGLE_SHEET_NAME);
}

/**
 * Fetches data from Supabase and returns it as an array of objects.
 * Uses the Supabase REST API to retrieve data and processes it for sheet insertion.
 *
 * @param {string} supabaseUrl - The URL of the Supabase instance
 * @param {string} supabaseAnonKey - The anonymous key for the Supabase instance
 * @param {string} supabaseTableName - The name of the table to fetch data from
 *
 * @returns {Array<Record<string, any>>} An array of objects containing the data from Supabase
 * @throws {Error} If the Supabase API request fails or if data processing encounters an error
 */
function fetchDataFromSupabase(supabaseUrl, supabaseAnonKey, supabaseTableName) {
  const response = UrlFetchApp.fetch(`${supabaseUrl}/rest/v1/${supabaseTableName}`, {
    headers: {
      Apikey: supabaseAnonKey,
      Authorization: `Bearer ${supabaseAnonKey}`,
      'Content-Type': 'application/json',
    },
  });
  const jsonData = JSON.parse(response.getContentText());
  return jsonData;
}

/**
 * Writes the provided data to the specified Google Sheet.
 * Handles both the header row and data rows, processing values for proper sheet insertion.
 *
 * @param {Array<Record<string, any>>} data - Array of objects containing the data to be written to the sheet
 * @returns {void}
 * @throws {Error} If the sheet is not found or if writing operations fail
 */
function writeDataToSheet(data, sheetName) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);

  if (data.length === 0) return;
  const cols = Object.keys(data[0]);

  sheet.getRange(HEADER_ROW_INDEX, 1, 1, cols.length).setValues([cols]);
  sheet.getRange(DATA_START_ROW_INDEX, 1, data.length, cols.length).setValues(data.map(processRow));
}
