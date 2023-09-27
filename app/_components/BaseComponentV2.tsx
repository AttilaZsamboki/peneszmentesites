"use client";
import StackedList, { FilterItem, ItemContent, PaginationOptions } from "../_components/StackedList";
import Heading from "../_components/Heading";
import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

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
	sort,
	filters = [],
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
	sort?: { by: string; order: "asc" | "desc" };
	filters?: FilterItem[];
}) {
	return (
		<main className='flex min-h-screen flex-col items-center justify-start w-full'>
			<div className='flex flex-col items-center justify-start w-full border-b bg-white'>
				<div className='lg:w-2/3 flex flex-row justify-between py-0'>
					<Heading border={false} width='w-full' title={title} marginY='mt-11 mb-8' variant='h2'>
						{createButtonTitle ? (
							createPath ? (
								<Link href={createPath}>
									<div className='flex flex-row justify-end w-full relative top-3 z-50 items-center gap-3'>
										<Button className='w-36 h-10 flex items-center justify-center py-4 rounded-md hover:shadow-none shadow-none font-semibold uppercase'>
											{createButtonTitle}
										</Button>
									</div>
								</Link>
							) : (
								<div onClick={onCreateNew}>
									<div className='flex flex-row justify-end w-full relative top-3 z-50 items-center gap-3'>
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
			<div className='flex flex-row justify-center w-full flex-wrap'>
				<StackedList
					onEditItem={onEditItem}
					filters={filters}
					data={data}
					editHref={editHref}
					editType={editType}
					itemContent={itemContent}
					pagination={pagination}
					sort={sort}
					title={title}
				/>
			</div>
		</main>
	);
}
