"use client";
import StackedList from "./_components/StackedList";
import Heading from "./_components/Heading";
import AutoComplete from "./_components/AutoComplete";
import { PlusCircleIcon, MinusCircleIcon } from "@heroicons/react/20/solid";
import React from "react";
import autoAnimate from "@formkit/auto-animate";

export interface Filter {
	id: number;
	search: string;
	searchField: string;
	options: string[];
	searchBarOptions: string[];
}

export default function ClientPage({ felmeresek }: { felmeresek: any[] }) {
	const [search, setSearch] = React.useState<Filter[]>([
		{
			id: 1,
			search: "",
			searchField: "Ingatlan címe",
			options: [],
			searchBarOptions: [],
		},
	]);
	const parent = React.useRef<HTMLDivElement>(null);
	React.useEffect(() => {
		autoAnimate(parent.current);
	}, []);
	return (
		<main className='flex min-h-screen flex-col items-center justify-start p-2'>
			<div className='flex lg:flex-row flex-col justify-between items-center mt-10 w-11/12'>
				<Heading title='Felmérések' />
				<div className='flex flex-col items-end justify-end w-full' ref={parent}>
					{search.map((i) => (
						<div
							key={i.id}
							className='lg:w-2/6 w-full mb-5 flex flex-row justify-between items-center gap-2'>
							<AutoComplete
								options={Array.from(
									new Set(
										felmeresek
											.map((felmeres) => Object.keys(felmeres))
											.flat()
											.filter(
												(field) => !search.map((filter) => filter.searchField).includes(field)
											)
									)
								)}
								onChange={(value) =>
									setSearch((prev) => [
										...prev.filter((s) => s.id !== i.id),
										{ ...i, searchField: value },
									])
								}
								value={
									search.find((s) => s.id === i.id)
										? search.find((s) => s.id === i.id)!.searchField
										: ""
								}
							/>
							<AutoComplete
								options={Array.from(
									new Set(
										felmeresek
											.filter((item) =>
												search
													.filter((filter) => filter.searchField !== i.searchField)
													.map((filter) =>
														item[filter.searchField]
															? item[filter.searchField]
																	.toLowerCase()
																	.includes(filter.search?.toLowerCase())
															: false
													)
													.every((filter) => filter !== false)
											)
											.filter(
												(felmeres) =>
													felmeres[
														search.find((s) => s.id === i.id)
															? search.find((s) => s.id === i.id)!.searchField
															: ""
													]
											)
											.map((felmeres) =>
												felmeres[
													search.find((s) => s.id === i.id)
														? search.find((s) => s.id === i.id)!.searchField
														: ""
												]
													.replace("['", "")
													.replace("']", "")
											)
									)
								)}
								onChange={(value) =>
									setSearch((prev) => [...prev.filter((s) => s.id !== i.id), { ...i, search: value }])
								}
								value={
									search.find((s) => s.id === i.id) ? search.find((s) => s.id === i.id)!.search : ""
								}
							/>
							{i.id === search[search.length - 1].id ? (
								<PlusCircleIcon
									className='w-16 h-16 cursor-pointer text-blue-gray-500'
									onClick={() =>
										setSearch((prev) => [
											...prev,
											{
												id: search[search.length - 1].id + 1,
												search: "",
												searchField: "",
												options: [],
												searchBarOptions: [],
											},
										])
									}
								/>
							) : (
								<MinusCircleIcon
									className='w-16 h-16 cursor-pointer text-red-500'
									onClick={() => setSearch((prev) => prev.filter((s) => s.id !== i.id))}
								/>
							)}
						</div>
					))}
				</div>
			</div>
			<StackedList items={felmeresek} filters={search} />
		</main>
	);
}
