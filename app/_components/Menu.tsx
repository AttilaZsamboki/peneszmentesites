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

export default function DropdownMenu({
	children,
	onDelete,
	onSave,
	onDuplicate,
	onEdit,
}: {
	children: React.ReactNode;
	onDelete: () => void;
	onSave: () => void;
	onDuplicate?: () => void;
	onEdit?: () => void;
}) {
	return (
		<Dropdown>
			<DropdownMenuTrigger>{children}</DropdownMenuTrigger>
			<DropdownMenuContent className='w-56'>
				<DropdownMenuGroup>
					<DropdownMenuItem onClick={onSave}>
						<div className='flex flex-row'>
							<BookmarkSquareIcon className='mr-2 h-5 w-5' aria-hidden='true' />
							Mentés
						</div>
						<DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
					</DropdownMenuItem>
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
					<DropdownMenuSeparator />
					<DropdownMenuItem onClick={onDelete}>
						<TrashIcon className='w-5 h-5 mr-2 text-red-900' />
						Törlés
					</DropdownMenuItem>
				</DropdownMenuGroup>
			</DropdownMenuContent>
		</Dropdown>
	);
}
