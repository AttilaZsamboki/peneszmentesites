"use client";
import { Input as MaterialInput } from "@material-tailwind/react";

export default function Input({
	onChange,
	value,
}: {
	value: string;
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
	return (
		<MaterialInput
			crossOrigin=''
			labelProps={{
				className: "hidden",
			}}
			value={value}
			onChange={onChange}
			className='!border !border-gray-300 bg-white text-gray-900 shadow-lg shadow-gray-900/5 ring-4 ring-transparent placeholder:text-gray-500'
			containerProps={{ className: "min-w-[100px]" }}
			color='blue-gray'
		/>
	);
}
