import { FunnelIcon } from "@heroicons/react/24/outline";
import { FilterItem, Filter } from "../products/page";
import React from "react";
import { Button } from "@/components/ui/button";
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
import { Label } from "@/components/ui/label";
import { ItemContent } from "./StackedList";
import AutoComplete from "./AutoComplete";

export default function Search({
	data,
	search,
	setSearch,
	setFilteredData,
	itemContent,
}: {
	data: any;
	search: FilterItem;
	setSearch: React.Dispatch<React.SetStateAction<Filter>>;
	setFilteredData: React.Dispatch<React.SetStateAction<any[]>>;
	itemContent: ItemContent;
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
	}, [search.value, data]);

	return (
		<div className='flex flex-row justify-between items-center mb-3 w-full gap-5 mt-5'>
			<div className='mx-auto flex w-full gap-3'>
				<div className='relative flex items-center w-full h-12 bg-white overflow-hidden rounded-md border'>
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
						placeholder='Keresés...'
						onChange={(e) => {
							const value = e.target.value;
							setSearch((prev) => ({
								...prev,
								filters: [
									...prev.filters.filter((filter) => filter.id !== search.id),
									{ ...search, value },
								],
							}));
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
				<div className='rounded-md'>
					<Sheet>
						<SheetTrigger asChild>
							<div className='flex items-center justify-center relative h-12 w-12 bg-white overflow-hidden rounded-md border cursor-pointer'>
								<FunnelIcon className='w-5 h-5' />
							</div>
						</SheetTrigger>
						<SheetContent>
							<SheetHeader>
								<SheetTitle>Szűrők</SheetTitle>
								<SheetDescription>Itt tudsz egyedi mezőkre szűrni</SheetDescription>
							</SheetHeader>
							<div className='grid gap-4 py-4'>
								{Object.entries(itemContent).map(([key, value]) => {
									const options: any = Array.from(
										new Set(
											data.map((field: any) =>
												key === "status" ? field[value].name : field[value]
											)
										)
									).filter((field) => field);
									return (
										<div key={key} className='grid grid-cols-4 items-center gap-4'>
											<Label htmlFor='username' className='text-right'>
												{value}
											</Label>
											<AutoComplete
												className='col-span-3'
												options={options.map((field: any) => ({
													value: field,
													label: field,
												}))}
											/>
										</div>
									);
								})}
							</div>
							<SheetFooter>
								<SheetClose asChild>
									<Button type='submit'>Alkalmaz</Button>
								</SheetClose>
								<SheetClose asChild>
									<Button type='button' variant='secondary'>
										Mégse
									</Button>
								</SheetClose>
							</SheetFooter>
						</SheetContent>
					</Sheet>
				</div>
			</div>
		</div>
	);
}
