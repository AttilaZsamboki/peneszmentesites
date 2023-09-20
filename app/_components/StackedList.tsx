"use client";
import Link from "next/link";
import React from "react";
import autoAnimate from "@formkit/auto-animate";
import { Filter } from "../products/page";
import { DefaultPagination } from "./Pagination";
import { useRouter, useSearchParams } from "next/navigation";

import Search from "./Search";

export interface ItemContent {
	title: string;
	subtitle: string;
	subtitle2: string;
	subtitle3?: string;
	imgSrc?: string;
	id: string;
	status?: string;
}

export default function StackedList({
	data,
	editType,
	editHref,
	itemContent,
	search,
	setSearch,
	onEditItem,
	pagination,
	sort = { by: "id", order: "asc" },
}: {
	data: any[];
	editType: "link" | "dialog";
	editHref?: string;
	itemContent: ItemContent;
	search: Filter;
	setSearch: React.Dispatch<React.SetStateAction<Filter>>;
	onEditItem?: (item: any) => void;
	pagination: { numPages: number };
	sort?: { by: string; order: "asc" | "desc" };
}) {
	const parent = React.useRef<HTMLUListElement | null>(null);
	const router = useRouter();
	const searchParams = useSearchParams();

	const [filteredData, setFilteredData] = React.useState(data);

	React.useEffect(() => {
		if (parent.current) {
			autoAnimate(parent.current);
		}
	}, [parent.current]);
	React.useEffect(() => {
		if (pagination.numPages) {
			if (pagination.numPages && search.value) {
				router.push(`?filter=${search.value}`, { scroll: false });
			} else if (searchParams.get("filter")) {
				router.push(`?page=1&limit=10`, { scroll: false });
			}
		} else {
			router.push(`?filter=${search.value}`, { scroll: false });
		}
	}, [search]);

	const tailwindColorMap = {
		yellow: "bg-yellow-900",
		red: "bg-red-900",
		green: "bg-green-900",
		blue: "bg-blue-900",
		gray: "bg-gray-900",
	};

	return (
		<div className='w-2/3 flex flex-col'>
			<Search search={search} setSearch={setSearch} setFilteredData={setFilteredData} data={data} />
			<ul ref={parent} role='list' className='w-full bg-white rounded-lg flex flex-col justify-between border'>
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
																	item[itemContent.status ? itemContent.status : ""]
																		.className
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
																			itemContent.status ? itemContent.status : ""
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
