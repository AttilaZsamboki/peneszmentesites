"use client";
import Link from "next/link";
import React from "react";
import autoAnimate from "@formkit/auto-animate";
import { Filter } from "../_clientPage";
import { Card, CardBody } from "@material-tailwind/react";

export default function StackedList({ items, filters }: { items: any[]; filters?: Filter[] }) {
	const parent = React.useRef<HTMLUListElement | null>(null);
	React.useEffect(() => {
		if (parent.current) {
			autoAnimate(parent.current);
		}
	}, [parent.current]);
	return (
		<ul
			ref={parent}
			role='list'
			className='divide-y divide-gray-100 w-11/12 bg-white rounded-lg flex flex-col justify-between gap-3'>
			{items
				.filter((item) =>
					filters
						? filters
								.map((filter) =>
									item[filter.searchField]
										? item[filter.searchField].toLowerCase().includes(filter.search?.toLowerCase())
										: false
								)
								.every((filter) => filter !== false)
						: true
				)
				.map((item) => (
					<Link href={"/" + item["Adatlap hash (ne módosítsd!!)"]} key={item["Adatlap"]}>
						<Card>
							<CardBody className='flex justify-between py-5 bg-white bg-opacity-20 rounded-lg border border-gray-300 backdrop-blur-lg shadow-xl transform'>
								<div className='flex flex-row min-w-0 gap-4'>
									<img
										className='h-12 w-12 flex-none rounded-full bg-gray-50'
										src={`https://drive.google.com/uc?export=view&id=${
											item["Készítsd képeket és töltsd fel őket!"]
												? JSON.parse(
														item["Készítsd képeket és töltsd fel őket!"].replace(/'/g, '"')
												  )[0]
												: ""
										}`}
										alt='felmereskep'
									/>
									<div className='min-w-0 flex-auto'>
										<p className='text-sm font-semibold leading-6 text-gray-900'>
											{item["Adatlap"]}
										</p>
										<p className='mt-1 truncate text-xs leading-5 text-gray-500'>
											{item["Ingatlan címe"]}
										</p>
									</div>
								</div>
								<div className='hidden shrink-0 sm:flex sm:flex-col sm:items-end'>
									<p className='text-sm leading-6 text-gray-900'>
										{item["Milyen rendszert tervezel?"]}
									</p>
									<p className='mt-1 text-xs leading-5 text-gray-500'>{item["Felmérő"]}</p>
								</div>
							</CardBody>
						</Card>
					</Link>
				))}
		</ul>
	);
}
