import { isJSONParsable } from "@/app/[id]/_clientPage";
import { type ClassValue, clsx } from "clsx";
import React from "react";
import { twMerge } from "tailwind-merge";
import jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
import { UserContext, UserProfile, useUser } from "@auth0/nextjs-auth0/client";
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
		exp: Math.floor(Date.now() / 1000) + 3.156 * 10 ** 7,
		aud: "penész-frontend", // Audience
		iss: "penészmentesítés", // Issuer
	};
	const secret = process.env.NEXT_PUBLIC_SECRET;

	if (secret) {
		console.log(typeof secret); // log the type of secret
		console.log(typeof { algorithm: "HS256" }); // log the type of options object
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

export type Role = "User" | "Admin" | "Felmérő" | "Beépítő" | undefined;

interface User extends UserContext {
	user: UserWithRole;
}
interface UserWithRole extends UserProfile {
	role: Role;
}

export function useUserWithRole(): User | UserContext {
	const [role, setRole] = React.useState<Role | undefined>(undefined);
	const [roleLoading, setRoleLoading] = React.useState(true);
	const user = useUser();
	React.useEffect(() => {
		if (!user.user?.sub) {
			return;
		}
		fetch(`https://pen.dataupload.xyz/user-role/${user.user.sub}`)
			.then((res) => res.json())
			.catch((err) => {
				console.error(err);
				setRole("User");
				setRoleLoading(false);
			})
			.then((data) => {
				setRole(data.name);
				setRoleLoading(false);
			});
	}, [user.user?.sub]);

	if (user.user) {
		return { ...user, user: { ...user.user, role }, isLoading: user.isLoading || roleLoading };
	}
	return user;
}

export function invertObject(obj: Record<string, any>) {
	return Object.entries(obj).reduce((acc, [key, value]) => {
		acc[value] = key;
		return acc;
	}, {} as Record<string, any>);
}

export interface Settings {
	[name: string]: string;
}

export function useSettings() {
	const [settings, setSettings] = React.useState<Settings>();

	React.useEffect(() => {
		const fetchData = async () => {
			const res = await fetch("https://pen.dataupload.xyz/settings");
			if (res.ok) {
				await res.json().then((data) => {
					data.map((setting: { name: string; value: string }) => {
						setSettings((prev) => ({ ...prev, [setting.name]: setting.value }));
					});
				});
			}
		};
		fetchData();
	}, []);

	return settings;
}

export function parseURLString(url: string) {
	let params = new URLSearchParams(new URL(url).search);
	return params;
}
