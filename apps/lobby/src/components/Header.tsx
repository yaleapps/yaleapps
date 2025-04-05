import { Link } from "@tanstack/react-router";

export default function Header() {
	return (
		<header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
			<div className="container flex h-14 max-w-screen-2xl items-center">
				{/* Logo/Brand Section - Now the only element */}
				<div className="flex items-center">
					<Link to="/" className="flex items-center space-x-2">
						<span className="font-bold text-lg">Lobby</span>
					</Link>
				</div>
			</div>
		</header>
	);
}
