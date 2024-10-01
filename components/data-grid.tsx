"use client";

import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { ScrollArea } from "./ui/scroll-area";
import { AgGridReact } from "ag-grid-react";
import { themeQuartz } from "@ag-grid-community/theming";

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { ColDef } from "ag-grid-community";

type DataItem = Record<string, any>;

export interface Column {
	key: string;
	label: string;
	render?: (value: any) => React.ReactNode;
}

interface DataGridProps {
	data: DataItem[];
	columns: Column[];
	itemsPerPage?: number;
}

export function DataGridComponent({ data, columns, itemsPerPage = 12 }: DataGridProps) {
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

	const columnDefs: ColDef[] = columns.map((column) => ({
		headerName: column.label,
		field: column.key,
		cellRenderer: column.render ? (params: { value: any }) => column.render!(params.value) : undefined,
		flex: 1,
	}));

	const myTheme = themeQuartz.withParams({
		spacing: 12,
		accentColor: "red",
	});

	return (
		<div className='space-y-4'>
			{/* <Table className='bg-white w-full'>
				<TableHeader>
					<TableRow>
						{columns.map((column) => (
							<TableHead key={column.key}>{column.label}</TableHead>
						))}
					</TableRow>
				</TableHeader>
				<TableBody >
					{currentData.map((item, index) => (
						<TableRow key={index}>
							{columns.map((column) => (
								<TableCell key={column.key}>
									{column.render ? column.render(item[column.key]) : item[column.key]}
								</TableCell>
							))}
						</TableRow>
					))}
				</TableBody>
			</Table> */}
			<div className='ag-theme-quartz' style={{ height: "70dvh", width: "100%" }}>
				<AgGridReact theme={myTheme} rowData={currentData} columnDefs={columnDefs} />
			</div>
		</div>
	);
}

