import { Hono } from 'hono';
import { google } from 'googleapis';

const auth = new google.auth.JWT({
	email: process.env.BUTTEURBOT_GOOGLE_SERVICE_ACCOUNT_EMAIL,
	key: process.env.BUTTEURBOT_GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY,
	scopes: ['https://www.googleapis.com/auth/calendar'],
});

const calendar = google.calendar({ version: 'v3', auth });

const app = new Hono();

const commands = {
	'!open': () => 'Hello there!',
	'!closed': () => 'Hello there!',
};

app.get('/gh/managers', (c) => {
	return c.text('Hello Hono!');
});

export default app;
