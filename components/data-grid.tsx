"use client";

import { RefObject, useEffect, useMemo, useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { AgGridReact } from "ag-grid-react";
import { themeQuartz } from "@ag-grid-community/theming";

import { ColDef, FilterChangedEvent, FilterModifiedEvent } from "ag-grid-community";
import { Filter } from "@/app/products/page";

type DataItem = Record<string, any>;

export interface Column {
	key: string;
	label: string;
	render?: (value: any) => React.ReactNode;
}

interface DataGridProps {
	data: DataItem[];
	columns: ColDef[];
	itemsPerPage?: number;
	onFilterModified?: (event: FilterChangedEvent) => void;
	gridRef?: RefObject<AgGridReact>;
	filterPreset?: Filter;
}

export function DataGridComponent({ data, columns, itemsPerPage = 12, onFilterModified, gridRef }: DataGridProps) {
	const [currentPage, setCurrentPage] = useState(1);
	const [searchTerm, setSearchTerm] = useState("");

	const filteredData = data.filter((item) =>
		Object.values(item).some(
			(value) => typeof value === "string" && value.toLowerCase().includes(searchTerm.toLowerCase())
		)
	);

	const startIndex = (currentPage - 1) * itemsPerPage;
	const endIndex = startIndex + itemsPerPage;
	const currentData = filteredData.slice(startIndex, endIndex);

	const defaultColDef = useMemo(() => {
		return {
			flex: 1,
			filter: "agTextColumnFilter",
		};
	}, []);

	return (
		<div className='ag-theme-quartz' style={{ height: "70dvh", width: "100%" }}>
			<AgGridReact
				defaultColDef={defaultColDef}
				rowData={currentData}
				columnDefs={columns}
				onFilterChanged={onFilterModified}
				ref={gridRef}
			/>
		</div>
	);
}
