import { createAuthClient } from "better-auth/react";
import { yaleCasClient } from "@yaleapps/better-auth-yale-cas";
import { anonymousClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
	baseURL: "http://localhost:4343",
	plugins: [yaleCasClient(), anonymousClient()],
	advanced: {
		crossSubDomainCookies: {
			enabled: true,
			// domain: ".yaleapps.com",
		},
	},
});
