"use client";
import { Fragment, useState } from "react";
import { Combobox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import React from "react";

export default function AutoComplete({
	options,
	value,
	onChange,
	optionDisplayDirection = "bottom",
	create = false,
	resetOnCreate = true,
	emptyOption = true,
	showOptions = true,
	inputClassName,
	className,
	updateOnQueryChange = false,
}: {
	options: { label: string; value: string }[];
	value?: string;
	onChange?: (value: string) => void;
	optionDisplayDirection?: "top" | "bottom";
	create?: boolean;
	resetOnCreate?: boolean;
	emptyOption?: boolean;
	showOptions?: boolean;
	inputClassName?: string;
	className?: string;
	updateOnQueryChange?: boolean;
}) {
	const [query, setQuery] = useState("");

	const filteredOptions = emptyOption
		? [
				{ label: "", value: "" },
				...(query === ""
					? options
					: options.filter((option) =>
							query
								.split(" ")
								.map((searchWord: string) =>
									JSON.stringify(option).toLowerCase().includes(searchWord.toLowerCase())
								)
								.every((item: boolean) => item === true)
					  )),
		  ]
		: query === ""
		? options
		: options.filter((option) =>
				query
					.split(" ")
					.map((searchWord: string) =>
						JSON.stringify(option).toLowerCase().includes(searchWord.toLowerCase())
					)
					.every((item: boolean) => item === true)
		  );

	return (
		<Combobox
			value={value}
			onChange={(localValue) => {
				onChange ? onChange(localValue ?? "") : null;
				if (resetOnCreate) {
					setQuery("");
				}
			}}>
			<div className={`relative w-full ${className}`}>
				<div className='rounded-md'>
					{create ? (
						<Combobox.Input
							className={`w-full border rounded-md py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0 focus:outline-none ${inputClassName}`}
							value={resetOnCreate ? query : undefined}
							onChange={(event) => {
								setQuery(event.target.value);
							}}
						/>
					) : (
						<Combobox.Input
							className={`w-full border rounded-md py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0 focus:outline-none ${inputClassName}`}
							onChange={(event) => {
								setQuery(event.target.value);
								onChange && updateOnQueryChange ? onChange(event.target.value) : null;
							}}
						/>
					)}
					<Combobox.Button className='absolute inset-y-0 right-0 flex items-center pr-2'>
						<ChevronUpDownIcon className='h-5 w-5 text-gray-400' aria-hidden='true' />
					</Combobox.Button>
				</div>
				{showOptions ? (
					<Transition
						as={Fragment}
						leave='transition ease-in duration-100'
						leaveFrom='opacity-100'
						leaveTo='opacity-0'
						afterLeave={() => setQuery("")}>
						<Combobox.Options
							className={`absolute ${
								optionDisplayDirection === "top" ? "bottom-full" : ""
							} mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-sm shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm`}>
							{create
								? query.length > 0 && (
										<Combobox.Option
											className={({ active }) =>
												`relative cursor-default select-none py-2 pl-10 z-50 pr-4 ${
													active ? "bg-secondary" : "text-gray-900 bg-white"
												}`
											}
											value={query}>
											Létrehozás &ldquo;{query}&rdquo;
										</Combobox.Option>
								  )
								: null}
							{filteredOptions.length === 0 && query !== "" ? (
								<div className='relative cursor-default select-none py-2 px-4 text-gray-700 z-50'>
									Nincs ilyen
								</div>
							) : (
								filteredOptions.map((option) => (
									<Combobox.Option
										key={option.value}
										className={({ active }) =>
											`relative cursor-default select-none py-2 pl-10 z-50 pr-4 ${
												active ? "bg-secondary" : "text-gray-900 bg-white"
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
																? ""
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
				) : null}
			</div>
		</Combobox>
	);
}
