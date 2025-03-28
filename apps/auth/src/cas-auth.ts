import type { Context } from "hono";
import { getCookie, setCookie } from "hono/cookie";
import { nanoid } from "nanoid";

const CAS_BASE_URL = "https://secure.its.yale.edu/cas";
const SESSION_COOKIE_NAME = "auth_session";

type User = { netId: string };

/**
 * Simple CAS authentication middleware for Hono
 */
export async function casAuth(c: Context) {
	const ticket = c.req.query("ticket");
	const service = getServiceUrl(c);

	// No ticket - redirect to CAS login
	if (!ticket) {
		const loginUrl = `${CAS_BASE_URL}/login?service=${encodeURIComponent(service)}`;
		return c.redirect(loginUrl);
	}

	try {
		// Validate the ticket with CAS server
		const response = await fetch(
			`${CAS_BASE_URL}/serviceValidate?ticket=${ticket}&service=${encodeURIComponent(service)}`,
		);

		const xml = await response.text();

		// Simple XML parsing - in production you might want a proper XML parser
		if (xml.includes("<cas:authenticationSuccess>")) {
			// Extract netId from XML response
			const netIdMatch = xml.match(/<cas:user>(.*?)<\/cas:user>/);

			if (netIdMatch?.[1]) {
				const netId = netIdMatch[1];
				const user = { netId } satisfies User;

				// Create a session
				const sessionId = nanoid();

				// In a real app, you would store this session in your database
				// await c.env.DB.prepare("INSERT INTO sessions (id, user_data) VALUES (?, ?)").bind(sessionId, JSON.stringify(user)).run();

				// Set session cookie
				setCookie(c, SESSION_COOKIE_NAME, sessionId, {
					httpOnly: true,
					secure: process.env.NODE_ENV === "production",
					sameSite: "Lax",
					path: "/",
					maxAge: 60 * 60 * 24 * 7, // 1 week
				});

				return c.json({ success: true, user });
			}
		}

		// Authentication failed
		return c.json({ success: false, error: "Authentication failed" }, 401);
	} catch (error) {
		console.error("CAS authentication error:", error);
		return c.json({ success: false, error: "Authentication error" }, 500);
	}
}

/**
 * Get the service URL for CAS callback
 */
function getServiceUrl(c: Context): string {
	// Check if we're in development mode
	const isDev = process.env.NODE_ENV !== "production";

	// For development, force localhost
	if (isDev) {
		const port = process.env.PORT ?? "8787"; // Default Hono/Cloudflare Workers port
		const url = new URL(`http://localhost:${port}${c.req.path}`);
		url.searchParams.delete("ticket");
		return url.toString();
	}

	// For production, use the headers
	const protocol = c.req.header("x-forwarded-proto") ?? "https";
	const host = c.req.header("x-forwarded-host") ?? c.req.header("host");
	if (!host) {
		throw new Error("No host found");
	}

	// Remove ticket parameter if present
	const url = new URL(`${protocol}://${host}${c.req.path}`);
	url.searchParams.delete("ticket");

	return url.toString();
}

/**
 * Middleware to check if user is authenticated
 */
export function requireAuth() {
	return async (c: Context, next: () => Promise<void>) => {
		const sessionId = getCookie(c, SESSION_COOKIE_NAME);

		if (!sessionId) {
			return c.json({ success: false, error: "Unauthorized" }, 401);
		}

		// In a real app, you would fetch the session from your database
		// const session = await c.env.DB.prepare("SELECT user_data FROM sessions WHERE id = ?").bind(sessionId).first();
		// if (!session) {
		//   return c.json({ success: false, error: "Invalid session" }, 401);
		// }

		// const user = JSON.parse(session.user_data);
		// c.set("user", user);

		await next();
	};
}
