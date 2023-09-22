"use client";
import Link from "next/link";
import React from "react";
import autoAnimate from "@formkit/auto-animate";
import { Filter, FilterItem } from "../products/page";
import { DefaultPagination } from "./Pagination";
import { useRouter, useSearchParams } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { EllipsisVerticalIcon, PlusIcon } from "@heroicons/react/20/solid";
import Menu from "../_components/Menu";
import CustomDialog from "./CustomDialog";
import Input from "./Input";
import { Badge, Tab, Tabs, TabsHeader } from "@material-tailwind/react";

import Search from "./Search";
import { ScrollArea } from "@/components/ui/scroll-area";
import useBreakpointValue from "./useBreakpoint";
import { Separator } from "@/components/ui/separator";

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

export default function StackedList({
	data,
	editType,
	editHref,
	itemContent,
	onEditItem,
	pagination,
	sort = { by: "id", order: "asc" },
	title,
}: {
	data: any[];
	editType: "link" | "dialog";
	editHref?: string;
	itemContent: ItemContent;
	onEditItem?: (item: any) => void;
	pagination: { numPages: number };
	sort?: { by: string; order: "asc" | "desc" };
	title: string;
}) {
	const parent = React.useRef<HTMLUListElement | null>(null);
	const router = useRouter();
	const searchParams = useSearchParams();
	const deviceSize = useBreakpointValue();
	const [filter, setFilter] = React.useState<Filter>({ filters: [], name: "", type: "", id: 0 });
	const search = filter.filters.find((filter) => filter.field === "search");

	const [filteredData, setFilteredData] = React.useState(data);

	React.useEffect(() => {
		if (parent.current) {
			autoAnimate(parent.current);
		}
	}, [parent.current]);
	React.useEffect(() => {
		if (pagination.numPages) {
			if (pagination.numPages && search?.value) {
				router.push(`?filter=${search?.value}`, { scroll: false });
			} else if (searchParams.get("filter")) {
				router.push(`?page=1&limit=10`, { scroll: false });
			}
		} else {
			router.push(`?filter=${search?.value}`, {
				scroll: false,
			});
		}
	}, [filter]);

	const tailwindColorMap = {
		yellow: "bg-yellow-900",
		red: "bg-red-900",
		green: "bg-green-900",
		blue: "bg-blue-900",
		gray: "bg-gray-900",
	};
	const [savedFilters, setSavedFilters] = React.useState<Filter[]>([]);
	const { toast } = useToast();

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
		<div className='w-full px-5 lg:px-0 lg:w-2/3 flex flex-col gap-3'>
			<Search
				search={search ? search : { id: 0, field: "search", value: "" }}
				setSearch={setFilter}
				setFilteredData={setFilteredData}
				data={data}
				itemContent={itemContent}
			/>
			<FiltersComponent
				filterType={title}
				filter={filter}
				savedFilters={savedFilters}
				setFilter={setFilter}
				setSavedFilters={setSavedFilters}
			/>
			<ScrollArea className='lg:h-[70dvh] h-[62dvh] rounded-md border p-2 bg-white'>
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
							router.push(`?page=${page}&limit=10`, { scroll: false });
						}}
					/>
				</div>
			) : null}
		</div>
	);
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
					<p className='text-sm leading-6 text-gray-900'>{item[itemContent.subtitle2]}</p>
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
	setFilter: setFilter,
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
		const response = await fetch("https://pen.dataupload.xyz/filters", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ ...filter, type: filterType }),
		});
		if (response.ok) {
			handleOpenSaveFilter();
			const data = await response.json();
			setSavedFilters((prev) => [...prev, { ...filter, id: data.id }]);
		}
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
						filter.filters.map(async (item) => {
							const savedFilter = savedFilters.find((savedFilter) => savedFilter.id === filter.id);
							if (savedFilter) {
								await onSaveFilter(
									!deepEqual(
										item.value,
										savedFilter.filters.find((fItem) => fItem.id === item.id)
									),
									item
								);
							}
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
					onClick={() => setFilter(savedFilters.find((filter) => filter.id === 0) as Filter)}
					indicatorProps={{
						className: "bg-transparent border-b-2 border-gray-900 mx-3 shadow-none rounded-none",
					}}>
					<Tab value={0} className='pb-2'>
						Alap
					</Tab>
					<div className='flex items-center pb-2'>
						<Separator orientation='vertical' className='mx-2 ml-4' />
					</div>
				</TabsHeader>
				{savedFilters
					.sort((a, b) => a.id - b.id)
					.map((savedFilter) => {
						const isNotEqual: boolean =
							savedFilter.id === filter.id &&
							filter.filters
								.map(
									(f) =>
										!deepEqual(
											f.value,
											savedFilter.filters.find((savedFilterItem) => savedFilterItem.id === f.id)
												?.value
										)
								)
								.every((item) => item === true);

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
											}
										}}
										onSave={async () =>
											filter.filters.map(async (f) => await onSaveFilter(isNotEqual, f))
										}
										onDuplicate={async () => {
											const response = await fetch("https://pen.dataupload.xyz/filters", {
												method: "POST",
												headers: {
													"Content-Type": "application/json",
												},
												body: JSON.stringify({
													...savedFilter,
													id: 0,
													name: `${savedFilter.name} másolat`,
												}),
											});
											if (response.ok) {
												const data = await response.json();
												setSavedFilters((prev) => [...prev, { ...data, name: `${data.name}` }]);
											}
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
				title='Filter mentése'
				handler={handleOpenSaveFilter}>
				<Input
					label='Filter neve'
					value={filter.name}
					onChange={(e) => setFilter((prev) => ({ ...prev, name: e.target.value }))}
				/>
			</CustomDialog>
		</div>
	);

	async function onSaveFilter(isNotEqual: boolean, filter: FilterItem) {
		if (isNotEqual) {
			await fetch(`https://pen.dataupload.xyz/filter_item/${filter.id}/`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					...filter,
				}),
			});
		} else {
			toast({
				title: "Nincs változás",
				description: "Nem történt változás a szűrőben",
			});
		}
	}
}
