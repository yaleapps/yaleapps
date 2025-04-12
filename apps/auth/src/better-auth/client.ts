import { createAuthClient } from "better-auth/react";
import { yaleCasClient } from "@yaleapps/better-auth-yale-cas";
import { anonymousClient } from "better-auth/client/plugins";
import { DOMAINS } from "@repo/constants/urls";

export const authClient = createAuthClient({
	baseURL: DOMAINS.AUTH,
	plugins: [yaleCasClient(), anonymousClient()],
	advanced: {
		crossSubDomainCookies: {
			enabled: true,
			// domain: ".yaleapps.com",
		},
	},
});
