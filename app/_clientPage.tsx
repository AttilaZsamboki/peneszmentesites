"use client";
import React from "react";
import BaseComponentV2 from "./_components/BaseComponentV2";

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
				subtitle4: "Dátum",
				imgSrc: "Ingatlan képe",
				status: "Státusz",
			}}
			sort={{ by: "id", order: "desc" }}
		/>
	);
}
