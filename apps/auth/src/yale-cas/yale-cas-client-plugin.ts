import type { BetterAuthClientPlugin } from "better-auth/client";
import type { anonymous } from "better-auth/plugins";

export const casClient = (options?: {
	casLoginPage?: string;
}) => {
	const casLoginPage = options?.casLoginPage || "/api/auth/cas/login";

	return {
		id: "cas",
		$InferServerPlugin: {} as ReturnType<typeof anonymous>,
	} satisfies BetterAuthClientPlugin;
};
