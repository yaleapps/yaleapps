import { cn } from "@/lib/utils";
import type { ComponentProps } from "react";
import { Input } from "./input";

function formatPhoneNumber(value: string): string {
	// For exactly 10 digits - Presumably US format
	if (value.length === 10) {
		return `(${(value).slice(0, 3)}) ${(value).slice(3, 6)}-${(value).slice(6)}`;
	}

	// For international numbers (more than 10 digits)
	if (value.length > 10) {
		const countryCodeLength = value.length > 12 ? 3 : value.length > 11 ? 2 : 1;
		const countryCode = value.slice(0, countryCodeLength);
		const remainingNumbers = value.slice(countryCodeLength);

		// Format remaining numbers in groups of 3-3-4
		const formatted = [
			remainingNumbers.slice(0, 3),
			remainingNumbers.slice(3, 6),
			remainingNumbers.slice(6),
		]
			.filter(Boolean)
			.join(" ");

		return `+${countryCode} ${formatted}`.trim();
	}

	return value;
}

export function PhoneInput({
	value,
	onChange,
	className,
	...props
}: Omit<ComponentProps<typeof Input>, "onChange"> & {
	value: string;
	onChange: (value: string) => void;
}) {
	const displayValue = formatPhoneNumber(value);

	return (
		<Input
			{...props}
			type="tel"
			inputMode="numeric"
			value={displayValue}
			onChange={(e) => {
				onChange(e.target.value);
			}}
			placeholder="(123) 456-7890"
			className={cn("font-mono", className)}
		/>
	);
}
