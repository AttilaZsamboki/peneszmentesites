import { ButtonProps } from "@/components/ui/button";
import { Product } from "../products/page";
import { Question } from "../questions/page";

import React from "react";

export const typeMap = {
	TEXT: "Szöveg",
	LIST: "Lista",
	CHECKBOX: "Jelölőnégyzet",
	MULTIPLE_CHOICE: "Több választós",
	GRID: "Rács",
	CHECKBOX_GRID: "Jelölőnégyzetes rács",
	SCALE: "Skála",
	FILE_UPLOAD: "Fájlfeltöltés",
};

export const statusMap: { [key: string]: { name: string; color: ButtonProps["color"]; className?: string } } = {
	DRAFT: { name: "Vázlat", color: "gray", className: "bg-gray-900/10 text-gray-900" },
	IN_PROGRESS: { name: "Folyamatban", color: "yellow", className: "bg-yellow-500/20 text-yellow-900" },
	COMPLETED: { name: "Kész", color: "green", className: "bg-green-500/20 text-green-900" },
	CANCELLED: { name: "Sztornó", color: "red", className: "bg-red-500/20 text-red-900" },
};

export function getFirstProduct(question: Question): (value: Product, index: number, obj: Product[]) => unknown {
	return (product) => product.id === (question.products ? question.products[0] : 0);
}

export const breakpoints: Breakpoint[] = [
	{ size: "sm", min: 0, max: 768 },
	{ size: "md", min: 768, max: 1024 },
	{ size: "lg", min: 1024, max: 1280 },
	{ size: "xl", min: 1280, max: 1536 },
	{ size: "2xl", min: 1536, max: 9999 },
];

export type DeviceSizes = "sm" | "md" | "lg" | "xl" | "2xl" | "";

interface Breakpoint {
	size: DeviceSizes;
	min: number;
	max: number;
}

export const useCreateQueryString = (searchParams: any) => {
	return React.useCallback(
		(setParams: { name: string; value: string }[]) => {
			const params = new URLSearchParams(searchParams as unknown as string);
			setParams.forEach(({ name, value }) => {
				params.set(name, value);
			});
			return params.toString();
		},
		[searchParams]
	);
};

export function isValidDate(d: Date) {
	if (d instanceof Date && !isNaN(d as unknown as number)) {
		return !isNaN(d.getTime());
	}
}
