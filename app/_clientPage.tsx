"use client";
import React, { useCallback, useRef } from "react";
import BaseComponentV2 from "./_components/BaseComponentV2";
import { statusMap } from "./_utils/utils";
import { cn, useUserWithRole } from "@/lib/utils";
import BaseComponentLoading from "./_components/BaseComponentLoading";
import { FilterItem, PaginationOptions } from "./_components/StackedList";
import { miniCrmStatusMap } from "./_utils/MiniCRM";
import { CustomCellRendererProps, CustomFilterProps, useGridFilter } from "ag-grid-react";
import { Badge } from "@/components/ui/badge";
import { IAfterGuiAttachedParams, IDoesFilterPassParams } from "ag-grid-community";

export interface Filter {
	id: number;
	search: string;
	searchField: string;
}

export interface Filter {
	id: number;
	search: string;
	searchField: string;
}

const useSelectFilter = (model: any, colDef: any, onModelChange: (value: any) => void) => {
	const refInput = useRef<HTMLSelectElement>(null);

	const doesFilterPass = useCallback(
		(params: IDoesFilterPassParams) => {
			return params.data[colDef.field!].toString().includes(model);
		},
		[model]
	);

	const afterGuiAttached = useCallback((params?: IAfterGuiAttachedParams) => {
		if (!params || !params.suppressFocus) {
			refInput.current?.focus();
		}
	}, []);

	useGridFilter({
		doesFilterPass,
		afterGuiAttached,
	});

	return { refInput, onModelChange };
};

const SelectFilter = ({ model, onModelChange, colDef }: CustomFilterProps) => {
	const { refInput } = useSelectFilter(model, colDef, onModelChange);

	return (
		<select
			ref={refInput}
			value={model?.filter ?? ""}
			onChange={({ target: { value } }) => onModelChange(value)}
			className={cn("form-select", "w-full", "py-1", "px-2", "border", "border-gray-300", "rounded-md")}>
			<option value=''>Összes</option>
			{Object.entries(statusMap).map(([key, value]) => (
				<option key={key} value={key}>
					{value.name}
				</option>
			))}
		</select>
	);
};

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
			columns={[
				{ field: "id", headerName: "Azonosító", width: 150 },
				{ field: "Name", headerName: "Név", width: 300 },
				{
					field: "status",
					headerName: "Státusz",
					headerClass: "text-center",
					cellRenderer: (params: CustomCellRendererProps) => {
						return (
							<Badge className={statusMap[params.value as keyof typeof statusMap]?.className}>
								{statusMap[params.value as keyof typeof statusMap]?.name}
							</Badge>
						);
					},
					filter: SelectFilter,
				},
				{ field: "Teljes cím", headerName: "Cím", width: 500 },
				{ field: "type", headerName: "Felmérés típusa" },
				{ field: "Felmérő" },
				{ field: "created_at", headerName: "Létrehozva" },
			]}
			variant='grid'
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
						field: "id",
						label: "Azonosító",
						type: "text",
					},
					{
						field: "Name",
						label: "Név",
						type: "text",
					},
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
