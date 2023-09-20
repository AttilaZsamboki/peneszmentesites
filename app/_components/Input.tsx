"use client";
import { Input as MaterialInput } from "@/components/ui/input";
import React from "react";

export default function Input({
	onChange,
	value,
	variant = "default",
	label,
}: {
	value: string | number;
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	variant?: "default" | "simple";
	label?: string;
}) {
	const [style, setStyle] = React.useState("");
	React.useEffect(() => {
		if (label) {
			setStyle("");
		} else if (variant === "simple") {
			setStyle("border !border !border-gray-200");
		} else if (variant === "default") {
			setStyle("input-field");
		}
	}, [variant]);
	return <MaterialInput value={value} onChange={onChange} className={style} />;
}
