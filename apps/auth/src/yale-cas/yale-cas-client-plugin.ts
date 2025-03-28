import type { BetterAuthClientPlugin } from "better-auth/client";
import type { yaleCas } from "./yale-cas-plugin";

export const yaleCasClient = (options?: undefined) => {
	return {
		id: "yale-cas",
		$InferServerPlugin: {} as ReturnType<typeof yaleCas>,
		pathMethods: {
			"/sign-in/yale-cas": "POST",
		},
	} satisfies BetterAuthClientPlugin;
};
