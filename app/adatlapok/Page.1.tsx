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
import { KanbanIcon, ListIcon, PlusIcon, SearchIcon } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { isValidDate, useCreateQueryString } from "../_utils/utils";
import React from "react";
import { AdatlapData } from "../_utils/types";
import { Kanban } from "@/components/component/kanban";
import { Grid } from "@/components/component/table";
import { Filter } from "../products/page";
import {
	DateRange,
	FilterItem,
	FiltersComponent,
	InputOptionChooser,
	fetchSavedFilters,
} from "../_components/StackedList";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import AutoComplete from "../_components/AutoComplete";
import { Pagination } from "../page";
import { useUser } from "@auth0/nextjs-auth0/client";
import { toast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";

function Body({ data }: { data: AdatlapData[] }) {
	const searchParams = useSearchParams();

	if (searchParams.get("view") === "grid") {
		return <Grid data={data} />;
	} else {
		return <Kanban data={data} />;
	}
}

function Header({ data }: { data: AdatlapData[] }) {
	const searchParams = useSearchParams();
	const router = useRouter();
	const { user } = useUser();

	React.useEffect(() => {
		if (!user?.sub) {
			return;
		}

		const savedFilters = async () => {
			const resp = await fetchSavedFilters("adatlapok", user.sub ?? "", filters);
			if (resp === "Error" || !resp) {
				toast({
					title: "Hiba",
					description: "Hiba történt a szűrők betöltése közben",
					variant: "destructive",
					action: (
						<ToastAction
							altText='Try again'
							onClick={() => fetchSavedFilters("adatlapok", user.sub ?? "", filters)}>
							Újrapróbálkozás
						</ToastAction>
					),
				});
				return;
			}
			setSavedFilters(resp);
		};
		savedFilters();
	}, [user?.sub]);

	const filters: FilterItem[] = [
		{ id: 1, field: "DateTime1953", label: "Beépítés Dátuma", type: "daterange" },
		{ id: 2, field: "FelmeresIdopontja2", label: "Felmérés Dátuma", type: "daterange" },
		{ id: 3, field: "Felmero2", label: "Felmérő", type: "text" },
		{
			id: 4,
			field: "FizetesiMod3",
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
	const [savedFilters, setSavedFilters] = React.useState<Filter[]>([]);
	const queryString = useCreateQueryString(searchParams);

	const resetFilter = (exceptSearch: boolean) => {
		setFilter((prev) => ({
			...prev,
			sort_by: "",
			sort_order: "desc",
			filters: prev.filters.map((item) => {
				if (item.field === "search" && exceptSearch) {
					return item;
				}
				return { ...item, value: "" };
			}),
		}));
	};

	return (
		<div className='flex flex-row w-full justify-between px-3 lg:px-6'>
			<FiltersComponent
				filter={filter}
				filterType='adatlapok'
				savedFilters={savedFilters}
				setSavedFilters={setSavedFilters}
				setFilter={setFilter}
				defaultViewName='Kanban'
			/>
			<div className='flex flex-1 items-center gap-4 md:ml-auto md:gap-2 lg:gap-4'>
				<div className='ml-auto flex-1 sm:flex-initial'>
					<div className='relative'>
						<SearchIcon className='absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400' />
						<Input
							className='pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px] bg-white'
							placeholder='Keress...'
							value={searchParams.get("search") ?? ""}
							onChange={(event) =>
								router.push(
									"/adatlapok?" + queryString([{ name: "search", value: event.target.value }])
								)
							}
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
										queryString([
											...filter.filters
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
												),
											...[
												{
													name: "ordering",
													value: (filter.sort_order === "asc" ? "" : "-") + filter.sort_by,
												},
											],
										])
									}>
									<Button type='submit' onClick={() => {}}>
										Alkalmaz
									</Button>
								</Link>
							</SheetClose>
							<SheetClose asChild>
								<Link href='/adatlapok'>
									<Button type='button' onClick={() => resetFilter(true)} variant='secondary'>
										Mégse
									</Button>
								</Link>
							</SheetClose>
						</SheetFooter>
					</SheetContent>
				</Sheet>
			</div>
		</div>
	);
}

export default function Page1({ data }: { data: AdatlapData[] }) {
	return (
		<div className='flex flex-col h-screen'>
			<header className='h-[60px] flex items-center shadow-none bg-white border-b'>
				<Header data={data} />
			</header>
			<Body data={data} />
		</div>
	);
}
