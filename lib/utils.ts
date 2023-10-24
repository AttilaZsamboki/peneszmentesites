import { type ClassValue, clsx } from "clsx";
import React from "react";
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
export function useLocalStorageState(
	key: string,
	defaultValue: boolean
): [boolean, React.Dispatch<React.SetStateAction<boolean>>] {
	const [state, setState] = React.useState(defaultValue);

	React.useEffect(() => {
		setState(() => {
			const storedValue = window.localStorage.getItem(key);
			return storedValue !== null ? (JSON.parse(storedValue) as boolean) : defaultValue;
		});
	}, []);

	React.useEffect(() => {
		setTimeout(() => window.localStorage.setItem(key, JSON.stringify(state)), 1);
	}, [key, state]);

	return [state, setState];
}
