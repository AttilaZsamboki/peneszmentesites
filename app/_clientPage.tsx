"use client";
import React from "react";
import BaseComponentV2 from "./_components/BaseComponentV2";
import { statusMap } from "./_utils/utils";
import { useUserWithRole } from "@/lib/utils";
import BaseComponentLoading from "./_components/BaseComponentLoading";
import { FilterItem, PaginationOptions } from "./_components/StackedList";
import { miniCrmStatusMap } from "./_utils/MiniCRM";

export interface Filter {
	id: number;
	search: string;
	searchField: string;
}

export default function ClientPage({ allData, paginationData }: { allData: any; paginationData: PaginationOptions }) {
	React.useEffect(() => localStorage.clear(), []);
	const { user, isLoading } = useUserWithRole();
	if (isLoading) {
		return <BaseComponentLoading />;
	}

	return (
		<BaseComponentV2
			pagination={paginationData}
			defaultViewName={user?.role === "Felmérő" ? "Saját felmérések" : undefined}
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
				status: "Státusz",
			}}
			filters={
				[
					{
						field: "StatusId",
						label: "MiniCRM státusz",
						type: "select",
						options: Object.entries(miniCrmStatusMap).map(([key, value]) => ({
							label: key,
							value: value.toString(),
						})),
					},
					{
						field: "status",
						label: "Státusz",
						type: "select",
						options: Object.entries(statusMap).map(([key, value]) => ({ value: key, label: value.name })),
					},
					{ field: "Felmérő", label: "Felmérő", type: "text" },
					{ field: "Felmérés típusa", label: "Felmérés típusa", type: "select" },
					{ field: "created_at", label: "Dátum", type: "daterange" },
					user?.role === "Felmérő" || user?.role === "Admin"
						? {
								field: "created_by",
								label: "Saját",
								value: user.role! === "Felmérő" ? user.sub! : "",
								type: "select",
								options: [
									{ value: user.sub!, label: "Igen" },
									{ value: "", label: "Nem" },
								],
						  }
						: null,
				].filter((filter) => filter) as FilterItem[]
			}
		/>
	);
}
