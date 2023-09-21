"use client";
import React from "react";
import BaseComponentV2 from "../_components/BaseComponentV2";

export interface Filter {
	id: number;
	search: string;
	searchField: string;
}

export default function ClientPage({ allData }: { allData: any }) {
	return (
		<BaseComponentV2
			title='Felmérések'
			editHref='/felmeresek/'
			editType='link'
			createButtonTitle='Új felmérés'
			createPath='/felmeresek/new'
			data={allData}
			itemContent={{
				id: "id",
				title: "title",
				subtitle: "TeljesCim",
				subtitle2: "type",
				subtitle3: "Felmero2",
				subtitle4: "CreatedAt",
				imgSrc: "IngatlanKepe",
				status: "status",
			}}
			sort={{ by: "id", order: "desc" }}
		/>
	);
}
