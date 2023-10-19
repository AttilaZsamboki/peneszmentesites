"use client";
import { Typography } from "@material-tailwind/react";

export default function Heading({
	id,
	title,
	variant,
	width = "w-11/12",
	children,
	border = true,
	marginY,
}: {
	id?: string;
	title: string;
	variant: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
	width?: string;
	children?: React.ReactNode;
	border?: boolean;
	marginY?: string;
}) {
	return (
		<div
			id={id}
			className={`flex lg:flex-row flex-col justify-between items-center w-full mb-2 ${
				border ? "border-b" : ""
			}`}>
			<div className='flex flex-col justify-items items-center w-full'>
				<div
					className={`flex flex-col ${width} px-2 lg:items-start sm:items-center justify-center ${
						marginY ? marginY : "lg:my-12"
					} lg:justify-between text-center`}>
					<Typography
						variant={variant}
						className={`font-semibold text-gradient-to-tr from-gray-900 to-gray-800 lg:my-0 text-left`}>
						{title}
					</Typography>
				</div>
			</div>
			{children}
		</div>
	);
}
