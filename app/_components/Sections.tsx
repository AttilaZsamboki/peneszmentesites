"use client";

import React from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface Option {
	label: string | React.ReactNode;
	value: string | number;
	subOptions?: Option[];
	onClick?: () => void;
}

export default function Sections({
	options,
	setSelected,
	setFilter,
	selected,
	href,
}: {
	options: Option[];
	selected: string | number;
	setSelected: React.Dispatch<React.SetStateAction<string | number>>;
	filter: string;
	setFilter: React.Dispatch<React.SetStateAction<string>>;
	href?: (value: string) => string;
}) {
	return (
		<Card className='border-0 shadow-none'>
			<CardHeader className='p-0 pb-2'>
				<CardTitle>Szekciók</CardTitle>
				<CardDescription>Itt tudsz a szekciók között váltani</CardDescription>
			</CardHeader>
			<CardContent className='sticky top-5 w-full p-0'>
				<div className='rounded-none py-3 flex flex-col gap-2'>
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
									section.onClick && section.onClick();
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
