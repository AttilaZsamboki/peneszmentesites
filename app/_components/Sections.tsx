"use client";

import React from "react";
import { Tab, Tabs, TabsHeader } from "@material-tailwind/react";

export default function Sections({
	sectionNames,
	selected,
	setSelected,
}: {
	sectionNames: string[];
	selected: string;
	setSelected: React.Dispatch<React.SetStateAction<string>>;
}) {
	return (
		<Tabs className='sticky top-5' orientation='vertical'>
			<TabsHeader>
				{sectionNames.map((section) => (
					<Tab key={section} onClick={() => setSelected(section)} value={section}>
						{section}
					</Tab>
				))}
			</TabsHeader>
		</Tabs>
	);
}
