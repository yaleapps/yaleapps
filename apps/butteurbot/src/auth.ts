import type { GoogleKey } from "cloudflare-workers-and-google-oauth";
import GoogleAuth from "cloudflare-workers-and-google-oauth";

export class GoogleAuthWrapper {
	private auth: GoogleAuth;

	constructor(credentials: {
		email: string;
		key: string;
		scopes: string[];
	}) {
		const googleKey: GoogleKey = {
			type: "service_account",
			project_id: "butteurbot",
			private_key_id: "",
			client_id: "",
			client_email: credentials.email,
			private_key: credentials.key,
			token_uri: "https://oauth2.googleapis.com/token",
			auth_uri: "https://accounts.google.com/o/oauth2/auth",
			auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
			client_x509_cert_url: `https://www.googleapis.com/robot/v1/metadata/x509/${encodeURIComponent(credentials.email)}`,
		};
		this.auth = new GoogleAuth(googleKey, credentials.scopes);
	}

	async getAccessToken(): Promise<string> {
		const token = await this.auth.getGoogleAuthToken();
		if (!token) throw new Error("Failed to get Google auth token");
		return token;
	}
}
