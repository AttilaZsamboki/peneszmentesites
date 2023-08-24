"use client";
import { Typography } from "@material-tailwind/react";

export default function Heading({
	title,
	variant,
}: {
	title: string;
	variant: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
}) {
	return (
		<div className='flex lg:flex-row flex-col justify-between items-center w-full mb-2 border-b'>
			<div className='flex flex-col justify-items items-center w-full'>
				<div className='flex flex-col w-11/12 px-2 lg:items-start sm:items-center justify-center lg:justify-between lg:my-12 text-center'>
					<Typography
						variant={variant}
						className='font-semibold text-gradient-to-tr from-gray-900 to-gray-800 lg:my-0 my-12 text-left'>
						{title}
					</Typography>
				</div>
			</div>
		</div>
	);
}
