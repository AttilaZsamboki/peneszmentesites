import React from "react";
import BaseComponentV2 from "./_components/BaseComponentV2";
import { statusMap } from "./_utils/utils";
import { Filter as OtherFilter } from "./products/page";

export interface Filter {
	id: number;
	search: string;
	searchField: string;
}

export default function ClientPage({ allData, savedFilters }: { allData: any; savedFilters?: OtherFilter[] }) {
	return (
		<BaseComponentV2
			title='Felmérések'
			editHref='/'
			editType='link'
			createButtonTitle='Új felmérés'
			createPath='/new'
			data={allData}
			itemContent={{
				id: "Azonosító",
				title: "Felmérés neve",
				subtitle: "Teljes cím",
				subtitle2: "Felmérés típusa",
				subtitle3: "Felmérő",
				subtitle4: "created_at",
				imgSrc: "IngatlanKepe",
				status: "Státusz",
			}}
			filters={[
				{ field: "Name", label: "Név", type: "select" },
				{ field: "StatusId", label: "MiniCRM státusz", type: "select" },
				{
					field: "status",
					label: "Státusz",
					type: "select",
					options: Object.entries(statusMap).map(([key, value]) => ({ value: key, label: value.name })),
				},
				{ field: "Felmérő", label: "Felmérő", type: "text" },
				{ field: "Felmérés típusa", label: "Felmérés típusa", type: "select" },
				{ field: "Teljes cím", label: "Cím", type: "select" },
				{ field: "created_at", label: "Dátum", type: "daterange" },
			]}
			savedFilters={savedFilters}
		/>
	);
}
