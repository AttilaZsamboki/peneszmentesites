"use client";

import React from "react";

import { Typography } from "@material-tailwind/react";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import AutoComplete from "./AutoComplete";
import Heading from "./Heading";
import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/outline";
import { X } from "lucide-react";
import Link from "next/link";

export default function FormList({
	title,
	onAddNewItem,
	items,
	onDeleteItem,
	options = [],
	create = false,
	value,
	accordion,
	itemHref,
	optionDisplayDirection = "bottom",
	emptyOption,
	showOptions = true,
}: {
	title: string;
	onAddNewItem?: (value: string) => void;
	items: string[];
	onDeleteItem?: (item: string) => void;
	options?: { value: string; label: string }[];
	create?: boolean;
	value?: string;
	accordion?: (item: string) => React.ReactNode;
	itemHref?: (item: string) => any;
	optionDisplayDirection?: "top" | "bottom";
	emptyOption?: boolean;
	showOptions?: boolean;
}) {
	return (
		<div className={`pt-2 mt-1`}>
			<Heading border={false} title={title} variant='h5' />
			<AutoComplete
				onChange={(value) => (onAddNewItem ? onAddNewItem(value) : {})}
				value={value}
				optionDisplayDirection={optionDisplayDirection}
				create={create}
				options={options}
				emptyOption={emptyOption}
				showOptions={showOptions}
			/>
			<div className='flex flex-col gap-5 pt-6'>
				{accordion ? (
					<Accordion type='single' collapsible className='w-full'>
						{items.map((item, index) => (
							<AccordionItem value={item} key={index} className='w-full'>
								<AccordionTrigger>
									{onDeleteItem ? (
										<div className='flex flex-row justify-between w-full items-center gap-2'>
											{itemHref ? (
												<div className='flex flex-row items-center gap-1'>
													<Typography>{item}</Typography>
													<Link href={itemHref(item)}>
														<ArrowTopRightOnSquareIcon className='w-4 h-4 relative bottom-1' />
													</Link>
												</div>
											) : (
												<Typography>{item}</Typography>
											)}
											<Button
												size='sm'
												variant='destructive'
												onClick={() => onDeleteItem(item)}
												className='mr-5'>
												<X className='w-5 h-5' />
											</Button>
										</div>
									) : (
										<div>{item}</div>
									)}
								</AccordionTrigger>
								<AccordionContent>{accordion(item)}</AccordionContent>
							</AccordionItem>
						))}
					</Accordion>
				) : (
					items.map((item, index) => {
						return (
							<div key={index} className='flex flex-row w-full items-center justify-between pb-2 gap-4'>
								{itemHref ? (
									<Link href={itemHref ? itemHref(item) : ""}>
										<div>{item}</div>
										{onDeleteItem ? (
											<Button variant='destructive' onClick={() => onDeleteItem(item)}>
												<X className='w-5 h-5' />
											</Button>
										) : (
											<div></div>
										)}
									</Link>
								) : (
									<>
										<div>{item}</div>
										{onDeleteItem ? (
											<Button size='sm' variant='destructive' onClick={() => onDeleteItem(item)}>
												<X className='w-5 h-5 ' />
											</Button>
										) : (
											<div></div>
										)}
									</>
								)}
							</div>
						);
					})
				)}
			</div>
		</div>
	);
}
