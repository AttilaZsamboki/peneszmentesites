"use client";

import React from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

function Icon({ open }: { open: boolean }) {
	return (
		<svg
			xmlns='http://www.w3.org/2000/svg'
			fill='none'
			viewBox='0 0 24 24'
			strokeWidth={2}
			stroke='currentColor'
			className={`${open ? "rotate-180" : ""} h-5 w-5 transition-transform`}>
			<path strokeLinecap='round' strokeLinejoin='round' d='M19.5 8.25l-7.5 7.5-7.5-7.5' />
		</svg>
	);
}

export default function Sections({
	options,
	setSelected,
	filter,
	setFilter,
	disabled = false,
	selected,
	href,
}: {
	options: { label: string; value: string | number; subOptions?: { label: string; value: string | number }[] }[];
	selected: string | number;
	setSelected: React.Dispatch<React.SetStateAction<string | number>>;
	filter: string;
	setFilter: React.Dispatch<React.SetStateAction<string>>;
	disabled?: boolean;
	href?: (value: string) => string;
}) {
	return (
		<Card>
			<CardHeader>
				<CardTitle>Szekciók</CardTitle>
				<CardDescription>Itt tudsz a szekciók között váltani</CardDescription>
			</CardHeader>
			<CardContent className='sticky top-5 w-full '>
				<div className='rounded-none py-3 lg:rounded-sm px-3 border flex flex-col gap-2'>
					{options.map((section) =>
						section.subOptions ? (
							<Accordion key={section.value} type='single' collapsible>
								<AccordionItem className='border-b-0' value='item-1'>
									<AccordionTrigger className='hover:no-underline rounded-md px-2 py-1'>
										{section.label}
									</AccordionTrigger>
									<AccordionContent className='pb-0'>
										<div className='flex flex-col gap-2 py-2'>
											{section.subOptions.map((option) => (
												<Link
													key={option.value}
													className={cn(
														selected === option.value && "bg-gray-100 font-semibold",
														"rounded-md px-2 py-1 ml-2"
													)}
													href={href ? href(option.value.toString()) : ""}
													onClick={() => {
														setSelected(option.value);
														setFilter("");
													}}>
													{option.label}
												</Link>
											))}
										</div>
									</AccordionContent>
								</AccordionItem>
							</Accordion>
						) : (
							<Link
								key={section.value}
								className={cn(
									selected === section.value && "bg-gray-100 font-semibold",
									"rounded-md px-2 py-1"
								)}
								href={href ? href(section.value.toString()) : ""}
								onClick={() => {
									setSelected(section.value);
									setFilter("");
								}}>
								<div>{section.label}</div>
							</Link>
						)
					)}
				</div>
			</CardContent>
		</Card>
	);
}
