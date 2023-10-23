"use client";
import React from "react";

export function useLocalStorageState(
	key: string,
	defaultValue: boolean
): [boolean, React.Dispatch<React.SetStateAction<boolean>>] {
	const [state, setState] = React.useState(() => {
		const storedValue = window.localStorage.getItem(key);
		return storedValue !== null ? (JSON.parse(storedValue) as boolean) : defaultValue;
	});

	React.useEffect(() => {
		window.localStorage.setItem(key, JSON.stringify(state));
	}, [key, state]);

	return [state, setState];
}
