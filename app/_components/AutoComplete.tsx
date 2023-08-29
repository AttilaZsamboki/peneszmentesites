"use client";
import { Fragment, useState } from "react";
import { Combobox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";

export default function AutoComplete({
	options,
	value,
	onChange,
}: {
	options: { label: string; value: string }[];
	value: string;
	onChange: (value: string) => void;
}) {
	const [query, setQuery] = useState("");

	const filteredOptions = [
		{ label: "", value: "" },
		...(query === ""
			? options
			: options.filter((option) =>
					option.label.toLowerCase().replace(/\s+/g, "").includes(query.toLowerCase().replace(/\s+/g, ""))
			  )),
	];

	return (
		<Combobox value={value} onChange={onChange}>
			<div className='relative w-full '>
				<div className='relative h-10 w-full cursor-default overflow-hidden rounded-lg bg-white text-left border focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm'>
					<Combobox.Input
						className='w-full py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0 focus:outline-none !border !border-gray-300 bg-white shadow-lg shadow-gray-900/5 ring-4 ring-transparent placeholder:text-gray-500'
						onChange={(event) => setQuery(event.target.value)}
					/>
					<Combobox.Button className='absolute inset-y-0 right-0 flex items-center pr-2'>
						<ChevronUpDownIcon className='h-5 w-5 text-gray-400' aria-hidden='true' />
					</Combobox.Button>
				</div>
				<Transition
					as={Fragment}
					leave='transition ease-in duration-100'
					leaveFrom='opacity-100'
					leaveTo='opacity-0'
					afterLeave={() => setQuery("")}>
					<Combobox.Options className='absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-sm shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm'>
						{filteredOptions.length === 0 && query !== "" ? (
							<div className='relative cursor-default select-none py-2 px-4 text-gray-700 z-50'>
								Nothing found.
							</div>
						) : (
							filteredOptions.map((option) => (
								<Combobox.Option
									key={option.value}
									className={({ active }) =>
										`relative cursor-default select-none py-2 pl-10 z-50 pr-4 ${
											active
												? "bg-gradient-to-tr from-gray-900 to-gray-800 text-white"
												: "text-gray-900 bg-white"
										}`
									}
									value={option.value}>
									{({ selected, active }) => (
										<>
											<span
												className={`block truncate z-50${
													selected ? "font-medium" : "font-normal "
												}`}>
												{option.label}
											</span>
											{selected ? (
												<span
													className={`absolute inset-y-0 left-0 flex items-center pl-3 z-50 ${
														active
															? "text-white"
															: "text-gradient-to-tr from-gray-900 to-gray-800"
													}`}>
													<CheckIcon className='h-5 w-5' aria-hidden='true' />
												</span>
											) : null}
										</>
									)}
								</Combobox.Option>
							))
						)}
					</Combobox.Options>
				</Transition>
			</div>
		</Combobox>
	);
}