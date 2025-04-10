import { useTheme } from "@/components/theme-provider";
import type { ComponentProps } from "react";
import { Toaster as Sonner } from "sonner";

const Toaster = ({ ...props }: ComponentProps<typeof Sonner>) => {
	const { theme = "system" } = useTheme();

	return (
		<Sonner
			theme={theme}
			className="toaster group"
			style={
				{
					"--normal-bg": "var(--popover)",
					"--normal-text": "var(--popover-foreground)",
					"--normal-border": "var(--border)",
				} as React.CSSProperties
			}
			{...props}
		/>
	);
};

export { Toaster };
