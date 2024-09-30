"use client";

import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { Separator } from "./ui/separator";

type DataItem = Record<string, any>;

interface Column {
	key: string;
	label: string;
	render?: (value: any) => React.ReactNode;
}

interface DataGridProps {
	data: DataItem[];
	columns: Column[];
	itemsPerPage?: number;
	dataLength?: number;
	atLastPage?: () => void;
}

export function DataGridComponent({ data, columns, itemsPerPage = 12, dataLength, atLastPage }: DataGridProps) {
	const [currentPage, setCurrentPage] = useState(1);
	const [searchTerm, setSearchTerm] = useState("");

	const filteredData = data.filter((item) =>
		Object.values(item).some(
			(value) => typeof value === "string" && value.toLowerCase().includes(searchTerm.toLowerCase())
		)
	);

	const dLen = dataLength ?? filteredData.length;
	const totalPages = Math.ceil(dLen / itemsPerPage);
	const startIndex = (currentPage - 1) * itemsPerPage;
	const endIndex = startIndex + itemsPerPage;
	const currentData = filteredData.slice(startIndex, endIndex);

	useEffect(() => {
		if (atLastPage) {
			if (currentPage === Math.ceil(filteredData.length / itemsPerPage)) {
				atLastPage();
			}
		}
	}, [currentPage]);

	return (
		<div className='space-y-4 p-4'>
			<div className='flex justify-between'>
				<Input
					placeholder='Search...'
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
					className='max-w-sm'
				/>
				<Button>New Item</Button>
			</div>
			<Table className='bg-white w-full rounded-t-lg'>
				<TableHeader>
					<TableRow>
						{columns.map((column) => (
							<TableHead key={column.key}>{column.label}</TableHead>
						))}
					</TableRow>
				</TableHeader>
				<TableBody className='max-h-[80dvh]'>
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
			</Table>
			<div className='flex items-center justify-between'>
				<div>
					Showing {startIndex + 1} to {Math.min(endIndex, filteredData.length)} of {dLen} entries
				</div>
				<div className='flex items-center space-x-2'>
					<Button
						variant='outline'
						size='icon'
						onClick={() => setCurrentPage(1)}
						disabled={currentPage === 1}>
						<ChevronsLeft className='h-4 w-4' />
					</Button>
					<Button
						variant='outline'
						size='icon'
						onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
						disabled={currentPage === 1}>
						<ChevronLeft className='h-4 w-4' />
					</Button>
					<span>
						Page {currentPage} of {totalPages}
					</span>
					<Button
						variant='outline'
						size='icon'
						onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
						disabled={currentPage === totalPages}>
						<ChevronRight className='h-4 w-4' />
					</Button>
					<Button
						variant='outline'
						size='icon'
						onClick={() => setCurrentPage(totalPages)}
						disabled={currentPage === totalPages}>
						<ChevronsRight className='h-4 w-4' />
					</Button>
				</div>
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
