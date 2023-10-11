import { DocumentDuplicateIcon, TrashIcon, BookmarkSquareIcon, PencilIcon } from "@heroicons/react/24/outline";
import {
	DropdownMenu as Dropdown,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuShortcut,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { DropdownMenuGroup } from "@radix-ui/react-dropdown-menu";
import React from "react";
import { EllipsisVerticalIcon } from "@heroicons/react/20/solid";
import { useHotkeys } from "react-hotkeys-hook";

export default function DropdownMenu({
	children = <EllipsisVerticalIcon className='w-5 h-5' />,
	onDelete,
	onSave,
	onDuplicate,
	onEdit,
	dropdownMenuItems,
}: {
	children?: React.ReactNode;
	onDelete?: () => void;
	onSave?: () => void;
	onDuplicate?: () => void;
	onEdit?: () => void;
	dropdownMenuItems?: { value: React.ReactNode; onClick: () => void; icon?: React.ReactNode; shortcut?: string }[];
}) {
	useHotkeys(dropdownMenuItems ? dropdownMenuItems.map((item) => item.shortcut ?? "") : [], (_, handler) => {
		if (!dropdownMenuItems) return;
		const keyShortCuts =
			(handler.ctrl ? "ctrl+" : "") +
			(handler.alt ? "alt+" : "") +
			(handler.shift ? "shift+" : "") +
			handler.keys?.join("");
		dropdownMenuItems!.forEach((item) => {
			if (item.shortcut === keyShortCuts) {
				item.onClick();
			}
		});
	});

	return (
		<Dropdown>
			<DropdownMenuTrigger>{children}</DropdownMenuTrigger>
			<DropdownMenuContent className='w-56'>
				<DropdownMenuGroup>
					{onSave ? (
						<DropdownMenuItem onClick={onSave}>
							<div className='flex flex-row'>
								<BookmarkSquareIcon className='mr-2 h-5 w-5' aria-hidden='true' />
								Mentés
							</div>
							<DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
						</DropdownMenuItem>
					) : null}
					{dropdownMenuItems ? (
						dropdownMenuItems.map((item) => (
							<DropdownMenuItem key={item.shortcut} onClick={item.onClick}>
								<div className='flex flex-row'>
									{item.icon ? item.icon : null}
									{item.value}
								</div>
								{item.shortcut ? (
									<>
										<DropdownMenuShortcut className='uppercase'>
											{item.shortcut}
										</DropdownMenuShortcut>
									</>
								) : null}
							</DropdownMenuItem>
						))
					) : (
						<></>
					)}
					{onEdit ? (
						<DropdownMenuItem onClick={onEdit}>
							<PencilIcon className='mr-2 h-5 w-5' aria-hidden='true' />
							Módosítás
						</DropdownMenuItem>
					) : (
						<div></div>
					)}
					{onDuplicate ? (
						<DropdownMenuItem onClick={onDuplicate}>
							<DocumentDuplicateIcon className='w-5 h-5 mr-2' />
							Másolás
						</DropdownMenuItem>
					) : null}
					{onDelete ? (
						<>
							<DropdownMenuSeparator />
							<DropdownMenuItem onClick={onDelete}>
								<TrashIcon className='w-5 h-5 mr-2 text-red-900' />
								Törlés
							</DropdownMenuItem>
						</>
					) : null}
				</DropdownMenuGroup>
			</DropdownMenuContent>
		</Dropdown>
	);
}
