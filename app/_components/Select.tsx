import { Select as BaseSelect, Option } from "@material-tailwind/react";
import React from "react";

export default function Select({
	options,
	onChange,
	value,
	variant = "default",
	label,
}: {
	options: { label: string; value: string }[];
	onChange: (e: string) => void;
	value: string;
	variant?: "simple" | "default";
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
	return (
		<BaseSelect
			labelProps={{
				className: label ? "" : "hidden",
			}}
			className={style}
			value={value}
			label='Típus'
			onChange={(e) => onChange(e || "")}>
			{options.map((option) => (
				<Option key={option.value} value={option.value}>
					{option.label}
				</Option>
			))}
		</BaseSelect>
	);
}
