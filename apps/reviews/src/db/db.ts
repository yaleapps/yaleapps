import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import * as schema from './schema';

export const client = createClient({
	// url: TURSO_SYNC_URL as string,
	// authToken: TURSO_READONLY_TOKEN as string,
	url: 'http://127.0.0.1:8080',
	// url: 'file:./courses.sqlite',
});

export const db = drizzle(client, { logger: true, schema });
