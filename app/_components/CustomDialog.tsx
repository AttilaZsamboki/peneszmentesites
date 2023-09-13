"use client";
import { Button, Card, CardBody, CardFooter, CardHeader, Dialog, Typography } from "@material-tailwind/react";
import React from "react";

import { TrashIcon } from "@heroicons/react/20/solid";

export default function CustomDialog({
	open,
	handler,
	children,
	onSave,
	title,
	onCancel,
	onDelete,
	disabledSubmit,
}: {
	open: boolean;
	handler: () => void;
	children: React.ReactNode;
	onSave?: () => void;
	title: string;
	onCancel?: () => void;
	onDelete?: () => void;
	disabledSubmit?: boolean;
}) {
	return (
		<Dialog
			size='lg'
			open={open}
			handler={handler}
			className='bg-transparent shadow-none max-h-[90%] overflow-y-scroll pt-10 pb-3'>
			<Card className='mx-auto w-full max-w-full max-h-[70%]'>
				<CardHeader variant='gradient' color='gray' className='mb-4 pl-4 grid h-28 place-items-center '>
					<div className='flex flex-row w-full items-center justify-between px-20'>
						<Typography variant='h4' color='white' className='text-left'>
							{title}
						</Typography>
						{onDelete ? (
							<Button onClick={onDelete}>
								<TrashIcon className='w-7 h-7 text-red-700' />
							</Button>
						) : null}
					</div>
				</CardHeader>
				<CardBody className='flex flex-col gap-4 overflow-y-scroll h-[70%]'>{children}</CardBody>
				<CardFooter className='-bottom-5 sticky bg-white z-50 rounded-b-md'>
					<div className='flex flex-row justify-end w-full gap-5'>
						<Button
							color='green'
							disabled={disabledSubmit}
							onClick={() => {
								onSave ? onSave() : {};
								handler();
							}}>
							Mentés
						</Button>
						<Button
							variant='outlined'
							onClick={() => {
								handler();
								onCancel ? onCancel() : {};
							}}>
							Mégsem
						</Button>
					</div>
				</CardFooter>
			</Card>
		</Dialog>
	);
}
