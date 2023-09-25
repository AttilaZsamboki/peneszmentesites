"use client";
import React from "react";
import BaseComponentV2 from "./_components/BaseComponentV2";
import { statusMap } from "./_utils/utils";

export interface Filter {
	id: number;
	search: string;
	searchField: string;
}

export default function ClientPage({ allData }: { allData: any }) {
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
				imgSrc: "Ingatlan képe",
				status: "Státusz",
			}}
			filters={[
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
				{ field: "Name", label: "Név", type: "select" },
			]}
			sort={{ by: "id", order: "desc" }}
		/>
	);
}
