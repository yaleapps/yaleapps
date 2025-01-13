import { Hono } from 'hono';
import { google } from 'googleapis';

const auth = new google.auth.JWT({
	email: process.env.BUTTEURBOT_GOOGLE_SERVICE_ACCOUNT_EMAIL,
	key: process.env.BUTTEURBOT_GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY,
	scopes: ['https://www.googleapis.com/auth/calendar'],
});

const calendar = google.calendar({ version: 'v3', auth });

const app = new Hono();

async function getNextEvent(calendarId: string) {
  const now = new Date();
  
  try {
    const response = await calendar.events.list({
      calendarId,
      timeMin: now.toISOString(),
      maxResults: 1,
      singleEvents: true,
      orderBy: 'startTime',
    });

    return response.data.items?.[0] || null;
  } catch (error) {
    console.error('Error fetching next event:', error);
    return null;
  }
}

async function updateEventDescription(calendarId: string, eventId: string, description: string) {
  try {
    const event = await calendar.events.get({
      calendarId,
      eventId,
    });

    if (!event.data) {
      throw new Error('Event not found');
    }

    const updatedEvent = {
      ...event.data,
      description,
    };

    await calendar.events.update({
      calendarId,
      eventId,
      requestBody: updatedEvent,
    });

    return true;
  } catch (error) {
    console.error('Error updating event description:', error);
    return false;
  }
}

const commands = {
  '!open': async (calendarId: string) => {
    const nextEvent = await getNextEvent(calendarId);
    if (!nextEvent) {
      return 'No upcoming events found';
    }

    const success = await updateEventDescription(calendarId, nextEvent.id!, 'OPEN');
    if (success) {
      return `Updated event "${nextEvent.summary}" status to OPEN`;
    }
    return 'Failed to update event status';
  },
  '!closed': async (calendarId: string) => {
    const nextEvent = await getNextEvent(calendarId);
    if (!nextEvent) {
      return 'No upcoming events found';
    }

    const success = await updateEventDescription(calendarId, nextEvent.id!, 'CLOSED');
    if (success) {
      return `Updated event "${nextEvent.summary}" status to CLOSED`;
    }
    return 'Failed to update event status';
  },
};

app.get('/gh/managers', (c) => {
	return c.text('Hello Hono!');
});

export default app;
