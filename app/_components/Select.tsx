import { Select as BaseSelect, Option } from "@material-tailwind/react";

export default function Select({
	options,
	onChange,
	value,
}: {
	options: string[];
	onChange: (e: string) => void;
	value: string;
}) {
	return (
		<BaseSelect
			labelProps={{
				className: "hidden",
			}}
			className='!border !border-gray-300 bg-white text-gray-900 shadow-lg shadow-gray-900/5 ring-4 ring-transparent placeholder:text-gray-500'
			value={value}
			label='Típus'
			onChange={(e) => onChange(e || "")}>
			{options.map((option) => (
				<Option key={option} value={option}>
					{option}
				</Option>
			))}
		</BaseSelect>
	);
}
