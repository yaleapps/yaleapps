import type { BetterAuthClientPlugin } from "better-auth/client";
import type { yaleCas } from "./yale-cas";

export const yaleCasClient = () => {
	return {
		id: "yale-cas",
		$InferServerPlugin: {} as ReturnType<typeof yaleCas>,
		pathMethods: {
			"/sign-in/yale-cas": "POST",
		},
	} satisfies BetterAuthClientPlugin;
};
