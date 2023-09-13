"use client";
import StackedList, { ItemContent } from "../_components/StackedList";
import Heading from "../_components/Heading";
import React from "react";
import Link from "next/link";
import { Badge, Button, Card, CardHeader, List, ListItem, Typography } from "@material-tailwind/react";
import { Filter } from "../products/page";
import { useGlobalState } from "../_clientLayout";
import { EllipsisVerticalIcon, PlusIcon } from "@heroicons/react/20/solid";
import Menu from "../_components/Menu";
import CustomDialog from "./CustomDialog";
import Input from "./Input";
import { useSearchParams } from "next/navigation";

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

export default function BaseComponentV2({
	data,
	title,
	editHref,
	editType,
	itemContent,
	createButtonTitle,
	createPath,
	onCreateNew,
	onEditItem,
	pagination = { numPages: 0 },
}: {
	data: any;
	title: string;
	editHref?: string;
	itemContent: ItemContent;
	editType: "link" | "dialog";
	createButtonTitle?: string;
	createPath?: string;
	onCreateNew?: () => void;
	onEditItem?: (item: any) => void;
	pagination?: { numPages: number };
}) {
	const searchParams = useSearchParams();
	const [search, setSearch] = React.useState<Filter>({ id: 0, name: "", value: searchParams.get("filter") || "" });
	const [savedFilters, setSavedFilters] = React.useState<Filter[]>([]);

	React.useEffect(() => {
		const fetchSavedFilters = async () => {
			setSavedFilters(await fetch("https://pen.dataupload.xyz/filters?type=" + title).then((res) => res.json()));
		};
		fetchSavedFilters();
	}, []);

	return (
		<main className='flex min-h-screen flex-col items-center justify-start w-full'>
			<div className='flex flex-col items-center justify-start w-full border-b'>
				<div className='w-2/3 flex flex-row justify-between py-0'>
					<Heading border={false} width='w-full' title={title} marginY='mt-11 mb-8' variant='h2'>
						{createButtonTitle ? (
							createPath ? (
								<Link href={createPath}>
									<div className='flex flex-row justify-end w-full relative top-3 z-50 items-center gap-3'>
										<Button className='w-36 h-10 flex items-center justify-center py-4 rounded-md hover:shadow-none shadow-none'>
											{createButtonTitle}
										</Button>
									</div>
								</Link>
							) : (
								<div onClick={onCreateNew}>
									<div className='flex flex-row justify-end w-full relative top-3 z-50 items-center gap-3'>
										<Button className='w-36 h-10 flex items-center justify-center py-4 rounded-md hover:shadow-none shadow-none'>
											{createButtonTitle}
										</Button>
									</div>
								</div>
							)
						) : null}
					</Heading>
				</div>
			</div>
			<div className='flex flex-row justify-center w-full'>
				<StackedList
					onEditItem={onEditItem}
					search={search}
					setSearch={setSearch}
					data={data}
					editHref={editHref}
					editType={editType}
					itemContent={itemContent}
					pagination={pagination}
				/>
				<FiltersComponent
					filterType={title}
					filters={search}
					savedFilters={savedFilters}
					setFilters={setSearch}
					setSavedFilters={setSavedFilters}
				/>
			</div>
		</main>
	);
}

function FiltersComponent({
	filters,
	filterType,
	setFilters,
	savedFilters,
	setSavedFilters,
}: {
	filters: Filter;
	filterType: string;
	setFilters: React.Dispatch<React.SetStateAction<Filter>>;
	savedFilters: Filter[];
	setSavedFilters: React.Dispatch<React.SetStateAction<Filter[]>>;
}) {
	const { setAlert } = useGlobalState();
	const [openSaveFilter, setOpenSaveFilter] = React.useState(false);

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
			const data = await response.json();
			setSavedFilters((prev) => [...prev, { ...filters, id: data.id }]);
		}
	};

	const handleOpenSaveFilter = () => {
		setFilters((prev) => ({ id: 0, name: "", value: prev.value }));
		setOpenSaveFilter(!openSaveFilter);
	};

	React.useEffect(() => {
		const handleKeyDown = async (event: KeyboardEvent) => {
			if (event.ctrlKey && event.key === "s") {
				event.preventDefault(); // Prevents the browser's default save action
				if (savedFilters.length !== 0) {
					const filter = savedFilters.find((item) => item.id === filters.id);
					if (filter) {
						await onSaveFilter(!deepEqual(filters.value, filter.value), filters);
					}
				}
			}
		};

		window.addEventListener("keydown", handleKeyDown);

		// Cleanup on unmount
		return () => {
			window.removeEventListener("keydown", handleKeyDown);
		};
	}, [filters, savedFilters]);

	return (
		<>
			<div className='flex flex-row justify-center relative top-5'>
				<div className='flex flex-col items-center w-full mx-4'>
					<Card className='w-full rounded-md shadow-none border'>
						<List>
							<ListItem
								onClick={() => setFilters({ id: 0, name: "", value: "" })}
								className='active:bg-white hover:bg-white after:bg-white before:bg-white bg-white'>
								<div className='flex flex-row justify-center items-center w-full'>
									<Typography color='gray' variant='h5'>
										Filter visszaállítása
									</Typography>
								</div>
							</ListItem>
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
													setFilters({
														id: filter.id,
														value: filter.value,
														name: filter.name,
													});
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
													onSave={async () => await onSaveFilter(isNotEqual, filter)}
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
							<ListItem
								ripple={false}
								className='hover:bg-white active:bg-white after:bg-white before:bg-white'
								onClick={handleOpenSaveFilter}>
								<div className='cursor-pointer flex justify-center items-center flex-row w-full'>
									<PlusIcon className='w-5 h-5' />
								</div>
							</ListItem>
						</List>
					</Card>
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
		</>
	);

	async function onSaveFilter(isNotEqual: boolean, filter: Filter) {
		if (isNotEqual) {
			const response = await fetch(`https://pen.dataupload.xyz/filters/${filter.id}/`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					...filters,
				}),
			});
			if (response.ok) {
				setSavedFilters((prev) => prev.map((item) => (item.id === filter.id ? filters : item)));
			}
		} else {
			setAlert({
				level: "information",
				message: "Nincs változás a filterben",
			});
		}
	}
}
