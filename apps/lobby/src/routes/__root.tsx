import {
	HeadContent,
	Outlet,
	Scripts,
	createRootRouteWithContext,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

import TanstackQueryLayout from "../integrations/tanstack-query/layout";

import appCss from "../styles.css?url";

import type { QueryClient } from "@tanstack/react-query";

import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import type { TRPCRouter } from "@repo/lobby-server/app";
import type { TRPCOptionsProxy } from "@trpc/tanstack-react-query";

import { ModeToggle } from "@/components/ui/mode-toggle";
interface MyRouterContext {
	queryClient: QueryClient;

	trpc: TRPCOptionsProxy<TRPCRouter>;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
	head: () => ({
		meta: [
			{
				charSet: "utf-8",
			},
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1",
			},
			{
				title: "🥘 Lobby | YaleApps",
			},
		],
		links: [
			{
				rel: "stylesheet",
				href: appCss,
			},
		],
	}),

	component: () => (
		<ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
			<Outlet />
			<TanStackRouterDevtools />
			<Toaster />
			<TanstackQueryLayout />
			<ModeToggle className="absolute top-2 right-2" />
		</ThemeProvider>
	),
});

function RootDocument({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<head>
				<HeadContent />
			</head>
			<body>
				{children}
				<Scripts />
			</body>
		</html>
	);
}
