"use client";
import StackedList from "./_components/StackedList";
import Heading from "./_components/Heading";
import AutoComplete from "./_components/AutoComplete";
import { PlusCircleIcon, MinusCircleIcon } from "@heroicons/react/20/solid";
import React from "react";
import autoAnimate from "@formkit/auto-animate";
import { useSearchParams, usePathname, useRouter, ReadonlyURLSearchParams } from "next/navigation";

export interface Filter {
	id: number;
	search: string;
	searchField: string;
}

export default function ClientPage({ felmeresek }: { felmeresek: any[] }) {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams()!;
	function queryParamsToFilters(searchParams: ReadonlyURLSearchParams): Filter[] {
		const filters: Filter[] = [];
		let index = 0;
		while (true) {
			const id = searchParams.get(`filters[${index}][id]`);
			const search = searchParams.get(`filters[${index}][search]`);
			const searchField = searchParams.get(`filters[${index}][searchField]`);
			if (id === null || search === null || searchField === null) {
				break;
			}
			const options: string[] = [];
			let optionIndex = 0;
			while (true) {
				const option = searchParams.get(`filters[${index}][options][${optionIndex}]`);
				if (option === null) {
					break;
				}
				options.push(option);
				optionIndex++;
			}
			const searchBarOptions: string[] = [];
			let searchBarOptionIndex = 0;
			while (true) {
				const searchBarOption = searchParams.get(
					`filters[${index}][searchBarOptions][${searchBarOptionIndex}]`
				);
				if (searchBarOption === null) {
					break;
				}
				searchBarOptions.push(searchBarOption);
				searchBarOptionIndex++;
			}
			filters.push({
				id: Number(id),
				search,
				searchField,
			});
			index++;
		}
		return filters;
	}
	React.useEffect(() => {
		const filters = queryParamsToFilters(searchParams);
		setSearch(filters);
	}, [searchParams]);
	const [search, setSearch] = React.useState<Filter[]>([
		{
			id: 1,
			search: "",
			searchField: "Ingatlan címe",
		},
	]);
	const parent = React.useRef<HTMLDivElement>(null);
	React.useEffect(() => {
		if (parent.current) {
			autoAnimate(parent.current);
		}
	}, [parent]);
	function filtersToQueryParams(filters: Filter[]): string {
		const params = new URLSearchParams();
		filters.forEach((filter, index) => {
			params.append(`filters[${index}][id]`, filter.id.toString());
			params.append(`filters[${index}][search]`, filter.search);
			params.append(`filters[${index}][searchField]`, filter.searchField);
		});
		return params.toString();
	}
	React.useEffect(() => {
		router.push(`${pathname}?${filtersToQueryParams(search)}`);
	}, [search]);
	return (
		<main className='flex min-h-screen flex-col items-center justify-start p-2'>
			<div className='flex lg:flex-row flex-col justify-between items-center mt-10 w-11/12'>
				<Heading title='Felmérések' />
				<React.Suspense fallback={<div></div>}>
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
													(field) =>
														!search.map((filter) => filter.searchField).includes(field)
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
										setSearch((prev) => [
											...prev.filter((s) => s.id !== i.id),
											{ ...i, search: value },
										])
									}
									value={
										search.find((s) => s.id === i.id)
											? search.find((s) => s.id === i.id)!.search
											: ""
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
				</React.Suspense>
			</div>
			<StackedList items={felmeresek} filters={search} />
		</main>
	);
}
