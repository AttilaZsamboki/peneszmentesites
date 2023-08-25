import { Menu, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { DocumentDuplicateIcon, TrashIcon, BookmarkSquareIcon, PencilIcon } from "@heroicons/react/24/outline";

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
	onDuplicate: () => void;
	onEdit?: () => void;
}) {
	return (
		<div className='text-right'>
			<Menu as='div' className='relative inline-block text-left'>
				<Menu.Button>{children}</Menu.Button>
				<Transition
					as={Fragment}
					enter='transition ease-out duration-100'
					enterFrom='transform opacity-0 scale-95'
					enterTo='transform opacity-100 scale-100'
					leave='transition ease-in duration-75'
					leaveFrom='transform opacity-100 scale-100'
					leaveTo='transform opacity-0 scale-95'>
					<Menu.Items className='absolute z-50 right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none'>
						<div className='px-1 py-1 '>
							<Menu.Item>
								{({ active }) => (
									<button
										className={`${
											active ? "bg-gray-600 text-gray-200" : "text-gray-900"
										} group flex w-full items-center rounded-md px-2 py-2 text-sm`}
										onClick={onSave}>
										<BookmarkSquareIcon className='mr-2 h-5 w-5' aria-hidden='true' />
										Mentés
									</button>
								)}
							</Menu.Item>
							{onEdit ? (
								<Menu.Item>
									{({ active }) => (
										<button
											className={`${
												active ? "bg-gray-600 text-gray-200" : "text-gray-900"
											} group flex w-full items-center rounded-md px-2 py-2 text-sm`}
											onClick={onEdit}>
											<PencilIcon className='mr-2 h-5 w-5' aria-hidden='true' />
											Módosítás
										</button>
									)}
								</Menu.Item>
							) : (
								<div></div>
							)}
							<Menu.Item>
								{({ active }) => (
									<button
										className={`${
											active ? "bg-gray-600 text-gray-200" : "text-gray-900"
										} group flex w-full items-center rounded-md px-2 py-2 text-sm`}
										onClick={onDuplicate}>
										<DocumentDuplicateIcon className='w-5 h-5 mr-2' />
										Másolás
									</button>
								)}
							</Menu.Item>
						</div>
						<div className='px-1 py-1'>
							<Menu.Item>
								{({ active }) => (
									<button
										className={`${
											active ? "bg-gray-600 text-gray-200" : "text-gray-900"
										} group flex w-full items-center rounded-md px-2 py-2 text-sm`}
										onClick={onDelete}>
										<TrashIcon className='w-5 h-5 mr-2' />
										Törlés
									</button>
								)}
							</Menu.Item>
						</div>
					</Menu.Items>
				</Transition>
			</Menu>
		</div>
	);
}
