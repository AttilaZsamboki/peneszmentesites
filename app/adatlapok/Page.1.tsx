"use client";
import { Kanban } from "@/components/component/kanban";
import { Grid } from "@/components/component/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
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
import { useUser } from "@auth0/nextjs-auth0/client";
import { FunnelIcon } from "@heroicons/react/24/outline";
import { SearchIcon } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useContext } from "react";
import { toast } from "sonner";
import AutoComplete from "../_components/AutoComplete";
import {
	DateRange,
	FilterItem,
	FiltersComponent,
	InputOptionChooser,
	fetchSavedFilters,
} from "../_components/StackedList";
import { AdatlapData, AdatlapStatusz, Salesmen } from "../_utils/types";
import { isValidDate, useCreateQueryString } from "../_utils/utils";
import { Pagination } from "../page";
import { Filter } from "../products/page";

function Body({ data }: { data: Pagination<AdatlapData> }) {
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
	const { setData } = useContext(AdatlapokV2Context);
	const [savedFilters, setSavedFilters] = React.useState<Filter[]>([]);
	const queryString = useCreateQueryString(searchParams);
	const filters: FilterItem[] = [
		{
			field: "Statusz",
			label: "Státusz",
			type: "select",
			options: [
				{ label: "Felmérésre vár", value: "Felmérésre vár" },
				{ label: "Ajánlat kiküldve", value: "Ajánlat kiküldve" },
				{ label: "Beépítésre vár", value: "Beépítésre vár" },
				{ label: "Elszámolásra vár", value: "Elszámolásra vár" },
				{ label: "Lezárva", value: "Lezárva" },
				{ label: "Elutasítva", value: "Elutasítva" },
			],
		},
		{ field: "DateTime1953", label: "Beépítés Dátuma", type: "daterange" },
		{ field: "FelmeresIdopontja2", label: "Felmérés Dátuma", type: "daterange" },
		{ field: "Felmero2", label: "Felmérő", type: "text" },
		{
			field: "FizetesiMod3",
			label: "Fizetési mód",
			type: "select",
			options: [
				{ label: "Átutalás", value: "Átutalás" },
				{ label: "Készpénz", value: "Készpénz" },
			],
		},
		{ field: "Telepules", label: "Település", type: "text" },
		{
			field: "view",
			label: "Nézet",
			type: "select",
			options: [
				{ label: "Kanban", value: "kanban" },
				{ label: "Táblázat", value: "grid" },
			],
		},
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
		sort_by: searchParams.get("sort_by") ?? undefined,
		sort_order: (searchParams.get("sort_order") as "asc" | "desc") ?? "desc",
	});

	const savedFilterFromURL = searchParams.get("selectedFilter")
		? savedFilters.find((filter) => filter.id === parseInt(searchParams.get("selectedFilter") ?? ""))
		: "";

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
		if (!user?.sub) {
			return;
		}

		const savedFilters = async () => {
			const resp = await fetchSavedFilters("adatlapok", user.sub ?? "", filters);
			if (resp === "Error" || !resp) {
				toast.error("Hiba", {
					description: "Hiba történt a szűrők betöltése közben",
					action: {
						label: "Újrapróbálkozás",
						onClick: () => fetchSavedFilters("adatlapok", user.sub ?? "", filters),
					},
				});
				return;
			}
			setSavedFilters(resp);
		};
		savedFilters();
	}, [user?.sub]);

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

	function refilterData(f: Filter = filter) {
		setData((prev) => ({
			...prev,
			results: data.filter((item: { [key: string]: any }) => {
				return f.filters
					.filter((filterItem) => filterItem.value && filterItem.field !== "view")
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
			}),
		}));
	}
	React.useEffect(() => {
		refilterData(filter);
	}, [filter, data]);

	const [isSearchBarVisible, setSearchBarVisible] = React.useState(false);
	const deviceSize = useBreakpointValue();

	return (
		<div className='flex flex-row w-full justify-between px-3 lg:px-6'>
			<FiltersComponent
				filter={filter}
				filterType='adatlapok'
				savedFilters={savedFilters}
				setSavedFilters={setSavedFilters}
				setFilter={setFilter}
				defaultViewName='Kanban'
				saveFilterComponent={
					<div className='flex flex-col gap-6 items-center justify-center'>
						<div className='grid w-full max-w-sm items-center gap-1.5'>
							<Label htmlFor='name'>Nézet neve</Label>
							<Input
								value={filter.name}
								onChange={(e) => setFilter((prev) => ({ ...prev, name: e.target.value }))}
							/>
						</div>
						<div className='grid w-full max-w-sm items-center gap-1.5'>
							<Label htmlFor='type'>Típus</Label>
							<AutoComplete
								value={filter.filters.find((item) => item.field === "view")?.value as string}
								onSelect={(value) =>
									setFilter((prev) => ({
										...prev,
										filters: prev.filters.map((item) => {
											if (item.field === "view") {
												return { ...item, value: value };
											}
											return item;
										}),
									}))
								}
								options={[
									{ label: "Kanban", value: "kanban" },
									{ label: "Táblázat", value: "grid" },
								]}
							/>
						</div>
					</div>
				}
			/>

			<div className='flex lg:flex-1 flex-auto items-center md:ml-auto md:gap-2 lg:gap-4'>
				<div className='ml-auto flex-1 sm:flex-initial'>
					<div className='relative'>
						{isSearchBarVisible ? (
							<SearchIcon
								className='absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400'
								onClick={() => setSearchBarVisible(!isSearchBarVisible)}
							/>
						) : (
							<>
								<Button variant={"outline"}>
									<SearchIcon
										className='h-4 w-4 '
										onClick={() => setSearchBarVisible(!isSearchBarVisible)}
									/>
								</Button>
							</>
						)}
						{isSearchBarVisible && (
							<Input
								className='pl-8 sm:w-full md:w-[200px] lg:w-[300px] bg-white'
								placeholder='Keress...'
								value={filter.filters.find((item) => item.field === "search")?.value as string}
								onChange={(event) => {
									setFilter((prev) => ({
										...prev,
										filters: prev.filters.map((item) => {
											if (item.field === "search") {
												return { ...item, value: event.target.value };
											}
											return item;
										}),
									}));
									router.push(
										"/adatlapok?" + queryString([{ name: "search", value: event.target.value }])
									);
								}}
								onBlur={() => (deviceSize === "sm" ? setSearchBarVisible(false) : {})}
								type='search'
							/>
						)}
					</div>
				</div>
				{deviceSize === "sm" ? <Separator orientation='vertical' className='mx-2 h-1/2' /> : null}
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

export const AdatlapStatuszColors: Record<AdatlapStatusz, string> = {
	"Felmérésre vár": "bg-red-600 hover:bg-red-500",
	"Ajánlat kiküldve": "bg-yellow-700 hover:bg-yellow-600",
	"Beépítésre vár": "bg-blue-600 hover:bg-blue-500",
	"Elszámolásra vár": "bg-magenta-600 hover:bg-magenta-500",
	"Lezárva": "bg-green-600 hover:bg-green-500",
	"Elutasítva": "bg-gray-600 hover:bg-gray-500",
};

import { ButtonBar } from "@/components/component/kanban-card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from "@/components/ui/dialog";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { cn, getTimeDifference } from "@/lib/utils";
import { Dispatch } from "react";
import { useQuery } from "react-query";
import { hufFormatter } from "../[id]/_clientPage";
import { ContactDetails, concatAddress, fetchContactDetails } from "../_utils/MiniCRM";
import MapComponent from "../../components/map";
import useBreakpointValue from "../_components/useBreakpoint";

export const AdatlapokV2Context = React.createContext<{
	fetchNextPage: () => Promise<void>;
	setData: Dispatch<React.SetStateAction<Pagination<AdatlapData>>>;
}>({
	fetchNextPage: async () => {},
	setData: () => {},
});

export function AdatlapDialog({
	children,
	adatlap,
	open,
	onClose,
}: {
	children?: React.ReactNode;
	adatlap?: AdatlapData;
	open?: boolean;
	onClose?: () => void;
}) {
	const { data: salesmenData, error } = useQuery<Salesmen[]>("salesmen", () =>
		fetch("https://pen.dataupload.xyz/salesmen").then((res) => res.json())
	);
	const [contact, setContact] = React.useState<ContactDetails | null>(null);
	React.useEffect(() => {
		if (!adatlap || !adatlap.ContactId || !open) return;
		const fetchContact = async () => {
			const data = await fetchContactDetails(adatlap?.ContactId.toString() ?? "");
			setContact(data);
		};
		fetchContact();
	}, [adatlap, open]);

	if (!adatlap || error || !salesmenData) {
		return null;
	}
	const felmero = salesmenData.find((user) => {
		if (adatlap.Statusz === "Felmérésre vár") {
			return adatlap.Felmero2.includes(user.name);
		} else if (adatlap.Statusz === "Beépítésre vár") {
			return adatlap.Beepitok.includes(user.name);
		} else {
			return false;
		}
	});
	return (
		<Dialog onOpenChange={onClose} open={open}>
			<DialogTrigger asChild>{children}</DialogTrigger>
			<DialogContent className='lg:p-2 p-0 lg:h-auto h-dvh border-0'>
				<DialogHeader className='bg-blue-900 text-white flex flex-col rounded-none lg:rounded-t-sm'>
					<div className='flex flex-row w-full p-2 px-3 justify-between items-center'>
						<div className='flex flex-col gap-1'>
							<div className='font-bold'>{adatlap.Name}</div>
							<Badge className={cn("text-sm", AdatlapStatuszColors[adatlap.Statusz as AdatlapStatusz])}>
								{adatlap.Statusz}
							</Badge>
						</div>
						<div className='flex flex-row items-center text-xs gap-4'>
							<div className='flex flex-col justify-center text-center'>
								<div className='font-semibold'>FELMÉRÉS</div>
								<div className='pb-1'>{hufFormatter.format(adatlap.FelmeresiDij)}</div>
								<div>{adatlap.FizetesiMod2}</div>
							</div>
							{adatlap.Total !== null ? (
								<div className='flex flex-col justify-center text-right'>
									<div className='font-semibold'>BEÉPÍTÉS</div>
									<div className='pb-1'>{hufFormatter.format(adatlap.Total)}</div>
									<div>{adatlap.FizetesiMod3}</div>
								</div>
							) : null}
						</div>
					</div>
					<ResizablePanelGroup direction='horizontal' className='rounded-none w-full border bg-white'>
						<ResizablePanel defaultSize={50}>
							<MapComponent
								height='300px'
								start={(felmero?.zip ?? "") + ", Hungary"}
								end={concatAddress(adatlap)}
							/>
						</ResizablePanel>
						<ResizableHandle withHandle />
						<ResizablePanel defaultSize={50}>
							<img
								alt=''
								src='https://r3.minicrm.hu/119/Download/S3/?t=doc&inline=1&e=2reqdeau7f0hdgi8rdz2005g7kpp9d'
								className='ng-star-inserted'
							/>
						</ResizablePanel>
					</ResizablePanelGroup>
				</DialogHeader>
				<div className='flex flex-col lg:p-0 p-2'>
					<ButtonBar adatlap={adatlap} btnClassName='lg:w-40 w-none h-10' />
					<div className='flex flex-col prose px-2 pt-6 '>
						<h1 className='text-xl'>{adatlap.Name}</h1>
						<div className='flex flex-col gap-5'>
							<div className='flex flex-col px-1 gap-1'>
								<div className='flex flex-row'>
									<div className='font-bold pr-1'>Cim:</div>
									<div>{concatAddress(adatlap)}</div>
								</div>
								<div className='flex flex-row'>
									<div className='font-bold pr-1'>Tel:</div>
									<div>{contact?.Phone}</div>
								</div>
								<div className='flex flex-col'>
									<div className='flex flex-row'>
										<div className='font-bold pr-1'>Rendelés:</div>
										<div>{adatlap.RendelesSzama}</div>
									</div>
									<Link href={adatlap.FelmeresLink ?? ""}>
										<div className='underline text-xs cursor-pointer'>Felmérés adatok</div>
									</Link>
								</div>
							</div>
							<div className='flex flex-col px-1 gap-1'>
								<div className='flex flex-row'>
									<div className='font-bold pr-1'>Felmérés időpontja:</div>
									<div>
										{adatlap.FelmeresIdopontja2.toLocaleDateString("hu-HU")}{" "}
										<span className='font-semibold'>
											({getTimeDifference(adatlap.FelmeresIdopontja2)})
										</span>
									</div>
								</div>
								<div className='flex flex-col'>
									<div className='flex flex-row'>
										<div className='font-bold pr-1'>Felmerő:</div>
										<div>{adatlap.Felmero2}</div>
									</div>
									<Link href={adatlap.FelmeresLink ?? ""}>
										<div className='underline text-xs cursor-pointer'>Beépítés adatok</div>
									</Link>
								</div>
							</div>
							{adatlap.Total ? (
								<div className='flex flex-col px-1 gap-1'>
									<div className='flex flex-row'>
										<div className='font-bold pr-1'>Időpont:</div>
										<div>
											{adatlap.DateTime1953.toLocaleDateString("hu-HU")}{" "}
											<span className='font-semibold'>
												({getTimeDifference(adatlap.DateTime1953)})
											</span>
										</div>
									</div>
									<div className='flex flex-row'>
										<div className='font-bold pr-1'>Beépítők:</div>
										<div>{adatlap.Beepitok}</div>
									</div>
								</div>
							) : null}
						</div>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}

export default function Page1({ data }: { data: Pagination<AdatlapData> }) {
	const [fullData, setFullData] = React.useState(data);
	const [filteredData, setFilteredData] = React.useState(fullData);

	const fetchNextPage = async () => {
		if (!fullData.next) {
			return;
		}
		const newData = await fetch(fullData.next)
			.then((res) => res.json())
			.then((data) => {
				data.results.forEach((item: any) => {
					item.DateTime1953 = item.DateTime1953 ? new Date(item.DateTime1953) : null;
					item.FelmeresIdopontja2 = new Date(item.FelmeresIdopontja2);
				});
				return data;
			})
			.catch((err) => console.error(err));
		setFullData((prev) => ({ ...newData, results: [...prev.results, ...newData.results] }));
	};
	React.useEffect(() => {
		setFullData(data);
	}, [data]);
	React.useEffect(() => {
		setFilteredData(fullData);
	}, [fullData]);

	return (
		<AdatlapokV2Context.Provider value={{ fetchNextPage, setData: setFilteredData }}>
			<div className='flex flex-col h-screen'>
				<header className='h-[60px] flex items-center shadow-none bg-white border-b'>
					<Header data={fullData.results} />
				</header>
				<Body data={filteredData} />
			</div>
		</AdatlapokV2Context.Provider>
	);
}
