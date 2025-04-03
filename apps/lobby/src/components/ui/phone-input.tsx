import { cn } from "@/lib/utils";
import type { ChangeEvent, ComponentProps } from "react";
import { Input } from "./input";

function formatPhoneNumber(value: string): string {
	const numbers = value.replace(/\D/g, "").slice(0, 10);
	if (numbers.length === 0) return "";
	if (numbers.length <= 3) return `(${numbers}`;
	if (numbers.length <= 6)
		return `(${numbers.slice(0, 3)}) ${numbers.slice(3)}`;
	return `(${numbers.slice(0, 3)}) ${numbers.slice(3, 6)}-${numbers.slice(6)}`;
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
			onChange={(e: ChangeEvent<HTMLInputElement>) => {
				const rawValue = e.target.value.replace(/\D/g, "");
				onChange(rawValue);
			}}
			placeholder="(123) 456-7890"
			className={cn("font-mono", className)}
		/>
	);
}
