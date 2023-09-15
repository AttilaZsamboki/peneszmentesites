import { Filter } from "../products/page";
import React from "react";

export default function Search({
	data,
	search,
	setSearch,
	setFilteredData,
}: {
	data: any;
	search: Filter;
	setSearch: React.Dispatch<React.SetStateAction<Filter>>;
	setFilteredData: React.Dispatch<React.SetStateAction<any[]>>;
}) {

	React.useEffect(() => {
		setFilteredData(
			data.filter((item: any) =>
				search.value
					.split(" ")
					.map((searchWord: string) => JSON.stringify(item).toLowerCase().includes(searchWord.toLowerCase()))
					.every((item: boolean) => item === true)
			)
		);
	}, [search.value]);

	return (
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
						onChange={(e) => {
							const value = e.target.value;
							setSearch((prev) => ({ ...prev, value: value }));
							setFilteredData(
								data.filter((item: any) =>
									value
										.split(" ")
										.map((searchWord: string) =>
											JSON.stringify(item).toLowerCase().includes(searchWord.toLowerCase())
										)
										.every((item: boolean) => item === true)
								)
							);
						}}
					/>
				</div>
			</div>
		</div>
	);
}
