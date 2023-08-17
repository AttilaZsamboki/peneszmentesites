"use client";
import { Felmeres, ListOption, GridOptions, ScaleOption } from "../page";
import { Grid } from "../_components/Grid";
import { Checkbox, Slider } from "@material-tailwind/react";
import Gallery from "../_components/Gallery";

export default function ClientPage({ formattedFelmeres }: { formattedFelmeres: Felmeres[] }) {
	return (
		<dl className='divide-y divide-gray-100'>
			{formattedFelmeres
				.filter((field) => field.value !== "")
				.map((field) => {
					if (["TEXT", "LIST", "MULTIPLE_CHOICE"].includes(field.type)) {
						return (
							<div className='px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0' key={field.id}>
								<dt className='text-base font-medium leading-6 text-gray-900'>{field.field}</dt>
								<dd className='mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0'>
									{field.value}
								</dd>
							</div>
						);
					} else if (field.type === "CHECKBOX") {
						return (
							<div className='px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0' key={field.id}>
								<div className='text-base font-medium leading-6 text-gray-900'>{field.field}</div>
								<div className='mt-4 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0'>
									<div className='grid grid-cols-2 gap-4'>
										{(field.options as ListOption[]).map((option) => (
											<Checkbox
												key={option.label}
												label={option.label}
												checked={field.value.includes(option.value)}
												color='blue-gray'
												crossOrigin='anonymous'
											/>
										))}
									</div>
								</div>
							</div>
						);
					} else if (field.type === "GRID" || field.type === "CHECKBOX_GRID") {
						return (
							<div className='px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0' key={field.id}>
								<div className='text-base mb-4 font-medium leading-6 text-gray-900'>{field.field}</div>
								<Grid
									columns={(field.options as GridOptions).columns}
									rows={(field.options as GridOptions).rows}
									value={field.value as unknown as string[]}
									radio={field.type === "CHECKBOX_GRID" ? false : true}
								/>
							</div>
						);
					} else if (field.type === "SCALE") {
						const percent = `${
							((parseInt(field.value) - (field.options as ScaleOption).min) /
								(field.options as ScaleOption).max) *
							100
						}%`;
						return (
							<div className='px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0' key={field.id}>
								<div className='text-base mb-4 font-medium leading-6 text-gray-900'>{field.field}</div>
								<div className='flex flex-row justify-between'>
									<div>{(field.options as ScaleOption).min}</div>
									<div>{(field.options as ScaleOption).max}</div>
									<div className={`absolute ml-4`} style={{ left: percent }}>
										{field.value}
									</div>
								</div>
								<Slider
									min={(field.options as ScaleOption).min}
									max={(field.options as ScaleOption).max}
									value={field.value}
									color='blue-gray'
								/>
							</div>
						);
					} else if (field.type === "FILE_UPLOAD") {
						return (
							<div className='px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0' key={field.id}>
								<div className='text-base mb-4 font-medium leading-6 text-gray-900'>{field.field}</div>
								<Gallery
									images={field.value as unknown as string[]}
									isVideo={field.field === "Készíts videót és töltsd fel!"}
								/>
							</div>
						);
					}
				})}
		</dl>
	);
}
