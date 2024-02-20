"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { useLocalStorageStateObject } from "@/lib/utils";
import { FunnelIcon } from "@heroicons/react/24/outline";
import { Tabs, TabsHeader, Tab } from "@material-tailwind/react";
import { KanbanIcon, ListIcon, Router, SearchIcon } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { isValidDate, useCreateQueryString } from "../_utils/utils";
import React from "react";
import { AdatlapData } from "../_utils/types";
import { Kanban } from "@/components/component/kanban";
import { Grid } from "@/components/component/table";
import { Filter } from "../products/page";
import { DateRange, FilterItem, InputOptionChooser } from "../_components/StackedList";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import AutoComplete from "../_components/AutoComplete";
import { Pagination } from "../page";

function Body({ data, next }: { data: AdatlapData[]; next: string | null }) {
	const searchParams = useSearchParams();

	if (searchParams.get("view") === "grid") {
		return <Grid data={data} />;
	} else {
		return <Kanban data={data} next={next} />;
	}
}

function Header({
	setData,
	data,
}: {
	setData: React.Dispatch<React.SetStateAction<AdatlapData[]>>;
	data: AdatlapData[];
}) {
	const router = useRouter();
	const searchParams = useSearchParams();

	const filters: FilterItem[] = [
		{ id: 1, field: "BeepitesDatuma", label: "Beépítés Dátuma", type: "daterange" },
		{ id: 2, field: "FelmeresIdopontja2", label: "Felmérés Dátuma", type: "daterange" },
		{ id: 3, field: "Felmero2", label: "Felmérő", type: "text" },
		{
			id: 4,
			field: "FizetesiMod2",
			label: "Fizetési mód",
			type: "select",
			options: [
				{ label: "Átutalás", value: "Átutalás" },
				{ label: "Készpénz", value: "Készpénz" },
			],
		},
		{ id: 5, field: "Telepules", label: "Település", type: "text" },
	];

	const [filter, setFilter] = React.useState<Filter>({
		filters: [...filters, { id: 0, field: "search", value: "", label: "", type: "text" } as FilterItem].map(
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
	const [activeTab, setActiveTab] = useLocalStorageStateObject("kanban", "kanban");
	const queryString = useCreateQueryString(searchParams);

	React.useEffect(() => {
		if (!searchParams.get("view")) {
			router.push("/adatlapok?" + queryString([{ name: "view", value: "kanban" }]));
		}
	}, []);

	const resetFilter = (exceptSearch: boolean) => {
		setFilter((prev) => ({
			...prev,
			filters: prev.filters.map((item) => {
				if (item.field === "search" && exceptSearch) {
					return item;
				}
				return { ...item, value: "" };
			}),
		}));
	};

	function refilterData(f: Filter = filter) {
		setData(
			data.filter((item: { [key: string]: any }) => {
				return f.filters
					.filter((filterItem) => filterItem.value)
					.map((filterItem) => {
						if ("text" === filterItem.type) {
							return (filterItem.value as unknown as string)
								.split(" ")
								.map((searchWord: string) =>
									JSON.stringify(filterItem.field === "search" ? item : item[filterItem.field])
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

	React.useEffect(() => {
		refilterData(filter);
	}, [filter, data]);

	return (
		<div className='flex flex-row w-full justify-between px-3 lg:px-6'>
			<Tabs value={activeTab} className='flex flex-row w-full  items-center'>
				<TabsHeader
					key='kanban'
					className='rounded-none bg-transparent p-0'
					indicatorProps={{
						className: "bg-transparent border-b-2 border-gray-900 mx-3 shadow-none rounded-none",
					}}>
					<Link
						href={"/adatlapok?" + queryString([{ name: "view", value: "kanban" }])}
						onClick={() => setActiveTab("kanban")}>
						<Tab value='kanban' className='pb-2'>
							<h1 className='text-sm font-medium text-gray-900 dark:text-gray-50 flex items-center'>
								<KanbanIcon className='mr-2 h-4 w-4' />
								Kanban
							</h1>
						</Tab>
					</Link>
				</TabsHeader>
				<TabsHeader
					key='grid'
					className='rounded-none bg-transparent p-0'
					indicatorProps={{
						className: "bg-transparent border-b-2 border-gray-900 mx-3 shadow-none rounded-none",
					}}>
					<Link
						href={"/adatlapok?" + queryString([{ name: "view", value: "grid" }])}
						onClick={() => setActiveTab("grid")}>
						<Tab value='grid' className='pb-2'>
							<h1 className='text-sm font-medium text-gray-900 dark:text-gray-50 flex items-center'>
								<ListIcon className='mr-2 h-4 w-4' />
								Lista nézet
							</h1>
						</Tab>
					</Link>
				</TabsHeader>
			</Tabs>
			<div className='flex flex-1 items-center gap-4 md:ml-auto md:gap-2 lg:gap-4'>
				<div className='ml-auto flex-1 sm:flex-initial'>
					<div className='relative'>
						<SearchIcon className='absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400' />
						<Input
							className='pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px] bg-white'
							placeholder='Keress felmérésre...'
							onChange={(e) => {
								setData(() => {
									const searchParams = e.target.value.toLowerCase().split(" ");
									if (!searchParams.length) return data;
									return data.filter((adatlap) => {
										return searchParams.every((searchParam) => {
											return Object.values(adatlap).some((value) => {
												if (typeof value === "string") {
													return value.toLowerCase().includes(searchParam);
												}
												return false;
											});
										});
									});
								});
							}}
							type='search'
						/>
					</div>
				</div>
				<Sheet>
					<SheetTrigger asChild>
						<Button variant={"outline"}>
							<FunnelIcon className='w-5 h-5' />
						</Button>
					</SheetTrigger>
					<SheetContent>
						<SheetHeader>
							<SheetTitle>Szűrők</SheetTitle>
							<SheetDescription>Itt tudsz egyedi mezőkre szűrni</SheetDescription>
						</SheetHeader>
						<div className='grid gap-4 py-4'>
							{filter.filters
								.filter((filter) => filter.field !== "search")
								.map(({ field, label, type, options, value }) => {
									const realOptions: { label: string; value: string }[] = options
										? options
										: Array.from(
												new Set(
													data.map((item: any) =>
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
													options={realOptions}
													pagination={true}
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
						{
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
												value={
													filter.filters.find((item) => item.field === filter.sort_by)?.label
												}
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
												value={filter.sort_order === "asc" ? "Növekvő" : "Csökkenő"}
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
						}
						<SheetFooter className='flex flex-row w-full space-x-2 justify-end items-center'>
							<SheetClose asChild>
								<Link
									href={
										"?" +
										queryString(
											filter.filters
												.filter((item) => item.field !== "search")
												.map((item) => {
													if (
														item.value &&
														(item.type !== "daterange" ||
															(isValidDate((item.value as DateRange).from) &&
																isValidDate((item.value as DateRange).to)))
													) {
														return {
															name: item.field,
															value:
																item.type === "daterange"
																	? JSON.stringify(item.value)
																	: (item.value as string),
														};
													}
													return null;
												})
												.filter(
													(item): item is { name: string; value: string } => item !== null
												)
										)
									}>
									<Button type='submit'>Alkalmaz</Button>
								</Link>
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
	);
}

export default function Page1({ data }: { data: Pagination<AdatlapData> }) {
	const [filteredData, setFilteredData] = React.useState<AdatlapData[]>([]);
	const [page, setPage] = React.useState(1);
	const searchParams = useSearchParams();
	const router = useRouter();

	React.useEffect(() => {
		if (parseInt(searchParams.get("page") ?? "0") > page) {
			setFilteredData([...filteredData, ...data.results]);
		}
		setPage(parseInt(searchParams.get("page") ?? "1"));
	}, [data]);

	React.useEffect(() => {
		if (page.toString() !== searchParams.get("page")) {
			router.push("/adatlapok");
		}
	}, []);

	return (
		<div className='flex flex-col h-screen'>
			<header className='h-[60px] flex items-center shadow-none bg-white border-b'>
				<Header data={data.results} setData={setFilteredData} />
			</header>
			<Body data={filteredData} next={data.next} />
		</div>
	);
}
