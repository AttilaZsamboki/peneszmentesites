"use client";
import { Input } from "@material-tailwind/react";
import React from "react";

export default function SearchBar({
	title,
	value,
	setter,
}: {
	title: string;
	value: string;
	setter: React.Dispatch<React.SetStateAction<string>>;
}) {
	return (
		<div className='w-full'>
			<Input
				label={title}
				className='!border !border-gray-300 bg-white text-gray-900 shadow-lg shadow-gray-900/5 focus:outline-none  placeholder:text-gray-500 '
				color='blue-gray'
				labelProps={{
					className: "hidden",
				}}
				value={value}
				onChange={(e) => setter(e.target.value)}
				containerProps={{ className: "min-w-[100px]" }}
				crossOrigin=''
			/>
		</div>
	);
}
