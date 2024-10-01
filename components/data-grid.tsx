"use client";

import { forwardRef, useMemo } from "react";
import { AgGridReact, AgGridReactProps } from "ag-grid-react";

export const DataGridComponent = forwardRef<AgGridReact, AgGridReactProps>(function DataGridComponent(
	{ ...props },
	ref
) {
	const defaultColDef = useMemo(() => {
		return {
			flex: 1,
			filter: "agTextColumnFilter",
		};
	}, []);

	return (
		<div className='ag-theme-quartz' style={{ height: "70dvh", width: "100%" }}>
			<AgGridReact {...props} defaultColDef={defaultColDef} ref={ref} />
		</div>
	);
});
