import { createClient, fetchExchange } from "@urql/core";
import { authExchange } from "@urql/exchange-auth";
import type { Operation, CombinedError } from "@urql/core";

export const client = createClient({
	url: "https://api.coursetable.com/ferry/v1/graphql",
	exchanges: [
		authExchange(async (utils) => {
			return {
				addAuthToOperation: (operation: Operation) => {
					return utils.appendHeaders(operation, {
						Cookie: process.env.COURSETABLE_COOKIE ?? "",
					});
				},
				didAuthError: (error: CombinedError) => false,
				refreshAuth: async () => {},
			};
		}),
		fetchExchange,
	],
});