// Example usage
function ExampleDataGrid() {
	const columns: Column[] = [
		{ key: "name", label: "Name" },
		{ key: "orderId", label: "Order ID" },
		{
			key: "status",
			label: "Status",
			render: (value) => <Badge variant={value === "Ready" ? "default" : "secondary"}>{value}</Badge>,
		},
		{ key: "paymentStatus", label: "Payment Status" },
		{ key: "shippingMethod", label: "Shipping Method" },
		{ key: "paymentMethod", label: "Payment Method" },
		{ key: "total", label: "Total Amount" },
	];

	const data: DataItem[] = [
		{
			name: "Joe Doe",
			orderId: "ORD-2024-000949",
			status: "Ready",
			paymentStatus: "2024 Jan. 24. 21:10",
			shippingMethod: "GLS Delivery",
			paymentMethod: "Bank Transfer",
			total: "8 475 Ft",
		},
		{
			name: "John Doe",
			orderId: "ORD-2024-000949",
			status: "Ready",
			paymentStatus: "2024 Jan. 24. 21:10",
			shippingMethod: "GLS Delivery",
			paymentMethod: "Bank Transfer",
			total: "8 475 Ft",
		},
		{
			name: "John Doe",
			orderId: "ORD-2024-000949",
			status: "Ready",
			paymentStatus: "2024 Jan. 24. 21:10",
			shippingMethod: "GLS Delivery",
			paymentMethod: "Bank Transfer",
			total: "8 475 Ft",
		},
		{
			name: "John Doe",
			orderId: "ORD-2024-000949",
			status: "Ready",
			paymentStatus: "2024 Jan. 24. 21:10",
			shippingMethod: "GLS Delivery",
			paymentMethod: "Bank Transfer",
			total: "8 475 Ft",
		},
		{
			name: "John Doe",
			orderId: "ORD-2024-000949",
			status: "Ready",
			paymentStatus: "2024 Jan. 24. 21:10",
			shippingMethod: "GLS Delivery",
			paymentMethod: "Bank Transfer",
			total: "8 475 Ft",
		},
		{
			name: "John Doe",
			orderId: "ORD-2024-000949",
			status: "Ready",
			paymentStatus: "2024 Jan. 24. 21:10",
			shippingMethod: "GLS Delivery",
			paymentMethod: "Bank Transfer",
			total: "8 475 Ft",
		},
		{
			name: "John Doe",
			orderId: "ORD-2024-000949",
			status: "Ready",
			paymentStatus: "2024 Jan. 24. 21:10",
			shippingMethod: "GLS Delivery",
			paymentMethod: "Bank Transfer",
			total: "8 475 Ft",
		},
		{
			name: "John Doe",
			orderId: "ORD-2024-000949",
			status: "Ready",
			paymentStatus: "2024 Jan. 24. 21:10",
			shippingMethod: "GLS Delivery",
			paymentMethod: "Bank Transfer",
			total: "8 475 Ft",
		},
		{
			name: "John Doe",
			orderId: "ORD-2024-000949",
			status: "Ready",
			paymentStatus: "2024 Jan. 24. 21:10",
			shippingMethod: "GLS Delivery",
			paymentMethod: "Bank Transfer",
			total: "8 475 Ft",
		},
		{
			name: "John Doe",
			orderId: "ORD-2024-000949",
			status: "Ready",
			paymentStatus: "2024 Jan. 24. 21:10",
			shippingMethod: "GLS Delivery",
			paymentMethod: "Bank Transfer",
			total: "8 475 Ft",
		},
		{
			name: "John Doe",
			orderId: "ORD-2024-000949",
			status: "Ready",
			paymentStatus: "2024 Jan. 24. 21:10",
			shippingMethod: "GLS Delivery",
			paymentMethod: "Bank Transfer",
			total: "8 475 Ft",
		},
		{
			name: "John Doe",
			orderId: "ORD-2024-000949",
			status: "Ready",
			paymentStatus: "2024 Jan. 24. 21:10",
			shippingMethod: "GLS Delivery",
			paymentMethod: "Bank Transfer",
			total: "8 475 Ft",
		},
		{
			name: "John Doe",
			orderId: "ORD-2024-000949",
			status: "Ready",
			paymentStatus: "2024 Jan. 24. 21:10",
			shippingMethod: "GLS Delivery",
			paymentMethod: "Bank Transfer",
			total: "8 475 Ft",
		},
		{
			name: "John Doe",
			orderId: "ORD-2024-000949",
			status: "Ready",
			paymentStatus: "2024 Jan. 24. 21:10",
			shippingMethod: "GLS Delivery",
			paymentMethod: "Bank Transfer",
			total: "8 475 Ft",
		},
		{
			name: "John Doe",
			orderId: "ORD-2024-000949",
			status: "Ready",
			paymentStatus: "2024 Jan. 24. 21:10",
			shippingMethod: "GLS Delivery",
			paymentMethod: "Bank Transfer",
			total: "8 475 Ft",
		},
		{
			name: "John Doe",
			orderId: "ORD-2024-000949",
			status: "Ready",
			paymentStatus: "2024 Jan. 24. 21:10",
			shippingMethod: "GLS Delivery",
			paymentMethod: "Bank Transfer",
			total: "8 475 Ft",
		},
		{
			name: "John Doe",
			orderId: "ORD-2024-000949",
			status: "Ready",
			paymentStatus: "2024 Jan. 24. 21:10",
			shippingMethod: "GLS Delivery",
			paymentMethod: "Bank Transfer",
			total: "8 475 Ft",
		},
		{
			name: "John Doe",
			orderId: "ORD-2024-000949",
			status: "Ready",
			paymentStatus: "2024 Jan. 24. 21:10",
			shippingMethod: "GLS Delivery",
			paymentMethod: "Bank Transfer",
			total: "8 475 Ft",
		},
		{
			name: "John Doe",
			orderId: "ORD-2024-000949",
			status: "Ready",
			paymentStatus: "2024 Jan. 24. 21:10",
			shippingMethod: "GLS Delivery",
			paymentMethod: "Bank Transfer",
			total: "8 475 Ft",
		},
		{
			name: "John Doe",
			orderId: "ORD-2024-000949",
			status: "Ready",
			paymentStatus: "2024 Jan. 24. 21:10",
			shippingMethod: "GLS Delivery",
			paymentMethod: "Bank Transfer",
			total: "8 475 Ft",
		},
	];

	return <DataGridComponent data={data} columns={columns} />;
}

export { ExampleDataGrid };
