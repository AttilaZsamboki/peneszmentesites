"use client";
import { AdatlapData } from "@/app/_utils/types";
import KanbanCard from "./kanban-card";
import React from "react";
import { Button } from "../ui/button";
import { RefreshCwIcon, Send } from "lucide-react";
import Link from "next/link";
import { useCreateQueryString } from "@/app/_utils/utils";
import { useSearchParams } from "next/navigation";

export function Kanban({ data, next }: { data: AdatlapData[]; next: string | null }) {
	const cols = [
		{
			id: "backlog",
			title: "Felmérésre vár",
			items: data,
			icon: <BackpackIcon className='mr-2 h-4 w-4' />,
			data: (data: AdatlapData[]) => data.filter((adatlap) => adatlap.StatusId === 3023),
		},
		{
			id: "offer-sent",
			title: "Ajánlat kiküldve",
			items: data,
			icon: <Send className='mr-2 h-4 w-4' />,
			data: (data: AdatlapData[]) =>
				data.filter((adatlap) => adatlap.AjanlatKikuldve && !adatlap.RendelesStatusz),
		},
		{
			id: "todo",
			title: "Beépítésre vár",
			items: data,
			icon: <ListTodoIcon className='mr-2 h-4 w-4' />,
			data: (data: AdatlapData[]) =>
				data.filter((adatlap) => adatlap.RendelesStatusz === 3008 || adatlap.RendelesStatusz === 3007),
		},
		{
			id: "inprogress",
			title: "Elszámolásra vár",
			items: data,
			icon: <ActivityIcon className='mr-2 h-4 w-4' />,
			data: (data: AdatlapData[]) => data.filter((adatlap) => adatlap.RendelesStatusz === 3012),
		},
		{
			id: "done",
			title: "Lezárva",
			items: data,
			icon: <CheckIcon className='mr-2 h-4 w-4' />,
			data: (data: AdatlapData[]) => data.filter((adatlap) => adatlap.RendelesStatusz === 3009),
		},
	];
	const searchParams = useSearchParams();
	const queryString = useCreateQueryString(searchParams);
	return (
		<main className='flex-1 overflow-auto py-4 px-4 bg-gray-100'>
			<div className='flex space-x-4'>
				{cols.map((col) => {
					const colData = col.data(data);
					return (
						<div>
							<h2 className='mb-4 text-sm font-medium text-gray-400 dark:text-gray-300 flex items-center'>
								{col.icon}
								{col.title}
							</h2>
							<div className='w-[370px] h-[85dvh] overflow-y-scroll'>
								<div className='flex flex-col gap-4 items-center'>
									{colData.map((adatlap) => {
										return <KanbanCard adatlap={adatlap} />;
									})}
									<Link
										href={
											"/adatlapok?" +
											queryString([
												{
													name: "page",
													value: (
														(parseInt(searchParams.get("page") ?? "1") ?? 1) + 1
													).toString(),
												},
											])
										}>
										{next ? (
											<Button>
												<RefreshCwIcon className='w-4 h-4 mr-2' />
												Több adat
											</Button>
										) : null}
									</Link>
								</div>
							</div>
						</div>
					);
				})}
			</div>
		</main>
	);
}

function BackpackIcon(props: any) {
	return (
		<svg
			{...props}
			xmlns='http://www.w3.org/2000/svg'
			width='24'
			height='24'
			viewBox='0 0 24 24'
			fill='none'
			stroke='currentColor'
			strokeWidth='2'
			strokeLinecap='round'
			strokeLinejoin='round'>
			<path d='M4 20V10a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2Z' />
			<path d='M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2' />
			<path d='M8 21v-5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v5' />
			<path d='M8 10h8' />
			<path d='M8 18h8' />
		</svg>
	);
}

function ListTodoIcon(props: any) {
	return (
		<svg
			{...props}
			xmlns='http://www.w3.org/2000/svg'
			width='24'
			height='24'
			viewBox='0 0 24 24'
			fill='none'
			stroke='currentColor'
			strokeWidth='2'
			strokeLinecap='round'
			strokeLinejoin='round'>
			<rect x='3' y='5' width='6' height='6' rx='1' />
			<path d='m3 17 2 2 4-4' />
			<path d='M13 6h8' />
			<path d='M13 12h8' />
			<path d='M13 18h8' />
		</svg>
	);
}

function ActivityIcon(props: any) {
	return (
		<svg
			{...props}
			xmlns='http://www.w3.org/2000/svg'
			width='24'
			height='24'
			viewBox='0 0 24 24'
			fill='none'
			stroke='currentColor'
			strokeWidth='2'
			strokeLinecap='round'
			strokeLinejoin='round'>
			<path d='M22 12h-4l-3 9L9 3l-3 9H2' />
		</svg>
	);
}

function CheckIcon(props: any) {
	return (
		<svg
			{...props}
			xmlns='http://www.w3.org/2000/svg'
			width='24'
			height='24'
			viewBox='0 0 24 24'
			fill='none'
			stroke='currentColor'
			strokeWidth='2'
			strokeLinecap='round'
			strokeLinejoin='round'>
			<polyline points='20 6 9 17 4 12' />
		</svg>
	);
}
