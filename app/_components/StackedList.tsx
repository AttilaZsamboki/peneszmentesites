"use client";
import Link from "next/link";
import React from "react";
import autoAnimate from "@formkit/auto-animate";
import { Card, CardBody, Chip } from "@material-tailwind/react";
import { Filter } from "../products/page";
import { DefaultPagination } from "./Pagination";
import { useRouter, useSearchParams } from "next/navigation";

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
}: {
	data: any[];
	editType: "link" | "dialog";
	editHref?: string;
	itemContent: ItemContent;
	search: Filter;
	setSearch: React.Dispatch<React.SetStateAction<Filter>>;
	onEditItem?: (item: any) => void;
	pagination: { numPages: number };
}) {
	const parent = React.useRef<HTMLUListElement | null>(null);
	const router = useRouter();
	const searchParams = useSearchParams();

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

	const filteredData = data.filter((item) =>
		search.value
			.split(" ")
			.map((searchWord: string) => JSON.stringify(item).toLowerCase().includes(searchWord.toLowerCase()))
			.every((item: boolean) => item === true)
	);
	const tailwindColorMap = {
		yellow: "bg-yellow-900",
		red: "bg-red-900",
		green: "bg-green-900",
		blue: "bg-blue-900",
		gray: "bg-gray-900",
	};

	return (
		<div className='w-2/3 flex flex-col'>
			<div className='flex flex-row justify-between items-center mb-3 w-full gap-5 mt-5'>
				<div className='mx-auto flex w-full rounded-md !border !border-gray-200'>
					<div className='relative flex items-center w-full h-12 bg-white overflow-hidden'>
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
							id='search'
							value={search.value}
							placeholder='Keress valamit..'
							onChange={(e) => setSearch((prev) => ({ ...prev, value: e.target.value }))}
						/>
					</div>
				</div>
			</div>
			<ul ref={parent} role='list' className='w-full bg-white rounded-lg flex flex-col justify-between border'>
				{filteredData
					.sort((a, b) => a[itemContent.id] - b[itemContent.id])
					.map((item, index) => {
						if (editType === "link" && editHref) {
							return (
								<Link href={editHref + item[itemContent.id]} key={index}>
									<Card
										className={`rounded-none shadow-none border-b ${
											index === 0 ? "rounded-t-md" : ""
										} ${index === data.length - 1 ? "rounded-b-md" : ""}`}>
										<CardBody className='flex justify-between py-5 bg-white bg-opacity-20 transform'>
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
															<Chip
																variant='ghost'
																value={
																	item[itemContent.status ? itemContent.status : ""]
																		.name
																}
																color={
																	item[itemContent.status ? itemContent.status : ""]
																		.color
																}
																size='sm'
																icon={
																	<span
																		className={
																			`mx-auto mt-1 block h-2 w-2 rounded-full content-[''] ` +
																			tailwindColorMap[
																				item[itemContent.status]
																					.color as keyof typeof tailwindColorMap
																			]
																		}
																	/>
																}
															/>
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
										</CardBody>
									</Card>
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
		<Card
			className={`rounded-none shadow-none border-b cursor-pointer ${index === 0 ? "rounded-t-md" : ""} ${
				index === data.length - 1 ? "rounded-b-md" : ""
			}`}
			onClick={() => (onEditItem ? onEditItem(item) : null)}>
			<CardBody className='flex justify-between py-5 bg-white bg-opacity-20 transform'>
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
			</CardBody>
		</Card>
	);
}
