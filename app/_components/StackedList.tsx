"use client";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
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
import autoAnimate from "@formkit/auto-animate";
import { EllipsisVerticalIcon, PlusIcon } from "@heroicons/react/20/solid";
import { FunnelIcon } from "@heroicons/react/24/outline";
import { Badge, Tab, Tabs, TabsHeader } from "@material-tailwind/react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import React from "react";
import { toast } from "sonner";
import Menu from "../_components/Menu";
import { Filter } from "../products/page";
import AutoComplete from "./AutoComplete";
import CustomDialog from "./CustomDialog";
import { DefaultPagination } from "./Pagination";

import DateRangePicker from "@/components/daterange";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useUser } from "@auth0/nextjs-auth0/client";
import { isValidDate, useCreateQueryString } from "../_utils/utils";
import useBreakpointValue from "./useBreakpoint";
import { DataGridComponent } from "@/components/data-grid";
import { ColDef } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";

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

export interface DateRange {
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

export interface Sort {
	by: string;
	order: "asc" | "desc";
}

export default function StackedList({
	data,
	editType,
	editHref,
	itemContent,
	onEditItem,
	pagination,
	title,
	filters,
	savedFiltersOriginal,
	defaultViewName,
	variant,
	columns,
}: {
	data: any[];
	editType: "link" | "dialog";
	editHref?: string;
	itemContent: ItemContent;
	onEditItem?: (item: any) => void;
	pagination: PaginationOptions;
	title: string;
	filters: FilterItem[];
	savedFiltersOriginal?: Filter[];
	defaultViewName?: string;
	variant?: "default" | "grid";
	columns?: ColDef[];
}) {
	const parent = React.useRef<HTMLUListElement | null>(null);
	const router = useRouter();
	const searchParams = useSearchParams()!;
	const deviceSize = useBreakpointValue();
	const [savedFilters, setSavedFilters] = React.useState<Filter[]>(savedFiltersOriginal ? savedFiltersOriginal : []);
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
		sort_by: searchParams.get("sort_by") ?? "id",
		sort_order: (searchParams.get("sort_order") as "asc" | "desc") ?? "desc",
	});
	const search: FilterItem = filter.filters.find((filter) => filter.field === "filter")!;

	const [filteredData, setFilteredData] = React.useState(data);
	const gridRef = React.useRef<AgGridReact>(null);
	const { user } = useUser();

	React.useEffect(() => {
		if (parent.current) {
			autoAnimate(parent.current);
		}
	}, [parent.current]);

	React.useEffect(() => {
		const params = new URLSearchParams();

		filter.filters.forEach((filter) => {
			if (
				filter.value &&
				(filter.type !== "daterange" ||
					(isValidDate((filter.value as DateRange).from) && isValidDate((filter.value as DateRange).to)))
			) {
				params.append(
					filter.field,
					filter.type === "daterange" ? JSON.stringify(filter.value) : (filter.value as string)
				);
			}
		});

		if (filter.id) {
			params.append("selectedFilter", filter.id.toString());
		}

		if (filter.sort_by) {
			params.append("sort_by", filter.sort_by);
		}

		if (filter.sort_order) {
			params.append("sort_order", filter.sort_order);
		}

		router.push(`?${params.toString()}`, { scroll: false });
	}, [filter, router]);

	React.useEffect(() => {
		if (savedFilterFromURL) {
			setFilter(savedFilterFromURL);
		}
	}, [savedFilterFromURL]);

	React.useEffect(() => {
		if (gridRef.current?.api) {
			if (savedFilterFromURL) {
				const filterModel = savedFilterFromURL.filters.reduce((acc, f) => {
					(acc as Record<string, any>)[f.field] = { filterType: "text", type: "contains", filter: f.value };
					return acc;
				}, {});
				gridRef.current?.api.setFilterModel(filterModel);
			} else {
				gridRef.current?.api.setFilterModel({});
			}
		}
	}, [savedFilterFromURL, gridRef]);

	const tailwindColorMap = {
		yellow: "bg-yellow-900",
		red: "bg-red-900",
		green: "bg-green-900",
		blue: "bg-blue-900",
		gray: "bg-gray-900",
	};

	React.useEffect(() => {
		if (savedFiltersOriginal?.length || !user?.sub) {
			return;
		}

		const savedFilters = async () => {
			const resp = await fetchSavedFilters(title, user.sub ?? "", filters);
			if (resp === "Error" || !resp) {
				toast.error("Hiba", {
					description: "Hiba történt a szűrők betöltése közben",
					action: {
						label: "Újrapróbálkozás",
						onClick: () => fetchSavedFilters(title, user.sub ?? "", filters),
					},
				});
				return;
			}
			setSavedFilters(resp);
		};
		savedFilters();
	}, [user?.sub]);

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

	const createQueryStringCallback = useCreateQueryString(searchParams);

	return (
		<div className='w-full px-5 lg:px-0 flex flex-col'>
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
									strokeLinecap='round'
									strokeLinejoin='round'
									strokeWidth='2'
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
								{pagination.numPages ? null : (
									<>
										<Separator className='my-4' />
										<SheetHeader>
											<SheetTitle>Sorrend</SheetTitle>
											<SheetDescription>
												Itt tudod meghatározni mi szerint legyenek az adatok besorolva
											</SheetDescription>
										</SheetHeader>
										<div className='grid gap-4 py-4 pb-10'>
											<div className='grid grid-cols-4 items-center gap-4'>
												<Label htmlFor='order-field' className='text-right'>
													Mező
												</Label>
												<div id='order-field' className='col-span-3'>
													<AutoComplete
														options={filter.filters
															.filter((filter) => filter.label)
															.map((filter) => ({
																label: filter.label,
																value: filter.field,
															}))}
														value={filter.sort_by}
														onSelect={(value) => {
															setFilter((prev) => ({
																...prev,
																sort_by: value,
															}));
														}}
													/>
												</div>
											</div>
											<div className='grid grid-cols-4 items-center gap-4'>
												<Label htmlFor='order' className='text-right'>
													Típus
												</Label>
												<div id='order' className='col-span-3'>
													<AutoComplete
														options={[
															{ label: "Növekvő", value: "asc" },
															{ label: "Csökkenő", value: "desc" },
														]}
														value={filter.sort_order}
														deselectable={false}
														onSelect={(value) => {
															setFilter((prev) => ({
																...prev,
																sort_order: value as "asc" | "desc",
															}));
														}}
													/>
												</div>
											</div>
										</div>
									</>
								)}
								<SheetFooter className='flex flex-row w-full space-x-2 justify-end items-center'>
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
			<div className='flex flex-row justify-center px-4 items-center w-full bg-white rounded-t-lg p-2 border-b pb-0 '>
				<FiltersComponent
					defaultViewName={defaultViewName}
					filterType={title}
					filter={filter}
					savedFilters={savedFilters}
					setFilter={setFilter}
					setSavedFilters={setSavedFilters}
				/>
			</div>
			{variant === "default" ? (
				<ScrollArea
					className={`${
						pagination.numPages ? "h-[50dvh] lg:h-[64dvh] pb-0" : "h-[57dvh] lg:h-[66dvh]"
					} rounded-b-md border-t p-2 bg-white `}>
					<ul ref={parent} role='list' className='w-full bg-white rounded-lg flex flex-col justify-between'>
						{filteredData
							.sort((a, b) => {
								if (!filter.sort_by) {
									return a.id - b.id;
								}
								if (typeof a[filter.sort_by] === "string") {
									return filter.sort_order === "desc"
										? b[filter.sort_by]?.toString().localeCompare(a[filter.sort_by]?.toString())
										: a[filter.sort_by]?.localeCompare(b[filter.sort_by]);
								} else {
									return filter.sort_order === "desc"
										? b[filter.sort_by] - a[filter.sort_by]
										: a[filter.sort_by] - b[filter.sort_by];
								}
							})
							.map((item, index) => {
								if (editType === "link" && editHref) {
									return (
										<Link href={editHref + item[itemContent.id]} key={index}>
											<div
												className={cn(
													"rounded-none shadow-none",
													index === 0 ? "rounded-t-md" : "",
													index === data.length - 1 ? "rounded-b-md" : "border-b"
												)}>
												<div className='flex justify-between px-6 py-5 bg-white bg-opacity-20 transform'>
													<div className='flex flex-row min-w-0 gap-4'>
														{itemContent.imgSrc ? (
															<Avatar>
																<AvatarImage src={item[itemContent.imgSrc]} />
																<AvatarFallback>kep</AvatarFallback>
															</Avatar>
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
																				itemContent.status
																					? itemContent.status
																					: ""
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
			) : columns ? (
				<DataGridComponent
					data={filteredData}
					columns={columns}
					itemsPerPage={100}
					onFilterModified={(event) => {
						setFilter((prev) => ({
							...prev,
							filters: prev.filters.map((item) => {
								const colName = event.columns[0]?.getColId();
								if (item.field === colName) {
									if (item.type === "text") {
										return { ...item, value: event.api.getFilterModel()[colName]?.filter };
									} else if (item.type === "select") {
										const value = item.options?.filter((o) =>
											o.label.includes(event.api.getFilterModel()[colName]?.filter)
										);
										return { ...item, value: value?.[0]?.value };
									}
								}
								return item;
							}),
						}));
					}}
					gridRef={gridRef}
				/>
			) : null}
			{pagination.numPages ? (
				<div className='flex flex-row w-full justify-center mt-5'>
					<DefaultPagination
						numPages={pagination.numPages}
						onPageChange={(page) => {
							router.push("?" + createQueryStringCallback([{ name: "page", value: page.toString() }]), {
								scroll: false,
							});
						}}
					/>
				</div>
			) : null}
		</div>
	);

	function refilterData(f: Filter = filter) {
		setFilteredData(
			data.filter((item) => {
				return f.filters
					.filter((filterItem) => filterItem.value)
					.map((filterItem) => {
						if ("text" === filterItem.type) {
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

export function FiltersComponent({
	filter,
	filterType,
	setFilter,
	savedFilters,
	setSavedFilters,
	defaultViewName,
	saveFilterComponent = (
		<Input value={filter.name} onChange={(e) => setFilter((prev) => ({ ...prev, name: e.target.value }))} />
	),
}: {
	filter: Filter;
	filterType: string;
	setFilter: React.Dispatch<React.SetStateAction<Filter>>;
	savedFilters: Filter[];
	setSavedFilters: React.Dispatch<React.SetStateAction<Filter[]>>;
	defaultViewName?: string;
	saveFilterComponent?: React.ReactNode;
}) {
	const [openSaveFilter, setOpenSaveFilter] = React.useState(false);
	const { user } = useUser();

	const saveFilter = async () => {
		toast("Mentés", {
			description: "Ne kattints el! A szűrő mentése folyamatban...",
		});
		const response = await fetch("https://pen.dataupload.xyz/filters", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ ...filter, type: filterType, user: user?.sub }),
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
				toast("Sikeres mentés", {
					description: "A szűrő sikeresen el lett mentve",
				});
				return;
			}

			await fetch(`https://pen.dataupload.xyz/filters/${data.id}`, {
				method: "DELETE",
			});
			toast.error("Hiba", {
				description: `Hiba történt a szűrő mentése közben. Error: '${response2.statusText}'`,
			});
			return;
		}
		toast.error("Hiba", {
			description: `Hiba történt a szűrő mentése közben. Error:  '${response.statusText}'`,
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
				await onSaveFilter();
			}
		};

		window.addEventListener("keydown", handleKeyDown);

		return () => {
			window.removeEventListener("keydown", handleKeyDown);
		};
	}, [filter, savedFilters]);

	return (
		<>
			<Tabs
				value={filter.id}
				className='flex flex-row lg:w-full w-2/3 lg:overflow-x-auto overflow-x-scroll items-center gap-3 justify-start'>
				<TabsHeader
					className='rounded-none bg-transparent p-0 cursor-pointer inline-flex items-center lg:w-auto '
					onClick={handleOpenSaveFilter}
					indicatorProps={{
						className: "bg-transparent border-b-2 border-gray-900 mx-3 shadow-none rounded-none",
					}}>
					<PlusIcon className='w-5 h-5' />
				</TabsHeader>

				<TabsHeader
					className='rounded-none bg-transparent w-36 lg:w-full p-0 cursor-pointer'
					onClick={() => {
						setFilter((prev) => ({
							filters: prev.filters.map((filter) => ({
								...filter,
								value: filter.type === "daterange" ? undefined : "",
							})),
							name: "",
							type: "",
							id: 0,
							sort_by: "id",
							sort_order: "desc",
						}));
					}}
					indicatorProps={{
						className: "bg-transparent border-b-2 border-gray-900 mx-3 shadow-none rounded-none",
					}}>
					<div className='flex items-center pb-2 -ml-2'>
						<Separator orientation='vertical' className='mx-2 h-1/2' />
					</div>
					<Tab value={0} className='pb-2 '>
						{defaultViewName ?? "Alap nézet"}
					</Tab>
					<div className='flex items-center pb-2'>
						<Separator orientation='vertical' className='mx-2 h-1/2' />
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
								className='rounded-none bg-transparent p-0 cursor-pointer w-40 lg:w-full'
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
												toast.error("Hiba", {
													description: "Hiba történt a szűrő törlése közben",
												});
											}
										}}
										onSave={async () => await onSaveFilter()}>
										<EllipsisVerticalIcon className='w-5 h-5' />
									</Menu>
									<Separator orientation='vertical' className='mx-2 h-1/2' />
								</div>
							</TabsHeader>
						);
					})}
			</Tabs>
			<CustomDialog
				onSave={saveFilter}
				open={openSaveFilter}
				title='Nézet mentése'
				handler={handleOpenSaveFilter}>
				{saveFilterComponent}
			</CustomDialog>
		</>
	);

	async function onSaveFilter() {
		if (savedFilters.length !== 0) {
			if (filter) {
				const resps = await Promise.all(
					filter.filters.map(async (item) => {
						const savedFilter = savedFilters.find((savedFilter) => savedFilter.id === filter.id);

						if (savedFilter) {
							const isNotEqual = !deepEqual(
								item.value,
								savedFilter.filters.find((fItem) => fItem.id === item.id)?.value
							);
							if (isNotEqual) {
								const resp = await fetch(`https://pen.dataupload.xyz/filter_items/${item.id}/`, {
									method: "PUT",
									headers: {
										"Content-Type": "application/json",
									},
									body: JSON.stringify({
										...item,
										filter: filter.id,
										value: item.type === "daterange" ? JSON.stringify(item.id) : item.value,
									}),
								});
								if (resp.ok) {
									return true;
								}
								return false;
							}
						}
					})
				);
				if (resps.every((item) => typeof item === "undefined")) {
					toast("Nincs változás", {
						description: "Nem történt változás a szűrőben",
					});
				} else if (resps.filter((item) => typeof item !== "undefined").every((item) => item === true)) {
					toast("Sikeres mentés", {
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
}

export function InputOptionChooser({
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
	const deviceSize = useBreakpointValue();
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
				inputWidth={deviceSize === "sm" ? "" : "250px"}
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
				onSelect={onChange}
				options={options ? options : []}
				onChange={onChange}
			/>
		);
	} else if (type === "daterange") {
		return (
			<DateRangePicker
				numberOfMonths={deviceSize === "sm" ? 1 : 2}
				value={value ? (value as DateRange) : { from: new Date(), to: new Date() }}
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

export const fetchSavedFilters = async (title: string, user_id: string, filters: FilterItem[]) => {
	const response = await fetch(`https://pen.dataupload.xyz/filters?type=${title}&user=${user_id}`);
	if (response.ok) {
		const data: Filter[] = await response.json();

		return await Promise.all(
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
										value: item.value
											? {
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
											  }
											: undefined,
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
		);
		return;
	}
	return "Error";
};
