const SUPABASE_URL = "https://your_supabase_url_here";
const SUPABASE_ANON_KEY = "your_supabase_anon_key_here";
const TABLE = "your_table_name_here";
const SHEET = "your_sheet_name_here";

const HEADER_ROW = 1;
const DATA_START_ROW = HEADER_ROW + 1;

/**
 * Processes an array of row values from Supabase to ensure they're properly serialized for Google Sheets.
 *
 * You can customize this function to handle different data types as needed.
 *
 * @param rowValues - Array of values from a Supabase row that need to be written to Google Sheets
 * @returns An array of serialized values safe for Google Sheets insertion
 *
 * @remarks
 * - Handles complex data types (objects, arrays) by converting them to JSON strings
 * - Ensures data consistency when writing to Google Sheets
 * - Used by writeToSheet() to process each row before insertion
 *
 * @example
 * const row = ['text', { complex: 'object' }, ['array'], null];
 * const processed = processRowValues(row);
 * // Returns: ['text', '{"complex":"object"}', '["array"]', 'null']
 */
function processRowValues(rowValues) {
  return rowValues.map((value) => {
    if (value === null || value === undefined) {
      return "";
    }
    if (value instanceof Date) {
      return value.toISOString();
    }
    if (typeof value === "object") {
      return JSON.stringify(value);
    }
    return String(value);
  });
}

function mainFunction() {
  clearEntireSpreadsheet();
  fetchDataAndWriteToSheet();
}

function fetchDataAndWriteToSheet() {
  const url = `${SUPABASE_URL}/rest/v1/${TABLE}`;
  const options = {
    headers: {
      Apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      "Content-Type": "application/json",
    },
    method: "get",
  };
  const response = UrlFetchApp.fetch(url, options);
  const jsonData = JSON.parse(response.getContentText());
  writeToSheet(jsonData);
}

function writeToSheet(data) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET);

  const cols = Object.keys(data[0]);
  const rows = data.map((row) => Object.values(row));

  sheet.getRange(HEADER_ROW, 1, 1, cols.length).setValues([cols]);
  sheet
    .getRange(DATA_START_ROW, 1, rows.length, cols.length)
    .setValues(rows.map(processRowValues));
}

function clearEntireSpreadsheet() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET);
  sheet.clear();
}
