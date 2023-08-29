"use client";
import { Filters } from "../products/page";
import { AgGridReact } from "ag-grid-react";
import React from "react";

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-material.css";
import Heading from "./Heading";
import {
	Button,
	Dialog,
	Card,
	CardHeader,
	CardBody,
	CardFooter,
	Typography,
	Checkbox,
	List,
	ListItem,
	Badge,
} from "@material-tailwind/react";

import { EllipsisVerticalIcon, PencilSquareIcon, PlusIcon, TrashIcon } from "@heroicons/react/20/solid";
import { useGlobalState } from "../_clientLayout";
import Input from "../_components/Input";
import Menu from "../_components/Menu";
import Link from "next/link";

function deepEqual(a: any, b: any) {
	if (a === b) {
		return true;
	}

	if (typeof a !== "object" || typeof b !== "object" || a === null || b === null) {
		return false;
	}

	const keysA = Object.keys(a);
	const keysB = Object.keys(b);

	if (keysA.length !== keysB.length) {
		return false;
	}

	for (let key of keysA) {
		if (!keysB.includes(key) || !deepEqual(a[key], b[key])) {
			return false;
		}
	}

	return true;
}

export default function BaseComponent({
	data,
	title,
	createForm,
	onCreate,
	columnDefs,
	updateForm,
	onUpdate,
	setSelectedRow,
	selectedRow,
	onDelete,
	filterType,
	redirectEdit,
	onCancelCreate,
}: {
	data: any[];
	title: string;
	filterType: string;
	createForm?: React.ReactNode;
	onCreate?: () => void;
	columnDefs: any[];
	updateForm?: React.ReactNode;
	onUpdate?: () => void;
	setSelectedRow?: any;
	selectedRow?: any;
	onDelete?: () => void;
	redirectEdit?: string;
	onCancelCreate?: () => void;
}) {
	const { setAlert } = useGlobalState();

	const gridRef = React.useRef<any>();

	const [columnsDefs, setColumnDefs] = React.useState(columnDefs);
	const [openSaveFilter, setOpenSaveFilter] = React.useState(false);
	const [filters, setFilters] = React.useState<Filters>({ id: 0, name: "", value: {} });
	const [savedFilters, setSavedFilters] = React.useState<Filters[]>([]);
	const [openCreate, setOpenCreate] = React.useState(false);
	const [openUpdate, setOpenUpdate] = React.useState(false);

	React.useEffect(() => {
		setSavedFilters(savedFilters);
	}, [savedFilters]);
	React.useEffect(() => {
		const fetchFilters = async () => {
			const filterResponse = await fetch(`https://pen.dataupload.xyz/filters?type=${filterType}`, {
				cache: "no-store",
			});
			const filterData: Filters[] = await filterResponse.json();
			setSavedFilters(filterData);
		};
		fetchFilters();
	}, []);

	const gridOptions = {
		defaultColDef: {
			sortable: true,
			filter: true,
			resizable: true,
			floatingFilter: true,
			flex: 1,
			suppressMovable: true,
		},
		columnsDefs: columnsDefs,
		onGridReady: (params: any) => {
			params.api.setFilterModel(savedFilters);
		},
	};
	const AG_GRID_LOCALE_HU = {
		contains: "Tartalmazza",
		notContains: "Nem tartalmazza",
		equals: "Egyenlő",
		notEqual: "Nem egyenlő",
		startsWith: "Kezdődik",
		endsWith: "Végződik",
		blank: "Üres",
		notBlank: "Nem üres",
		page: "Oldal",
		of: " / ",
		and: "és",
		or: "vagy",
		andCondition: "ÉS",
		orCondition: "VAGY",
	};

	const handleOpenSaveFilter = () => {
		setFilters((prev) => ({ id: 0, name: "", value: prev.value }));
		setOpenSaveFilter(!openSaveFilter);
	};
	const handleOpenCreate = () => {
		setOpenCreate(!openCreate);
	};
	const handleOpenUpdate = () => {
		setOpenUpdate(!openUpdate);
	};

	const saveFilter = async () => {
		const response = await fetch("https://pen.dataupload.xyz/filters", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ ...filters, type: filterType }),
		});
		if (response.ok) {
			handleOpenSaveFilter();
			setSavedFilters((prev) => [...prev, filters]);
		}
	};
	return (
		<>
			<div className='flex min-h-screen flex-col items-center justify-start w-full'>
				<Heading title={title} variant='h2'>
					<div className='flex flex-row justify-end w-full relative z-50 items-center pr-10 gap-3'>
						{onDelete ? (
							<Button color='red' onClick={onDelete} disabled={!selectedRow}>
								<TrashIcon className='w-5 h-5' />
							</Button>
						) : (
							<></>
						)}
						{createForm ? (
							<Button color='gray' variant='outlined' onClick={handleOpenCreate}>
								<PlusIcon className='w-5 h-5 text-gray-900' />
							</Button>
						) : (
							<></>
						)}
						{updateForm ? (
							<Button color='blue-gray' onClick={handleOpenUpdate} disabled={!selectedRow}>
								<PencilSquareIcon className='w-5 h-5' />
							</Button>
						) : (
							<></>
						)}
						{redirectEdit ? (
							<Link href={redirectEdit}>
								<Button color='blue-gray'>
									<PencilSquareIcon className='w-5 h-5' />
								</Button>
							</Link>
						) : (
							<></>
						)}
					</div>
				</Heading>
				<div className='h-full w-full flex flex-row'>
					<div className='w-full h-full flex'>
						<div className='ag-theme-material w-full border mb-5 bg-white -mt-10 ml-10'>
							<AgGridReact
								columnDefs={columnsDefs as unknown as any}
								rowData={data}
								animateRows={true}
								rowSelection='single'
								gridOptions={gridOptions}
								localeText={AG_GRID_LOCALE_HU}
								onFilterChanged={(e) => {
									setFilters((prev) => ({ ...prev, value: e.api.getFilterModel() }));
								}}
								pagination
								onSelectionChanged={(e) =>
									setSelectedRow ? setSelectedRow(e.api.getSelectedRows()) : {}
								}
								ref={gridRef}
							/>
						</div>
					</div>

					<div className='flex flex-row justify-center w-1/3 relative bottom-5'>
						<div className='flex flex-col items-center w-full mx-4'>
							<Card className='w-full'>
								<CardHeader
									color='gray'
									variant='gradient'
									className='py-2 flex justify-between flex-row items-center px-2 text-center'>
									<Typography variant='h5'>Filterek</Typography>
									<div
										className={`${Object.keys(filters.value).length === 0 ? "" : "cursor-pointer"}`}
										onClick={() =>
											Object.keys(filters.value).length === 0 ? {} : handleOpenSaveFilter()
										}>
										<PlusIcon
											className={`w-6 ${
												Object.keys(filters.value).length === 0 ? "opacity-0" : "text-white"
											} h-6`}
										/>
									</div>
								</CardHeader>
								<List>
									{savedFilters
										.sort((a, b) => a.id - b.id)
										.map((filter) => {
											const isNotEqual =
												filters.id === filter.id && !deepEqual(filters.value, filter.value);
											return (
												<Badge
													key={filter.id}
													className={`${isNotEqual ? "" : "opacity-0"}`}
													color='red'>
													<ListItem
														selected={filters.id === filter.id}
														ripple={false}
														onClick={() => {
															gridRef.current.api.setFilterModel(filter.value);
															setFilters(filter);
														}}>
														<div className='cursor-pointer'>{filter.name}</div>
													</ListItem>
													<div className='flex items-center'>
														<Menu
															onDelete={async () => {
																const response = await fetch(
																	`https://pen.dataupload.xyz/filters/${filter.id}`,
																	{
																		method: "DELETE",
																	}
																);
																if (response.ok) {
																	setSavedFilters((prev) =>
																		prev.filter((item) => item.id !== filter.id)
																	);
																}
															}}
															onSave={async () => {
																if (isNotEqual) {
																	const response = await fetch(
																		`https://pen.dataupload.xyz/filters/${filter.id}/`,
																		{
																			method: "PUT",
																			headers: {
																				"Content-Type": "application/json",
																			},
																			body: JSON.stringify({
																				...filters,
																			}),
																		}
																	);
																	if (response.ok) {
																		setSavedFilters((prev) =>
																			prev.map((item) =>
																				item.id === filter.id ? filters : item
																			)
																		);
																	}
																} else {
																	setAlert({
																		level: "information",
																		message: "Nincs változás a filterben",
																	});
																}
															}}
															onDuplicate={async () => {
																const response = await fetch(
																	"https://pen.dataupload.xyz/filters",
																	{
																		method: "POST",
																		headers: {
																			"Content-Type": "application/json",
																		},
																		body: JSON.stringify({
																			...filter,
																			id: 0,
																			name: `${filter.name} másolat`,
																		}),
																	}
																);
																if (response.ok) {
																	const data = await response.json();
																	setSavedFilters((prev) => [
																		...prev,
																		{ ...data, name: `${data.name}` },
																	]);
																}
															}}>
															<EllipsisVerticalIcon className='w-5 h-5' />
														</Menu>
													</div>
												</Badge>
											);
										})}
								</List>
							</Card>
						</div>
					</div>
				</div>
			</div>
			<CustomDialog
				onSave={saveFilter}
				open={openSaveFilter}
				title='Filter mentése'
				handler={handleOpenSaveFilter}>
				<Input
					label='Filter neve'
					value={filters.name}
					onChange={(e) => setFilters((prev) => ({ ...prev, name: e.target.value }))}
				/>
			</CustomDialog>

			<CustomDialog
				open={openCreate}
				handler={handleOpenCreate}
				title={"Új " + title.slice(0, -2)}
				onSave={onCreate}
				onCancel={onCancelCreate}>
				{createForm}
			</CustomDialog>
			<CustomDialog
				open={openUpdate}
				handler={handleOpenUpdate}
				title={title.slice(0, -2) + " szerkesztése"}
				onSave={onUpdate}>
				{updateForm}
			</CustomDialog>
		</>
	);
}

function CustomDialog({
	open,
	handler,
	children,
	onSave,
	title,
	onCancel,
}: {
	open: boolean;
	handler: () => void;
	children: React.ReactNode;
	onSave?: () => void;
	title: string;
	onCancel?: () => void;
}) {
	return (
		<Dialog size='lg' open={open} handler={handler} className='bg-transparent shadow-none'>
			<Card className='mx-auto w-full max-w-full max-h-[70%]'>
				<CardHeader variant='gradient' color='gray' className='mb-4 pl-4 grid h-28 place-items-center '>
					<Typography variant='h4' color='white' className='text-left'>
						{title}
					</Typography>
				</CardHeader>
				<CardBody className='flex flex-col gap-4 overflow-y-scroll h-[70%]'>{children}</CardBody>
				<CardFooter>
					<div className='flex flex-row justify-end w-full gap-5'>
						<Button
							color='green'
							onClick={() => {
								onSave ? onSave() : {};
								handler();
							}}>
							Mentés
						</Button>
						<Button
							variant='outlined'
							onClick={() => {
								handler();
								onCancel ? onCancel() : {};
							}}>
							Mégsem
						</Button>
					</div>
				</CardFooter>
			</Card>
		</Dialog>
	);
}
