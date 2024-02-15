"use client";
import { AdatlapData } from "@/app/_utils/types";
import KanbanCard from "./kanban-card";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import React from "react";

export function Kanban({ data }: { data: AdatlapData[] }) {
	const cols = [
		{
			id: "backlog",
			title: "Backlog",
			items: data,
			icon: <BackpackIcon className='mr-2 h-4 w-4' />,
		},
		{
			id: "todo",
			title: "To Do",
			items: data,
			icon: <ListTodoIcon className='mr-2 h-4 w-4' />,
		},
		{
			id: "inprogress",
			title: "In Progress",
			items: data,
			icon: <ActivityIcon className='mr-2 h-4 w-4' />,
		},
		{
			id: "done",
			title: "Done",
			items: data,
			icon: <CheckIcon className='mr-2 h-4 w-4' />,
		},
	];
	return (
		<DragDropContext
			onDragEnd={() => {
				console.log("drag started");
			}}>
			<main className='flex-1 overflow-auto py-4 px-4 bg-gray-100'>
				<div className='flex space-x-4'>
					{cols.map((col) => (
						<Droppable droppableId={col.id}>
							{(provided: any) => (
								<div ref={provided.innerRef} {...provided.droppableProps}>
									<h2 className='mb-4 text-sm font-medium text-gray-400 dark:text-gray-300 flex items-center'>
										{col.icon}
										{col.title}
									</h2>
									<div className='w-[350px] h-[85dvh] overflow-y-scroll'>
										<div className='flex flex-col gap-2'>
											{data.map((adatlap, index) => (
												<Draggable
													key={adatlap.Id}
													draggableId={col.id + adatlap.Id.toString()}
													index={index}>
													{(provided) => (
														<div
															ref={provided.innerRef}
															{...provided.draggableProps}
															{...provided.dragHandleProps}>
															<KanbanCard adatlap={adatlap} />
														</div>
													)}
												</Draggable>
											))}
											{provided.placeholder}
										</div>
									</div>
								</div>
							)}
						</Droppable>
					))}
				</div>
			</main>
		</DragDropContext>
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
