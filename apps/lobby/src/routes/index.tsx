import { authClient } from "@repo/auth/better-auth/client";
import { redirect } from "@tanstack/react-router";

import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
	component: RouteComponent,
	beforeLoad: async () => {
		throw redirect({ to: "/join" });
	},
});

function RouteComponent() {
	return <div>Hello "/"!</div>;
}
