"use client";
import { Typography } from "@material-tailwind/react";

export default function Heading({ title }: { title: string }) {
	return (
		<div className='flex flex-col lg:items-start sm:items-center justify-center lg:justify-between p-2 lg:mb-5 text-center'>
			<Typography variant='h2'>{title}</Typography>
		</div>
	);
}
