import { cn } from "@/lib/utils";
import type { ComponentProps } from "react";
import { Input } from "./input";

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
				const strippedValue = e.target.value.replace(/\D/g, "");
				onChange(strippedValue);
			}}
			placeholder="(123) 456-7890"
			className={cn("font-mono", className)}
		/>
	);
}

function formatPhoneNumber(value: string): string {
	const number = value.replace(/\D/g, "");
	const isUsNumber =
		number.length === 10 || (number.startsWith("1") && number.length === 11);
	if (isUsNumber) {
		const areaCode = number.slice(-10, -7);
		const prefix = number.slice(-7, -4);
		const lineNumber = number.slice(-4);

		if (lineNumber) return `(${areaCode}) ${prefix}-${lineNumber}`.trim();
		if (prefix) return `(${areaCode}) ${prefix}`.trim();
		if (areaCode) return `(${areaCode}`.trim();
	}

	const isInternationalNumber = number.length > 10;
	if (isInternationalNumber) {
		const countryCode = number.slice(
			0,
			number.length > 12 ? 3 : number.length > 11 ? 2 : 1,
		);
		const remainingNumbers = number.slice(countryCode.length);

		// Format remaining numbers in groups of 3-3-4 or 3-3-3 depending on length
		const areaCode = remainingNumbers.slice(0, 3);
		const prefix = remainingNumbers.slice(3, 6);
		const lineNumber = remainingNumbers.slice(6);

		if (lineNumber)
			return `+${countryCode} ${areaCode} ${prefix}-${lineNumber}`.trim();
		if (prefix) return `+${countryCode} ${areaCode} ${prefix}`.trim();
		if (areaCode) return `+${countryCode} ${areaCode}`.trim();

		return `+${countryCode}`.trim();
	}

	return number;
}
