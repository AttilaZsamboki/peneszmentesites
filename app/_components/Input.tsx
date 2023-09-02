"use client";
import { Input as MaterialInput } from "@material-tailwind/react";
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
			setStyle(
				"!border !border-gray-300 bg-white text-gray-900 shadow-lg shadow-gray-900/5 ring-4 ring-transparent placeholder:text-gray-500"
			);
		}
	}, [variant]);
	return (
		<MaterialInput
			crossOrigin=''
			labelProps={{
				className: label ? "" : "hidden",
			}}
			label={label}
			value={value}
			onChange={onChange}
			className={style}
			containerProps={{ className: label ? "" : "min-w-[100px]" }}
			color='gray'
		/>
	);
}
