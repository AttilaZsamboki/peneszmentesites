import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { TrashIcon } from "@heroicons/react/20/solid";
import React from "react";
import { DialogFooter } from "@material-tailwind/react";

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
		<Dialog open={open} onOpenChange={handler}>
			<DialogContent className='max-w-[600px]'>
				<DialogHeader className='flex flex-row justify-between w-full items-center'>
					<DialogTitle>{title}</DialogTitle>
					{onDelete ? (
						<button onClick={onDelete} className='pr-4'>
							<TrashIcon className='w-7 h-7 text-red-700' />
						</button>
					) : null}
				</DialogHeader>
				<div className='flex flex-col gap-4 h-full'>
					<div className='max-h-[700px]'>{children}</div>
				</div>
				<DialogFooter>
					<div className='flex pt-4 flex-row justify-end w-full gap-5'>
						<Button
							className={`${disabledSubmit ? "disabled" : ""}`}
							disabled={disabledSubmit}
							variant='default'
							onClick={() => {
								onSave ? onSave() : {};
								handler();
							}}>
							Mentés
						</Button>
						<Button
							variant='outline'
							onClick={() => {
								handler();
								onCancel ? onCancel() : {};
							}}>
							Mégsem
						</Button>
					</div>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
