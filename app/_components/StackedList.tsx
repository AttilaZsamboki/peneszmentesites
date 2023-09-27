"use client";
import Link from "next/link";
import React from "react";
import autoAnimate from "@formkit/auto-animate";
import { Filter } from "../products/page";
import { DefaultPagination } from "./Pagination";
import { useRouter, useSearchParams } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { EllipsisVerticalIcon, PlusIcon } from "@heroicons/react/20/solid";
import Menu from "../_components/Menu";
import CustomDialog from "./CustomDialog";
import Input from "./Input";
import { Badge, Tab, Tabs, TabsHeader } from "@material-tailwind/react";
import { Button } from "@/components/ui/button";
import {
	Sheet,
	SheetClose,
	SheetContent,
	SheetDescription,
	SheetFooter,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import AutoComplete from "./AutoComplete";
import { FunnelIcon } from "@heroicons/react/24/outline";

import { ScrollArea } from "@/components/ui/scroll-area";
import useBreakpointValue from "./useBreakpoint";
import { Separator } from "@/components/ui/separator";
import DateRangePicker from "@/components/daterange";
import { createQueryString, isValidDate } from "../_utils/utils";

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

export interface ItemContent {
	title: string;
	subtitle: string;
	subtitle2: string;
	subtitle3?: string;
	subtitle4?: string;
	imgSrc?: string;
	id: string;
	status?: string;
}

type FilterTypes = "text" | "daterange" | "select";

interface DateRange {
	from: Date;
	to: Date;
}

export interface FilterItem {
	id?: number;
	label: string;
	type: FilterTypes;
	field: string;
	options?: Option[];
	value?: string | DateRange;
}

interface Option {
	label: string;
	value: string;
}

export interface PaginationOptions {
	numPages: number;
	active: boolean;
}

export default function StackedList({
	data,
	editType,
	editHref,
	itemContent,
	onEditItem,
	pagination,
	sort = { by: "id", order: "asc" },
	title,
	filters,
}: {
	data: any[];
	editType: "link" | "dialog";
	editHref?: string;
	itemContent: ItemContent;
	onEditItem?: (item: any) => void;
	pagination: PaginationOptions;
	sort?: { by: string; order: "asc" | "desc" };
	title: string;
	filters: FilterItem[];
}) {
	const parent = React.useRef<HTMLUListElement | null>(null);
	const router = useRouter();
	const searchParams = useSearchParams()!;
	const deviceSize = useBreakpointValue();
	const [savedFilters, setSavedFilters] = React.useState<Filter[]>([]);
	const savedFilterFromURL = searchParams.get("selectedFilter")
		? savedFilters.find((filter) => filter.id === parseInt(searchParams.get("selectedFilter") ?? ""))
		: "";
	const [filter, setFilter] = React.useState<Filter>({
		filters: [...filters, { id: 0, field: "filter", value: "", label: "", type: "text" } as FilterItem].map(
			(filter) => {
				const params = new URLSearchParams(searchParams as unknown as string);

				if (params.entries()) {
					for (let [key, value] of params.entries() as any) {
						if (filter.field === key) {
							if (filter.type !== "daterange") {
								return { ...filter, value: value } as FilterItem;
							} else {
								return {
									...filter,
									value: {
										from: new Date(
											JSON.parse(
												value ? (value as unknown as string).replace(/'/g, '"') : "{}"
											).from
										),
										to:
											value && JSON.parse((value as unknown as string).replace(/'/g, '"')).to
												? new Date(
														JSON.parse(
															value
																? (value as unknown as string).replace(/'/g, '"')
																: "{}"
														).to
												  )
												: (null as unknown as Date),
									},
								} as FilterItem;
							}
						}
					}
					return filter;
				}
				return filter;
			}
		) as FilterItem[],
		name: "",
		type: "",
		id: searchParams.get("selectedFilter") ? parseInt(searchParams.get("selectedFilter") ?? "") : 0,
	});
	const search: FilterItem = filter.filters.find((filter) => filter.field === "filter")!;

	const [filteredData, setFilteredData] = React.useState(data);

	React.useEffect(() => {
		if (parent.current) {
			autoAnimate(parent.current);
		}
	}, [parent.current]);

	React.useEffect(() => {
		// if (pagination.active) {
		console.log(
			filter.filters.filter(
				(filter) =>
					filter.value &&
					(filter.type === "daterange"
						? (filter.value as DateRange).from || (filter.value as DateRange).to
						: true)
			)
		);
		router.push(
			`?${filter.filters
				.filter(
					(filter) =>
						filter.value &&
						(filter.type === "daterange"
							? isValidDate((filter.value as DateRange).from) &&
							  isValidDate((filter.value as DateRange).to)
							: true)
				)
				.map((filter) =>
					filter.type !== "daterange"
						? `${filter.field}=${filter.value}`
						: `${filter.field}=${JSON.stringify(filter.value)}`
				)
				.join("&")}${filter.id ? "&selectedFilter=" + filter.id : ""}`,
			{ scroll: false }
		);
	}, [filter]);
	React.useEffect(() => {
		if (savedFilterFromURL) {
			setFilter(savedFilterFromURL);
		}
	}, [savedFilterFromURL]);

	const tailwindColorMap = {
		yellow: "bg-yellow-900",
		red: "bg-red-900",
		green: "bg-green-900",
		blue: "bg-blue-900",
		gray: "bg-gray-900",
	};
	const { toast } = useToast();

	const fetchSavedFilters = async () => {
		const response = await fetch("https://pen.dataupload.xyz/filters?type=" + title);
		if (response.ok) {
			const data: { id: number; name: string; type: string }[] = await response.json();

			setSavedFilters(
				await Promise.all(
					data.map(async (item) => {
						const response = await fetch("https://pen.dataupload.xyz/filter_items?filter=" + item.id);
						if (response.ok) {
							const data: FilterItem[] = await response.json();
							return {
								...item,
								filters: data.map((item) =>
									item.type === "daterange"
										? {
												...item,
												value: {
													from: new Date(
														JSON.parse(
															item.value
																? (item.value as unknown as string).replace(/'/g, '"')
																: "{}"
														).from
													),
													to:
														item.value &&
														JSON.parse((item.value as unknown as string).replace(/'/g, '"'))
															.to
															? new Date(
																	JSON.parse(
																		item.value
																			? (item.value as unknown as string).replace(
																					/'/g,
																					'"'
																			  )
																			: "{}"
																	).to
															  )
															: (null as unknown as Date),
												},
										  }
										: item
								),
							};
						} else {
							return {
								...item,
								filters: filters,
							};
						}
					})
				)
			);
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

	React.useEffect(() => {
		refilterData(filter);
	}, [filter, data]);

	const resetFilter = (exceptSearch: boolean) => {
		setFilter((prev) => ({
			...prev,
			filters: prev.filters.map((item) => {
				if (item.field === "filter" && exceptSearch) {
					return item;
				}
				return { ...item, value: "" };
			}),
		}));
	};

	const createQueryStringCallback = createQueryString(searchParams);

	return (
		<div className='w-full px-5 lg:px-0 lg:w-2/3 flex flex-col gap-3 '>
			<div className='flex flex-row justify-between items-center mb-3 w-full gap-5 mt-5'>
				<div className='mx-auto flex w-full gap-3'>
					<div className='relative flex items-center w-full h-12 bg-white overflow-hidden rounded-md border'>
						<div className='grid place-items-center h-full w-12 text-gray-300'>
							<svg
								xmlns='http://www.w3.org/2000/svg'
								className='h-6 w-6'
								fill='none'
								viewBox='0 0 24 24'
								stroke='currentColor'>
								<path
									stroke-linecap='round'
									stroke-linejoin='round'
									stroke-width='2'
									d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
								/>
							</svg>
						</div>

						<input
							className='peer h-full w-full outline-none text-sm text-gray-700 pr-2'
							type='text'
							id='filter'
							value={search.value as unknown as string}
							placeholder='Keresés...'
							onChange={(e) => {
								const value = e.target.value;
								setFilter((prev) => ({
									...prev,
									filters: [
										...prev.filters.filter((filter) => filter.field !== "filter"),
										{ ...search, value },
									],
								}));
							}}
						/>
					</div>
					<div className='rounded-md'>
						<Sheet>
							<SheetTrigger asChild>
								<div className='flex items-center justify-center relative h-12 w-12 bg-white overflow-hidden rounded-md border cursor-pointer'>
									<FunnelIcon className='w-5 h-5' />
								</div>
							</SheetTrigger>
							<SheetContent>
								<SheetHeader>
									<SheetTitle>Szűrők</SheetTitle>
									<SheetDescription>Itt tudsz egyedi mezőkre szűrni</SheetDescription>
								</SheetHeader>
								<div className='grid gap-4 py-4'>
									{filter.filters
										.filter((filter) => filter.field !== "filter")
										.map(({ field, label, type, options, value }) => {
											const realOptions: { label: string; value: string }[] = options
												? options
												: Array.from(
														new Set(
															filteredData.map((item: any) =>
																item[field] ? item[field].toString().trim() : null
															)
														)
												  )
														.filter((item) => item)
														.map((item) => ({ label: item, value: item }));

											return (
												<div key={field} className='grid grid-cols-4 items-center gap-4'>
													<Label htmlFor='username' className='text-right'>
														{label}
													</Label>
													<div className='col-span-3'>
														<InputOptionChooser
															type={type}
															options={
																pagination.active
																	? value
																		? (value as string).length > 3
																			? realOptions
																			: undefined
																		: undefined
																	: realOptions
															}
															pagination={pagination.active}
															onChange={(value) =>
																setFilter((prev) => ({
																	...prev,
																	filters: prev.filters.map((item) => {
																		if (item.field === field) {
																			return { ...item, value };
																		}
																		return item;
																	}),
																}))
															}
															value={value}
														/>
													</div>
												</div>
											);
										})}
								</div>
								<SheetFooter>
									<SheetClose asChild>
										<Button type='submit'>Alkalmaz</Button>
									</SheetClose>
									<SheetClose asChild>
										<Button type='button' onClick={() => resetFilter(true)} variant='secondary'>
											Mégse
										</Button>
									</SheetClose>
								</SheetFooter>
							</SheetContent>
						</Sheet>
					</div>
				</div>
			</div>
			<FiltersComponent
				filterType={title}
				filter={filter}
				savedFilters={savedFilters}
				setFilter={setFilter}
				setSavedFilters={setSavedFilters}
			/>
			<ScrollArea
				className={`${
					pagination.numPages ? "h-[50dvh] lg:h-[55dvh] pb-0" : "h-[58dvh] lg:h-[63dvh]"
				} rounded-md border p-2 bg-white `}>
				<ul ref={parent} role='list' className='w-full bg-white rounded-lg flex flex-col justify-between'>
					{filteredData
						.sort((a, b) =>
							sort
								? sort.order === "desc"
									? b[itemContent[sort.by as keyof ItemContent] as string] -
									  a[itemContent[sort.by as keyof ItemContent] as string]
									: a[itemContent[sort.by as keyof ItemContent] as string] -
									  b[itemContent[sort.by as keyof ItemContent] as string]
								: 0
						)
						.map((item, index) => {
							if (editType === "link" && editHref) {
								return (
									<Link href={editHref + item[itemContent.id]} key={index}>
										<div
											className={`rounded-none shadow-none border-b ${
												index === 0 ? "rounded-t-md" : ""
											} ${index === data.length - 1 ? "rounded-b-md" : ""}`}>
											<div className='flex justify-between px-6 py-5 bg-white bg-opacity-20 transform'>
												<div className='flex flex-row min-w-0 gap-4'>
													{itemContent.imgSrc ? (
														<img
															className='h-12 w-12 flex-none rounded-full bg-gray-50'
															src={item[itemContent.imgSrc]}
															alt='kep'
														/>
													) : null}
													<div className='min-w-0 flex-auto'>
														<div className='flex flex-row items-center gap-2'>
															<p className='text-sm font-semibold leading-6 text-gray-900'>
																{item[itemContent.title]}
															</p>
															{itemContent.status ? (
																<div
																	className={`${
																		item[
																			itemContent.status ? itemContent.status : ""
																		].className
																	}
																	relative grid items-center font-sans font-bold uppercase whitespace-nowrap select-none py-1 px-2 text-xs rounded-md`}>
																	<div className='absolute top-2/4 -translate-y-2/4 w-4 h-4 left-1'>
																		<span
																			className={
																				`mx-auto mt-1 block h-2 w-2 rounded-full content-[''] ` +
																				tailwindColorMap[
																					item[itemContent.status]
																						.color as keyof typeof tailwindColorMap
																				]
																			}
																		/>
																	</div>
																	<span className='ml-4'>
																		{
																			item[
																				itemContent.status
																					? itemContent.status
																					: ""
																			].name
																		}
																	</span>
																</div>
															) : null}
														</div>

														<p className='mt-1 truncate text-xs leading-5 text-gray-500'>
															{item[itemContent.subtitle]}
														</p>
													</div>
												</div>
												{itemContent.subtitle4 && deviceSize !== "sm" ? (
													<p className='text-sm leading-6 text-gray-900 self-center'>
														{item[itemContent.subtitle4]}
													</p>
												) : null}
												<div className='hidden shrink-0 sm:flex sm:flex-col sm:items-end'>
													<p className='text-sm leading-6 text-gray-900'>
														{item[itemContent.subtitle2]}
													</p>
													{itemContent.subtitle3 ? (
														<p className='mt-1 text-xs leading-5 text-gray-500'>
															{item[itemContent.subtitle3]}
														</p>
													) : null}
												</div>
											</div>
										</div>
									</Link>
								);
							} else if (editType === "dialog") {
								return (
									<DialogItem
										key={index}
										data={data}
										index={index}
										item={item}
										itemContent={itemContent}
										onEditItem={onEditItem}
									/>
								);
							}
						})}
				</ul>
			</ScrollArea>
			{pagination.numPages ? (
				<div className='flex flex-row w-full justify-center mt-5'>
					<DefaultPagination
						numPages={pagination.numPages}
						onPageChange={(page) => {
							router.push("?" + createQueryStringCallback("page", page.toString()), {
								scroll: false,
							});
						}}
					/>
				</div>
			) : null}
		</div>
	);

	function refilterData(f: Filter = filter) {
		console.log(f);
		setFilteredData(
			data.filter((item) => {
				return f.filters
					.filter((filterItem) => filterItem.value)
					.map((filterItem) => {
						if ("text" === filterItem.type || pagination.active) {
							return (filterItem.value as unknown as string)
								.split(" ")
								.map((searchWord: string) =>
									JSON.stringify(filterItem.field === "filter" ? item : item[filterItem.field])
										.toLowerCase()
										.includes(searchWord.toLowerCase())
								)
								.every((item: boolean) => item === true);
						} else if (filterItem.type === "daterange") {
							const value = filterItem.value as DateRange;
							return (
								new Date(item[filterItem.field]) >= value.from &&
								new Date(item[filterItem.field]) <= value.to
							);
						} else if (filterItem.type === "select") {
							return item[filterItem.field] === (filterItem.value as unknown as string);
						}
						return false;
					})
					.every((item: boolean) => item === true);
			})
		);
	}
}

function DialogItem({
	index,
	data,
	item,
	itemContent,
	onEditItem,
}: {
	index: number;
	data: any[];
	item: any;
	itemContent: ItemContent;
	onEditItem?: (item: any) => void;
}) {
	return (
		<div
			className={`rounded-none shadow-none border-b cursor-pointer ${index === 0 ? "rounded-t-md" : ""} ${
				index === data.length - 1 ? "rounded-b-md" : ""
			}`}
			onClick={() => (onEditItem ? onEditItem(item) : null)}>
			<div className='flex px-6 justify-between py-5 bg-white bg-opacity-20 transform'>
				<div className='flex flex-row min-w-0 gap-4'>
					{itemContent.imgSrc ? (
						<img
							className='h-12 w-12 flex-none rounded-full bg-gray-50'
							src={item[itemContent.imgSrc]}
							alt='kep'
						/>
					) : null}
					<div className='min-w-0 flex-auto'>
						<p className='text-sm font-semibold leading-6 text-gray-900'>{item[itemContent.title]}</p>

						<p className='mt-1 truncate text-xs leading-5 text-gray-500'>{item[itemContent.subtitle]}</p>
					</div>
				</div>
				<div className='hidden shrink-0 sm:flex sm:flex-col sm:items-end'>
					<p className='text-sm leading-6 text-gray-900 w-60 truncate text-right'>
						{item[itemContent.subtitle2]}
					</p>
					{itemContent.subtitle3 ? (
						<p className='mt-1 text-xs leading-5 text-gray-500'>{item[itemContent.subtitle3]}</p>
					) : null}
				</div>
			</div>
		</div>
	);
}

function FiltersComponent({
	filter,
	filterType,
	setFilter,
	savedFilters,
	setSavedFilters,
}: {
	filter: Filter;
	filterType: string;
	setFilter: React.Dispatch<React.SetStateAction<Filter>>;
	savedFilters: Filter[];
	setSavedFilters: React.Dispatch<React.SetStateAction<Filter[]>>;
}) {
	const [openSaveFilter, setOpenSaveFilter] = React.useState(false);
	const { toast } = useToast();

	const saveFilter = async () => {
		toast({
			title: "Mentés",
			description: "Ne kattints el! A szűrő mentése folyamatban...",
			variant: "default",
		});
		const response = await fetch("https://pen.dataupload.xyz/filters", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ ...filter, type: filterType }),
		});
		if (response.ok) {
			const data = await response.json();
			const response2 = await fetch("https://pen.dataupload.xyz/filter_items/", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(
					filter.filters.map((item) => {
						const { id, ...rest } = item;
						return { ...rest, filter: data.id };
					})
				),
			});
			if (response2.ok) {
				handleOpenSaveFilter();
				setSavedFilters((prev) => [...prev, { ...filter, id: data.id }]);
				toast({
					title: "Sikeres mentés",
					description: "A szűrő sikeresen el lett mentve",
				});
				return;
			}
			await fetch(`https://pen.dataupload.xyz/filters/${data.id}`, {
				method: "DELETE",
			});
			toast({
				title: "Hiba",
				description: `Hiba történt a szűrő mentése közben. Error: '${response2.statusText}'`,
				variant: "destructive",
			});
			return;
		}
		toast({
			title: "Hiba",
			description: `Hiba történt a szűrő mentése közben. Error:  '${response.statusText}'`,
			variant: "destructive",
		});
		return;
	};

	const handleOpenSaveFilter = () => {
		setFilter((prev) => ({ ...prev, id: 0, name: "" }));
		setOpenSaveFilter(!openSaveFilter);
	};
	React.useEffect(() => {
		const handleKeyDown = async (event: KeyboardEvent) => {
			if (event.ctrlKey && event.key === "s") {
				event.preventDefault(); // Prevents the browser's default save action
				if (savedFilters.length !== 0) {
					if (filter) {
						const resps = await Promise.all(
							filter.filters.map(async (item) => {
								const savedFilter = savedFilters.find((savedFilter) => savedFilter.id === filter.id);
								if (savedFilter) {
									return await onSaveFilter(
										!deepEqual(
											item.value,
											savedFilter.filters.find((fItem) => fItem.id === item.id)
										),
										item,
										filter.id
									);
								}
							})
						);
						if (resps.every((item) => item === true)) {
							toast({
								title: "Sikeres mentés",
								description: "A szűrő sikeresen el lett mentve",
							});
							setSavedFilters((prev) =>
								prev.map((item) => {
									if (item.id === filter.id) {
										return filter;
									}
									return item;
								})
							);
						}
					}
				}
			}
		};

		window.addEventListener("keydown", handleKeyDown);

		return () => {
			window.removeEventListener("keydown", handleKeyDown);
		};
	}, [filter, savedFilters]);

	return (
		<div className='flex flex-row justify-center items-center w-full bg-white rounded-md p-2 border pb-0'>
			<Tabs value={filter.id} className='flex flex-row w-full pl-3 lg:pl-6 items-center gap-3'>
				<TabsHeader
					className='rounded-none bg-transparent p-0 cursor-pointer'
					onClick={() => {
						setFilter((prev) => ({
							filters: prev.filters.map((filter) => ({
								...filter,
								value: filter.type === "daterange" ? undefined : "",
							})),
							name: "",
							type: "",
							id: 0,
						}));
					}}
					indicatorProps={{
						className: "bg-transparent border-b-2 border-gray-900 mx-3 shadow-none rounded-none",
					}}>
					<Tab value={0} className='pb-2'>
						Alap nézet
					</Tab>
					<div className='flex items-center pb-2'>
						<Separator orientation='vertical' className='mx-2 ml-4' />
					</div>
				</TabsHeader>
				{savedFilters
					.sort((a, b) => a.id - b.id)
					.map((savedFilter) => {
						const isNotEqual =
							savedFilter.id === filter.id && JSON.stringify(savedFilter) !== JSON.stringify(filter);

						return (
							<TabsHeader
								key={savedFilter.id}
								className='rounded-none bg-transparent p-0 cursor-pointer'
								indicatorProps={{
									className:
										"bg-transparent border-b-2 border-gray-900 mx-3 shadow-none rounded-none",
								}}
								onClick={() => {
									setFilter(savedFilter);
								}}>
								<Badge
									key={savedFilter.id}
									className={`${isNotEqual ? "" : "opacity-0"} mt-2`}
									color='red'>
									<Tab value={savedFilter.id} className='pb-2'>
										{savedFilter.name}
									</Tab>
								</Badge>
								<div className='flex items-center pb-2'>
									<Menu
										onDelete={async () => {
											const response = await fetch(
												`https://pen.dataupload.xyz/filters/${savedFilter.id}`,
												{
													method: "DELETE",
												}
											);
											if (response.ok) {
												setSavedFilters((prev) =>
													prev.filter((item) => item.id !== savedFilter.id)
												);
											} else {
												toast({
													title: "Hiba",
													description: "Hiba történt a szűrő törlése közben",
												});
											}
										}}
										onSave={async () => {
											const resps = await Promise.all(
												filter.filters.map(
													async (f) => await onSaveFilter(isNotEqual, f, filter.id)
												)
											);

											if (resps.every((item) => item === true)) {
												toast({
													title: "Sikeres mentés",
													description: "A szűrő sikeresen el lett mentve",
												});
												return;
											}
											toast({
												title: "Hiba",
												description: `Hiba történt a szűrő mentése közben`,
												variant: "destructive",
											});
										}}>
										<EllipsisVerticalIcon className='w-5 h-5' />
									</Menu>
									<Separator orientation='vertical' className='mx-2 ml-4' />
								</div>
							</TabsHeader>
						);
					})}
				<TabsHeader
					className='rounded-none bg-transparent p-0 cursor-pointer relative inline-flex items-center'
					onClick={handleOpenSaveFilter}
					indicatorProps={{
						className: "bg-transparent border-b-2 border-gray-900 mx-3 shadow-none rounded-none",
					}}>
					<PlusIcon className='w-5 h-5' />
				</TabsHeader>
			</Tabs>
			<CustomDialog
				onSave={saveFilter}
				open={openSaveFilter}
				title='Nézet mentése'
				handler={handleOpenSaveFilter}>
				<Input
					label='Nézet neve'
					value={filter.name}
					onChange={(e) => setFilter((prev) => ({ ...prev, name: e.target.value }))}
				/>
			</CustomDialog>
		</div>
	);

	async function onSaveFilter(isNotEqual: boolean, filter: FilterItem, filterId: number) {
		if (isNotEqual) {
			const resp = await fetch(`https://pen.dataupload.xyz/filter_items/${filter.id}/`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					...filter,
					filter: filterId,
					value: filter.type === "daterange" ? JSON.stringify(filter.value) : filter.value,
				}),
			});
			if (resp.ok) {
				return true;
			}
			return false;
		} else {
			toast({
				title: "Nincs változás",
				description: "Nem történt változás a szűrőben",
			});
		}
	}
}

function InputOptionChooser({
	type,
	options,
	value,
	onChange,
	pagination = false,
}: {
	type: FilterTypes;
	options?: Option[];
	value?: string | DateRange;
	onChange: (value: string | DateRange) => void;
	pagination?: boolean;
}) {
	if (type === "text") {
		return (
			<Input
				value={value ? (value as unknown as string) : ""}
				onChange={(e) => {
					onChange(e.target.value);
				}}
			/>
		);
	} else if (type === "select") {
		if (!options && !pagination) return null;
		return (
			<AutoComplete
				value={
					pagination
						? value
							? (value as unknown as string)
							: ""
						: options!.find((option) => option.value === value)
						? options!.find((option) => option.value === value)!.label
						: value
						? (value as unknown as string)
						: ""
				}
				onChange={onChange}
				options={options ? options : []}
				showOptions={pagination ? (value ? (value as string).length > 3 : false) : true}
				updateOnQueryChange={pagination}
			/>
		);
	} else if (type === "daterange") {
		if (typeof value === "string") return null;
		return (
			<DateRangePicker
				value={value ? value : { from: new Date(), to: new Date() }}
				onChange={(value) => {
					if (value) {
						if (value.to) {
							value.to.setHours(23);
							value.to.setMinutes(59);
							value.to.setSeconds(59);
							value.to.setMilliseconds(999);
						}
					}
					onChange(value);
				}}
			/>
		);
	}
}
