import { isJSONParsable } from "@/app/[id]/_clientPage";
import { type ClassValue, clsx } from "clsx";
import React from "react";
import { twMerge } from "tailwind-merge";
import jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
dotenv.config();

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
	const [state, setState] = React.useState(() => {
		if (typeof window !== "undefined") {
			const storedValue = window.localStorage.getItem(key);
			return isJSONParsable(storedValue ?? "") && storedValue !== null
				? (JSON.parse(storedValue) as boolean)
				: defaultValue;
		}
		return defaultValue;
	});

	React.useEffect(() => {
		window.localStorage.setItem(key, JSON.stringify(state));
	}, [key, state]);

	return [state, setState];
}

export function useLocalStorageStateObject<T>(
	key: string,
	defaultValue: T
): [T, React.Dispatch<React.SetStateAction<T>>] {
	const [state, setState] = React.useState(() => {
		if (typeof window !== "undefined") {
			const storedValue = window.localStorage.getItem(key);
			return isJSONParsable(storedValue ?? "") && storedValue !== null
				? (JSON.parse(storedValue) as T)
				: defaultValue;
		}
		return defaultValue;
	});

	React.useEffect(() => {
		window.localStorage.setItem(key, JSON.stringify(state));
	}, [key, state]);

	return [state, setState];
}

export function createJWT(user: string) {
	const payload = {
		sub: user, // Subject (user ID)
		iat: Math.floor(Date.now() / 1000), // Issued at time
		exp: Math.floor(Date.now() / 1000) + 30 * 60,
		aud: "penész-frontend", // Audience
		iss: "penészmentesítés", // Issuer
	};
	const secret = process.env.NEXT_PUBLIC_SECRET;

	if (secret) {
		return jwt.sign(payload, secret, {
			algorithm: "HS256",
		});
	}
}

export function getCookie(name: string) {
	if (typeof window === "undefined") {
		return null;
	}

	let cookieArr = document.cookie.split("; ");

	for (let i = 0; i < cookieArr.length; i++) {
		let cookiePair = cookieArr[i].split("=");

		if (name == cookiePair[0]) {
			return cookiePair[1];
		}
	}
	return null;
}
