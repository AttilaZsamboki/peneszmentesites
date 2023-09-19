"use client";

import React from "react";

import { Accordion, AccordionBody, AccordionHeader, Button, Tooltip, Typography } from "@material-tailwind/react";
import AutoComplete from "./AutoComplete";
import Heading from "./Heading";
import { ArrowTopRightOnSquareIcon, ChevronDownIcon, ChevronUpIcon, XMarkIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

export default function FormList({
	title,
	onAddNewItem,
	items,
	onDeleteItem,
	options = [],
	create = false,
	value,
	border = true,
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
	border?: boolean;
	accordion?: (item: string) => React.ReactNode;
	itemHref?: (item: string) => any;
	optionDisplayDirection?: "top" | "bottom";
	emptyOption?: boolean;
	showOptions?: boolean;
}) {
	return (
		<div className={`${border ? "border-t" : ""} pt-2 mt-1`}>
			<div className='-mt-10'>
				<Heading title={title} variant='h4' />
			</div>
			<div className='relative bottom-10'>
				<AutoComplete
					onChange={(value) => (onAddNewItem ? onAddNewItem(value) : {})}
					value={value}
					optionDisplayDirection={optionDisplayDirection}
					create={create}
					options={options}
					emptyOption={emptyOption}
					showOptions={showOptions}
				/>
			</div>
			<div className='flex flex-col gap-5'>
				{items.map((item, index) => {
					return (
						<div key={index} className='flex flex-row w-full items-center justify-between border-b pb-2'>
							{accordion ? (
								<AccordionListItem
									item={item}
									accordion={accordion}
									onDeleteItem={onDeleteItem}
									itemHref={itemHref}
								/>
							) : itemHref ? (
								<Link href={itemHref ? itemHref(item) : ""}>
									<div>{item}</div>
									{onDeleteItem ? (
										<Button size='sm' color='red' onClick={() => onDeleteItem(item)}>
											<XMarkIcon className='w-5 h-5 text-white' />
										</Button>
									) : (
										<div></div>
									)}
								</Link>
							) : (
								<>
									<div>{item}</div>
									{onDeleteItem ? (
										<Button size='sm' color='red' onClick={() => onDeleteItem(item)}>
											<XMarkIcon className='w-5 h-5 text-white' />
										</Button>
									) : (
										<div></div>
									)}
								</>
							)}
						</div>
					);
				})}
			</div>
		</div>
	);
}

function AccordionListItem({
	item,
	accordion,
	onDeleteItem,
	itemHref,
}: {
	item: string;
	accordion: (item: string) => React.ReactNode;
	onDeleteItem?: (item: string) => void;
	itemHref?: (item: string) => any;
}) {
	const [open, setOpen] = React.useState(false);
	return (
		<Accordion
			open={open}
			icon={
				open ? (
					<ChevronUpIcon className='w-5 h-5 transition-transform' />
				) : (
					<ChevronDownIcon className='w-5 h-5 transition-transform' />
				)
			}>
			<AccordionHeader onClick={() => setOpen(!open)}>
				{onDeleteItem ? (
					<div className='flex flex-row justify-between w-full items-center'>
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
						<Button size='sm' color='red' onClick={() => onDeleteItem(item)} className='mr-5'>
							<XMarkIcon className='w-5 h-5 text-white' />
						</Button>
					</div>
				) : (
					<div>{item}</div>
				)}
			</AccordionHeader>
			<AccordionBody>{accordion(item)}</AccordionBody>
		</Accordion>
	);
}
