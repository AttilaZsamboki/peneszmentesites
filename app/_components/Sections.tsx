"use client";

import React from "react";
import { Tab, Tabs, TabsHeader } from "@material-tailwind/react";
import Input from "./Input";

export default function Sections({
	sectionNames,
	setSelected,
	filter,
	setFilter,
	disabled = false,
}: {
	sectionNames: string[];
	selected: string;
	setSelected: React.Dispatch<React.SetStateAction<string>>;
	filter: string;
	setFilter: React.Dispatch<React.SetStateAction<string>>;
	disabled?: boolean;
}) {
	return (
		<Tabs className='sticky top-5 w-full flex flex-col' orientation='vertical'>
			<TabsHeader className='rounded-none lg:rounded-md'>
				<div className='mx-3 my-1 mb-3'>
					<Input onChange={(e) => setFilter(e.target.value)} value={filter} />
				</div>
				{sectionNames
					.filter((section) => (filter ? section.toLowerCase().includes(filter.toLowerCase()) : true))
					.map((section) => (
						<Tab
							key={section}
							onClick={() => {
								setSelected(section);
								setFilter("");
							}}
							disabled={disabled}
							value={section}>
							{section}
						</Tab>
					))}
			</TabsHeader>
		</Tabs>
	);
}
