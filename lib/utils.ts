import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

// Utility function
export function calculatePercentageValue(netTotal: number, otherItems: any[], itemValue: number) {
	const totalOtherValues = otherItems
		.filter((item) => item.type !== "percent" && !isNaN(item.value))
		.reduce((a, b) => a + b.value, 0);

	return ((netTotal + totalOtherValues) * itemValue) / 100;
}
