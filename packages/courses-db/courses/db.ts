import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import { env } from '@repo/env';
import * as schema from './schema';

const client = createClient({
	// url: TURSO_SYNC_URL as string,
	// authToken: TURSO_READONLY_TOKEN as string,
	url: env.TURSO_URL,
});

export const db = drizzle(client, { logger: true, schema });
