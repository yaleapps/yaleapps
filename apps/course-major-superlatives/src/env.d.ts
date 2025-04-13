declare namespace NodeJS {
	type ProcessEnv = {
		NODE_ENV: string;
		VUE_ROUTER_MODE: "hash" | "history" | "abstract" | undefined;
		VUE_ROUTER_BASE: string | undefined;
	};
}
