import type { VercelRequest, VercelResponse } from '@vercel/node';
import { z } from 'zod';
import { GoogleSpreadsheet, GoogleSpreadsheetRow } from 'google-spreadsheet';
import { allowCors } from './allowCors';

// Zod Types
const idSchema = z.enum([
  'Benjamin Franklin',
  'Berkeley',
  'Branford',
  'Davenport',
  'Ezra Stiles',
  'Grace Hopper',
  'Jonathan Edwards',
  'Morse',
  'Pauli Murray',
  'Pierson',
  'Saybrook',
  'Silliman',
  'Timothy Dwight',
  'Trumbull',
  'The Acorn',
  'The Beanjamin',
]);
const valueSchema = z.enum(['OPEN', 'CLOSED'], {
  description: 'Value must be either "OPEN" or "CLOSED"',
});

async function handler(request: VercelRequest, response: VercelResponse) {
  try {
    const { id, value } = request.query;
    const calendarId = idSchema.parse(id);
    const verifiedValue = valueSchema.parse(value);
    await setButteryVerified(calendarId, verifiedValue);
    return response.status(200).end(`Successfully set ${id} to ${value}`);
  } catch (error) {
    return response.status(400).end(error.message);
  }
}

// In the row where the "id" column matches "id", set the "verified" column to "OPEN"
async function setButteryVerified(
  id: string,
  verifiedValue: 'OPEN' | 'CLOSED'
) {
  const { CLIENT_EMAIL, PRIVATE_KEY } = process.env;
  // Initialize the sheet - doc ID is the long id in the sheets URL
  const doc = new GoogleSpreadsheet(
    '1NZyxbnUMkChmZC3umrW8vJdyus6PdPyRq8GbDLZiglU'
  );
  // Initialize Auth - see https://theoephraim.github.io/node-google-spreadsheet/#/getting-started/authentication
  await doc.useServiceAccountAuth({
    client_email: CLIENT_EMAIL as string,
    private_key: PRIVATE_KEY as string,
  });

  await doc.loadInfo(); // loads document properties and worksheets
  const sheet = doc.sheetsByIndex[0]; // or use doc.sheetsById[id]
  const rows = await sheet.getRows(); // can pass in { limit, offset }
  const row = rows.find((row) => row.id === id) as GoogleSpreadsheetRow;
  row.verified = verifiedValue;
  await row.save();
  return true;
}

module.exports = allowCors(handler);
