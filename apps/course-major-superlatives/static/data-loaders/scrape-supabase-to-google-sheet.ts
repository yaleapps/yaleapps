const SUPABASE_URL = "https://your_supabase_url_here";
const SUPABASE_ANON_KEY = "your_supabase_anon_key_here";
const TABLE = "your_table_name_here"

const SELECTED_HEADERS = [
  // Add all the headers you want to select from the table here
];

const HEADER_ROW = 1;
const DATA_START_ROW = HEADER_ROW + 1;

function mainFunction() {
  clearEntireSpreadsheet();
  writeHeadersOnRow(HEADER_ROW);
  fetchDataAndWriteToSheet();
}

function fetchDataAndWriteToSheet() {
  // If you want to select all columns, you can remove ?select=${SELECTED_HEADERS.join(',')}
  const url = `${SUPABASE_URL}/rest/v1/${TABLE}?select=${SELECTED_HEADERS.join(',')}`;
  const options = {
    headers: {
      Apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      'Content-Type': 'application/json'
    },
    method: 'get',
  }
  const response = UrlFetchApp.fetch(url, options);
  const jsonData = JSON.parse(response.getContentText());
  writeToSheet(jsonData);
}

function writeToSheet(data) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

  const rows = data.map((row) => {
    return SELECTED_HEADERS.map((column) =>
      row.hasOwnProperty(column) ? row[column] : ''
    );
  });

  const dataRange = sheet.getRange(DATA_START_ROW, 1, rows.length, rows[0].length);
  dataRange.setValues(rows);
}

function clearEntireSpreadsheet() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  sheet.clear();
}

function writeHeadersOnRow(rowNumber) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  sheet.getRange(rowNumber, 1, 1, SELECTED_HEADERS.length).setValues([SELECTED_HEADERS]);
}

