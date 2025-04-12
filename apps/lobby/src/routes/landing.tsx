import { Button } from "@/components/ui/button";
import { authClient } from "@repo/auth/better-auth/client";
import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";

export const Route = createFileRoute("/landing")({
	component: LandingPage,
	loader: async ({ context: { trpc, queryClient } }) => {
		await queryClient.ensureQueryData(
			trpc.lobby.getLobbyParticipants.queryOptions(),
		);
		return;
	},
});

function LandingPage() {
	const { data: session, isPending, error } = authClient.useSession();

	const signUpViaCas = async () => {
		const { data, error } = await authClient.signIn.yaleCas(
			{
				callbackURL: "http://localhost:3000",
				errorCallbackURL: "http://localhost:3000",
				newUserCallbackURL: "http://localhost:3000",
			},
			{
				onRequest: (ctx) => {},
				onSuccess: (ctx) => {},
				onError: (ctx) => {},
			},
		);
		console.log("🚀 ~ signUpViaCas ~ error:", error);
		console.log("🚀 ~ signUpViaCas ~ data:", data);
	};

	return (
		<div className="relative h-screen w-full overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-100">
			<div>
				<p>Session: {JSON.stringify(session)}</p>
				<p>Is Pending: {isPending.toString()}</p>
				<p>Error: {error?.message}</p>
			</div>
			{/* Decorative background elements */}
			<div className="absolute inset-0 z-0">
				<div className="absolute top-1/4 left-1/4 h-64 w-64 rounded-full bg-blue-200 opacity-20 blur-3xl"></div>
				<div className="absolute bottom-1/4 right-1/3 h-96 w-96 rounded-full bg-indigo-300 opacity-20 blur-3xl"></div>
				<div className="absolute top-1/3 right-1/4 h-72 w-72 rounded-full bg-purple-200 opacity-20 blur-3xl"></div>
			</div>

			{/* Content */}
			<div className="relative z-10 flex h-full flex-col items-center justify-center px-4 text-center">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8 }}
					className="mb-8"
				>
					<h1 className="mb-2 text-5xl font-bold tracking-tight text-gray-900 md:text-6xl">
						Lobby
					</h1>
					<p className="text-xl text-gray-600 md:text-2xl">
						Find last-minute lunch and dinner plans at Yale
					</p>
				</motion.div>

				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 0.4, duration: 0.8 }}
				>
					<Button
						size="lg"
						// className="bg-blue-600 px-8 py-6 text-lg font-medium hover:bg-blue-700"
						onClick={signUpViaCas}
					>
						Get Started
					</Button>
				</motion.div>

				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 0.6, duration: 0.8 }}
					className="mt-12 max-w-md text-gray-500"
				>
					<p>
						Connect with fellow Yalies for spontaneous meals on campus. No more
						eating alone!
					</p>
				</motion.div>
			</div>
		</div>
	);
}
