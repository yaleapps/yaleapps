import { createAuthClient } from "better-auth/react";
import { yaleCasClient } from "@repo/better-auth-yale-cas";

export const authClient = createAuthClient({
	baseURL: "http://localhost:4343",
	plugins: [yaleCasClient()],
	advanced: {
		crossSubDomainCookies: {
			enabled: true,
			// domain: ".yaleapps.com",
		},
	},
});
