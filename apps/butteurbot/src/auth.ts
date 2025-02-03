import type { calendar_v3 } from "@googleapis/calendar";

const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";
const GOOGLE_AUTH_SCOPE = "https://www.googleapis.com/auth/calendar";
const TOKEN_LIFETIME_SECONDS = 3600;

interface ServiceAccountCredentials {
	email: string;
	key: string;
	scopes: string[];
}

interface JWTHeader {
	alg: "RS256";
	typ: "JWT";
}

interface JWTPayload {
	iss: string;
	scope: string;
	aud: string;
	exp: number;
	iat: number;
}

export class GoogleAuth {
	private credentials: ServiceAccountCredentials;
	private cachedToken: string | null = null;
	private tokenExpiry = 0;

	constructor(credentials: ServiceAccountCredentials) {
		this.credentials = credentials;
	}

	private async generateJWT(): Promise<string> {
		const now = Math.floor(Date.now() / 1000);
		const header: JWTHeader = {
			alg: "RS256",
			typ: "JWT",
		};
		const payload: JWTPayload = {
			iss: this.credentials.email,
			scope: GOOGLE_AUTH_SCOPE,
			aud: GOOGLE_TOKEN_URL,
			exp: now + TOKEN_LIFETIME_SECONDS,
			iat: now,
		};

		// Create base64-encoded header and payload
		const encodedHeader = btoa(JSON.stringify(header));
		const encodedPayload = btoa(JSON.stringify(payload));

		// Create the signing input
		const signingInput = `${encodedHeader}.${encodedPayload}`;

		// Import the private key
		const privateKey = await crypto.subtle.importKey(
			"pkcs8",
			this.pemToArrayBuffer(this.credentials.key),
			{
				name: "RSASSA-PKCS1-v1_5",
				hash: "SHA-256",
			},
			false,
			["sign"],
		);

		// Sign the input
		const signature = await crypto.subtle.sign(
			"RSASSA-PKCS1-v1_5",
			privateKey,
			new TextEncoder().encode(signingInput),
		);

		// Convert signature to base64
		const encodedSignature = btoa(
			String.fromCharCode(...new Uint8Array(signature)),
		);

		// Return the complete JWT
		return `${signingInput}.${encodedSignature}`;
	}

	private pemToArrayBuffer(pem: string): ArrayBuffer {
		// Remove header, footer, and any whitespace
		const base64 = pem
			.replace(/-----BEGIN PRIVATE KEY-----/, "")
			.replace(/-----END PRIVATE KEY-----/, "")
			.replace(/\s/g, "");

		// Decode base64 to array buffer
		const binary = atob(base64);
		const buffer = new ArrayBuffer(binary.length);
		const view = new Uint8Array(buffer);
		for (let i = 0; i < binary.length; i++) {
			view[i] = binary.charCodeAt(i);
		}
		return buffer;
	}

	async getAccessToken(): Promise<string> {
		// Check if we have a valid cached token
		const now = Date.now() / 1000;
		if (this.cachedToken && this.tokenExpiry > now + 300) {
			return this.cachedToken;
		}

		// Generate a new JWT
		const jwt = await this.generateJWT();

		// Exchange JWT for access token
		const response = await fetch(GOOGLE_TOKEN_URL, {
			method: "POST",
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
			},
			body: new URLSearchParams({
				grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
				assertion: jwt,
			}),
		});

		if (!response.ok) {
			throw new Error(`Failed to get access token: ${response.statusText}`);
		}

		const data = await response.json<{
			access_token: string;
			expires_in: number;
		}>();

		// Cache the token
		this.cachedToken = data.access_token;
		this.tokenExpiry = Date.now() / 1000 + data.expires_in;

		return data.access_token;
	}
}
