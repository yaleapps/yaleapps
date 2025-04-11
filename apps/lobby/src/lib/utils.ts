import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export const getCurrentMealType = () => {
	const hour = new Date().getHours();
	if (hour >= 8 && hour < 11) return "breakfast";
	if (hour >= 11 && hour < 15) return "lunch";
	if (hour >= 17 && hour < 20) return "dinner";
	return "meal";
};
