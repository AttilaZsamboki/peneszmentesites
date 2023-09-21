"use client";
import StackedList, { ItemContent } from "../_components/StackedList";
import Heading from "../_components/Heading";
import React from "react";
import Link from "next/link";
import { Badge, List, ListItem } from "@material-tailwind/react";
import { Card, CardTitle, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Filter } from "../products/page";
import { useGlobalState } from "../_clientLayout";
import { EllipsisVerticalIcon, PlusIcon } from "@heroicons/react/20/solid";
import Menu from "../_components/Menu";
import CustomDialog from "./CustomDialog";
import Input from "./Input";
import { useSearchParams } from "next/navigation";
import { Eraser } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { breakpoints } from "../_utils/utils";
import useBreakpointValue from "./useBreakpoint";

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
	sort,
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
	sort?: { by: string; order: "asc" | "desc" };
}) {
	const { toast } = useToast();
	const searchParams = useSearchParams();
	const [search, setSearch] = React.useState<Filter>({ id: 0, name: "", value: searchParams.get("filter") || "" });
	const [savedFilters, setSavedFilters] = React.useState<Filter[]>([]);
	const deviceWidth = useBreakpointValue();

	const fetchSavedFilters = async () => {
		const response = await fetch("https://pen.dataupload.xyz/filters?type=" + title);
		if (response.ok) {
			setSavedFilters(await response.json());
			return;
		}
		toast({
			title: "Hiba",
			description: "Hiba történt a szűrők betöltése közben",
			variant: "destructive",
			action: (
				<ToastAction altText='Try again' onClick={fetchSavedFilters}>
					Újrapróbálkozás
				</ToastAction>
			),
		});
	};
	React.useEffect(() => {
		fetchSavedFilters();
	}, []);

	return (
		<main className='flex min-h-screen flex-col items-center justify-start w-full'>
			<div className='flex flex-col items-center justify-start w-full border-b bg-white'>
				<div className='lg:w-2/3 flex flex-row justify-between py-0'>
					<Heading border={false} width='w-full' title={title} marginY='mt-11 mb-8' variant='h2'>
						{createButtonTitle ? (
							createPath ? (
								<Link href={createPath}>
									<div className='flex flex-row justify-end w-full relative top-3 z-50 items-center gap-3'>
										<Button className='w-36 h-10 flex items-center justify-center py-4 rounded-md hover:shadow-none shadow-none font-semibold uppercase'>
											{createButtonTitle}
										</Button>
									</div>
								</Link>
							) : (
								<div onClick={onCreateNew}>
									<div className='flex flex-row justify-end w-full relative top-3 z-50 items-center gap-3'>
										<Button className='w-36 h-10 flex items-center justify-center py-4 rounded-md hover:shadow-none shadow-none font-semibold uppercase'>
											{createButtonTitle}
										</Button>
									</div>
								</div>
							)
						) : null}
					</Heading>
				</div>
			</div>
			<div className='flex flex-row justify-center w-full flex-wrap'>
				<StackedList
					onEditItem={onEditItem}
					search={search}
					setSearch={setSearch}
					data={data}
					editHref={editHref}
					editType={editType}
					itemContent={itemContent}
					pagination={pagination}
					sort={sort}
				/>
				{deviceWidth !== "sm" ? (
					<FiltersComponent
						filterType={title}
						filters={search}
						savedFilters={savedFilters}
						setFilters={setSearch}
						setSavedFilters={setSavedFilters}
					/>
				) : null}
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
	const [openSaveFilter, setOpenSaveFilter] = React.useState(false);
	const { toast } = useToast();

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

		return () => {
			window.removeEventListener("keydown", handleKeyDown);
		};
	}, [filters, savedFilters]);

	return (
		<>
			<div className='flex flex-row justify-center relative top-5 opacity-0 lg:opacity-100'>
				<div className='flex flex-col items-center w-full mx-4'>
					<Card className='p-2'>
						<List>
							<CardHeader>
								<div className='flex gap-5 flex-row w-full items-center justify-between'>
									<CardTitle>Filterek</CardTitle>
									<Eraser
										className='w-5 h-5 text-gray cursor-pointer'
										onClick={() => setFilters({ id: 0, name: "", value: "" })}
									/>
								</div>
							</CardHeader>
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
			toast({
				title: "Nincs változás",
				description: "Nem történt változás a szűrőben",
			});
		}
	}
}
