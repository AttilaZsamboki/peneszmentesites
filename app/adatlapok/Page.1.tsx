"use client";
import { useLocalStorageStateObject } from "@/lib/utils";
import { Tabs, TabsHeader, Tab } from "@material-tailwind/react";
import { KanbanIcon, ListIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Header({ searchParams }: { searchParams: { view: "grid" | "kanban" } }) {
	const router = useRouter();
	const [activeTab, setActiveTab] = useLocalStorageStateObject("kanban", "kanban");

	if (!searchParams.view) {
		router.push("/adatlapok?view=" + activeTab);
	}
	return (
		<Tabs value={activeTab} className='flex flex-row w-full pl-3 lg:pl-6 items-center '>
			<TabsHeader
				key='kanban'
				className='rounded-none bg-transparent p-0'
				indicatorProps={{
					className: "bg-transparent border-b-2 border-gray-900 mx-3 shadow-none rounded-none",
				}}>
				<Link href='/adatlapok?view=kanban' onClick={() => setActiveTab("kanban")}>
					<Tab value='kanban' className='pb-2'>
						<h1 className='text-sm font-medium text-gray-900 dark:text-gray-50 flex items-center'>
							<KanbanIcon className='mr-2 h-4 w-4' />
							Kanban
						</h1>
					</Tab>
				</Link>
			</TabsHeader>
			<TabsHeader
				key='grid'
				className='rounded-none bg-transparent p-0'
				indicatorProps={{
					className: "bg-transparent border-b-2 border-gray-900 mx-3 shadow-none rounded-none",
				}}>
				<Link href='/adatlapok?view=grid' onClick={() => setActiveTab("grid")}>
					<Tab value='grid' className='pb-2'>
						<h1 className='text-sm font-medium text-gray-900 dark:text-gray-50 flex items-center'>
							<ListIcon className='mr-2 h-4 w-4' />
							Lista nézet
						</h1>
					</Tab>
				</Link>
			</TabsHeader>
		</Tabs>
	);
}
