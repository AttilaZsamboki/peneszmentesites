"use client";
import { ProductAttributes } from "./page";
import { Checkbox, Typography } from "@material-tailwind/react";

export default function ClientPage({ data }: { data: ProductAttributes }) {
	if (!data) return null;
	return (
		<div className='w-1/3 items-center flex justify-between flex-row'>
			<Typography color='gray'>Számít a hely?</Typography>
			<Checkbox checked={data.place} color='gray' crossOrigin='' />
		</div>
	);
}
