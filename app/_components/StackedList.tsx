"use client";
import Link from "next/link";
import React from "react";
import autoAnimate from "@formkit/auto-animate";
import { Filter } from "../_clientPage";

export default function StackedList({ items, filters }: { items: any[]; filters?: Filter[] }) {
	const parent = React.useRef<HTMLUListElement | null>(null);
	React.useEffect(() => {
		if (parent.current) {
			autoAnimate(parent.current);
		}
	}, [parent.current]);
	return (
		<ul ref={parent} role='list' className='divide-y divide-gray-100 w-11/12 bg-white rounded-lg p-4'>
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
						<li className='flex justify-between gap-x-6 py-5'>
							<div className='flex min-w-0 gap-x-4'>
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
									<p className='text-sm font-semibold leading-6 text-gray-900'>{item["Adatlap"]}</p>
									<p className='mt-1 truncate text-xs leading-5 text-gray-500'>
										{item["Ingatlan címe"]}
									</p>
								</div>
							</div>
							<div className='hidden shrink-0 sm:flex sm:flex-col sm:items-end'>
								<p className='text-sm leading-6 text-gray-900'>{item["Milyen rendszert tervezel?"]}</p>
								<p className='mt-1 text-xs leading-5 text-gray-500'>{item["Felmérő"]}</p>
							</div>
						</li>
					</Link>
				))}
		</ul>
	);
}
