import 'dotenv/config';
import type { Config } from 'drizzle-kit';

export default {
	schema: './schema.ts',
	out: './drizzle',
	driver: 'turso',
	dbCredentials: {
		url: 'file:./courses.sqlite',
		// url: env.TURSO_SYNC_URL!,
		// authToken: env.TURSO_TOKEN!,
	},
} satisfies Config;
