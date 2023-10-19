"use client";

import React from "react";
import { Tab, Tabs, TabsHeader, Accordion, AccordionBody, AccordionHeader } from "@material-tailwind/react";
import Input from "./Input";
import Link from "next/link";

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
	href,
}: {
	options: { label: string; value: string | number }[];
	selected: string | number;
	setSelected: React.Dispatch<React.SetStateAction<string | number>>;
	filter: string;
	setFilter: React.Dispatch<React.SetStateAction<string>>;
	disabled?: boolean;
	href?: (value: string) => string;
}) {
	const [open, setOpen] = React.useState(true);
	return (
		<Tabs className='sticky top-5 w-full flex flex-col ' orientation='vertical'>
			<TabsHeader className='rounded-none lg:rounded-sm px-5 border'>
				<Accordion open={open} icon={<Icon open={open} />}>
					<AccordionHeader onClick={() => setOpen(!open)}>
						<div className='mx-3 my-1 mb-3 w-full'>
							<Input onChange={(e) => setFilter(e.target.value)} value={filter} />
						</div>
					</AccordionHeader>
					<AccordionBody>
						{options.map((section) => (
							<Link href={href ? href(section.value.toString()) : ""}>
								<Tab
									key={section.value}
									onClick={() => {
										setSelected(section.value);
										setFilter("");
									}}
									disabled={disabled}
									value={section.value}>
									{section.label}
								</Tab>
							</Link>
						))}
					</AccordionBody>
				</Accordion>
			</TabsHeader>
		</Tabs>
	);
}
