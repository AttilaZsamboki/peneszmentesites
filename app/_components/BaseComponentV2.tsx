"use client";
import StackedList, { FilterItem, ItemContent, PaginationOptions, Sort } from "../_components/StackedList";
import Heading from "../_components/Heading";
import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Filter } from "../products/page";
import { ColDef } from "ag-grid-community";

export default function BaseComponentV2({
	data,
	title,
	editHref,
	editType,
	itemContent,
	createButtonTitle,
	createPath,
	onCreateNew,
	onEditItem,
	pagination = { numPages: 0, active: false },
	filters = [],
	savedFilters = [],
	defaultViewName,
	variant,
	columns,
}: {
	data: any;
	title: string;
	editHref?: string;
	itemContent: ItemContent;
	editType: "link" | "dialog";
	createButtonTitle?: string;
	createPath?: string;
	onCreateNew?: () => void;
	onEditItem?: (item: any) => void;
	pagination?: PaginationOptions;
	filters?: FilterItem[];
	savedFilters?: Filter[];
	defaultViewName?: string;
	columns?: ColDef[];
	variant?: "default" | "grid";
}) {
	return (
		<main className='flex min-h-screen flex-col items-center justify-start w-full'>
			<div className='flex flex-col items-start justify-center w-full border-b bg-white px-6 py-3'>
				<div className='flex flex-row justify-between py-0 w-full'>
					<Heading border={false} width='w-full' title={title} variant='h2'>
						{createButtonTitle ? (
							createPath ? (
								<Link href={createPath}>
									<div className='flex flex-row justify-end w-full relative z-50 items-center gap-3'>
										<Button className='w-36 h-10 flex items-center justify-center py-4 rounded-md hover:shadow-none shadow-none font-semibold uppercase'>
											{createButtonTitle}
										</Button>
									</div>
								</Link>
							) : (
								<div onClick={onCreateNew}>
									<div className='flex flex-row justify-end w-full relative z-50 items-center gap-3'>
										<Button className='w-36 h-10 flex items-center justify-center py-4 rounded-md hover:shadow-none shadow-none font-semibold uppercase'>
											{createButtonTitle}
										</Button>
									</div>
								</div>
							)
						) : null}
					</Heading>
				</div>
			</div>
			<div className='flex flex-row justify-center w-full flex-wrap px-6'>
				<StackedList
					defaultViewName={defaultViewName}
					onEditItem={onEditItem}
					filters={filters}
					data={data}
					editHref={editHref}
					editType={editType}
					itemContent={itemContent}
					pagination={pagination}
					title={title}
					savedFiltersOriginal={savedFilters}
					variant={variant}
					columns={columns}
				/>
			</div>
		</main>
	);
}
