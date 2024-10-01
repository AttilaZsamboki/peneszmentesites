"use client";
import { hufFormatter } from "@/app/[id]/_clientPage";
import { AdatlapData } from "@/app/_utils/types";
import { Pagination } from "@/app/page";
import { ColDef } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import React from "react";
import { concatAddress } from "@/app/_utils/MiniCRM";
import { AdatlapDialog, AdatlapokV2Context } from "@/app/adatlapok/Page.1";
import { parseURLString } from "@/lib/utils";

import "../../public/globals.css";

export function Grid({ data }: { data: Pagination<AdatlapData> }) {
	const [open, setOpen] = React.useState(false);
	const [rowData, setRowData] = React.useState(null);
	const [colDefs, setColDefs] = React.useState<ColDef<AdatlapData>[]>([
		{ headerName: "Név", field: "Name" },
		{ headerName: "Cím", valueGetter: (params) => concatAddress(params.data), minWidth: 350 },
		{ headerName: "Felmérő", field: "Felmero2" },
		{ headerName: "Beépítők", field: "Beepitok" },
		{
			headerName: "Felmérés dátuma",
			field: "FelmeresIdopontja2",
			valueFormatter: (params) => new Date(params.value).toLocaleDateString("hu-HU"),
		},
		{
			headerName: "Beépítés dátuma",
			field: "DateTime1953",
			valueFormatter: (params) => new Date(params.value).toLocaleDateString("hu-HU"),
		},
		{
			headerName: "Beépítés összege",
			field: "Total",
			valueFormatter: (params) => hufFormatter.format(params.value),
		},
	]);
	const defaultColDef = React.useMemo<ColDef>(() => {
		return {
			enableValue: true,
			filter: false,
			flex: 1,
			minWidth: 100,
			suppressMovable: true,
		};
	}, []);
	const { fetchNextPage } = React.useContext(AdatlapokV2Context);
	const containerStyle = React.useMemo(() => ({ width: "100%", height: "100%" }), []);
	return (
		<>
			<div className='ag-theme-quartz' style={containerStyle}>
				<AgGridReact
					paginationPageSize={50}
					defaultColDef={defaultColDef}
					pagination={true}
					onRowClicked={(event) => {
						setRowData(event.data);
						setOpen(true);
					}}
					onPaginationChanged={async (event) => {
						if (
							data.next &&
							parseInt(parseURLString(data.next).get("page") ?? "0") - 1 <=
								Math.floor(((event.api.paginationGetCurrentPage() + 1) * 50) / 100)
						) {
							await fetchNextPage();
						}
					}}
					rowData={data.results}
					columnDefs={colDefs}
				/>
			</div>
			<AdatlapDialog open={open} adatlap={rowData as unknown as AdatlapData} onClose={() => setOpen(false)} />
		</>
	);
}
