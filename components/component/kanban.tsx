"use client";
import { AdatlapData } from "@/app/_utils/types";
import KanbanCard from "./kanban-card";
import React from "react";
import { BanIcon, RefreshCwIcon, Send } from "lucide-react";
import { Pagination } from "@/app/page";
import { Button } from "../ui/button";
import { AdatlapDialog, AdatlapokV2Context } from "@/app/adatlapok/Page.1";

export function Kanban({ data }: { data: Pagination<AdatlapData> }) {
	const cols = [
		{
			id: "backlog",
			title: "Felmérésre vár",
			icon: <BackpackIcon className='mr-2 h-4 w-4' />,
			data: (data: AdatlapData[]) => data.filter((adatlap) => adatlap.StatusId === 3023),
			minAmount: 5,
		},
		{
			id: "offer-sent",
			title: "Ajánlat kiküldve",
			icon: <Send className='mr-2 h-4 w-4' />,
			data: (data: AdatlapData[]) =>
				data.filter((adatlap) => adatlap.AjanlatKikuldve && adatlap.RendelesStatusz === null),
			minAmount: 0,
		},
		{
			id: "todo",
			title: "Beépítésre vár",
			icon: <ListTodoIcon className='mr-2 h-4 w-4' />,
			data: (data: AdatlapData[]) =>
				data.filter(
					(adatlap) =>
						adatlap.RendelesStatusz === "Szervezésre vár" || adatlap.RendelesStatusz === "Beépítésre vár"
				),
			minAmount: 3,
		},
		{
			id: "inprogress",
			title: "Elszámolásra vár",
			icon: <ActivityIcon className='mr-2 h-4 w-4' />,
			data: (data: AdatlapData[]) => data.filter((adatlap) => adatlap.RendelesStatusz === "Elszámolásra vár"),
			minAmount: 0,
		},
		{
			id: "done",
			title: "Lezárva",
			icon: <CheckIcon className='mr-2 h-4 w-4' />,
			data: (data: AdatlapData[]) => data.filter((adatlap) => adatlap.RendelesStatusz === "Lezárva"),
			minAmount: 0,
		},
		{
			id: "denied",
			title: "Elutasítva",
			icon: <BanIcon className='mr-2 h-4 w-4' />,
			data: (data: AdatlapData[]) => data.filter((adatlap) => adatlap.AjanlatElutasitva),
			minAmount: 0,
		},
	];
	const { fetchNextPage } = React.useContext(AdatlapokV2Context);

	return (
		<main className='flex overflow-x-scroll py-3 px-4 bg-gray-100'>
			<div className='flex space-x-4 w-0'>
				{cols.map((col) => {
					const colData = col.data(data.results);
					return (
						<div>
							<h2 className='mb-4 text-sm font-medium text-gray-400 dark:text-gray-300 flex items-center'>
								{col.icon}
								{col.title}
							</h2>
							<div className='w-[370px] h-[85dvh] overflow-y-scroll'>
								<div className='flex flex-col gap-4 items-center'>
									{colData.map((adatlap) => {
										return (
											<AdatlapDialog adatlap={adatlap}>
												<KanbanCard adatlap={adatlap} />
											</AdatlapDialog>
										);
									})}
									{data.next ? (
										<Button onClick={async () => await fetchNextPage()}>
											<RefreshCwIcon className='w-4 h-4 mr-2' />
											Több adat
										</Button>
									) : null}
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
