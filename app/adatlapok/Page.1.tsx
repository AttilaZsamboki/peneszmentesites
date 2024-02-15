"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useLocalStorageStateObject } from "@/lib/utils";
import { FunnelIcon } from "@heroicons/react/24/outline";
import { Tabs, TabsHeader, Tab } from "@material-tailwind/react";
import { KanbanIcon, ListIcon, SearchIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Header({ searchParams }: { searchParams: { view: "grid" | "kanban" } }) {
	const router = useRouter();
	const [activeTab, setActiveTab] = useLocalStorageStateObject("kanban", "kanban");

	if (!searchParams.view) {
		router.push("/adatlapok?view=" + activeTab);
	}
	return (
		<div className='flex flex-row w-full justify-between px-3 lg:px-6'>
			<Tabs value={activeTab} className='flex flex-row w-full  items-center'>
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
			<div className='flex flex-1 items-center gap-4 md:ml-auto md:gap-2 lg:gap-4'>
				<form className='ml-auto flex-1 sm:flex-initial'>
					<div className='relative'>
						<SearchIcon className='absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400' />
						<Input
							className='pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px] bg-white'
							placeholder='Keress felmérésre...'
							type='search'
						/>
					</div>
				</form>
				<Sheet>
					<SheetTrigger asChild>
						<Button variant={"outline"}>
							<FunnelIcon className='w-5 h-5' />
						</Button>
					</SheetTrigger>
					<SheetContent>
						<SheetHeader>
							<SheetTitle>Szűrők</SheetTitle>
							<SheetDescription>Itt tudsz egyedi mezőkre szűrni</SheetDescription>
						</SheetHeader>
					</SheetContent>
				</Sheet>
			</div>
		</div>
	);
}
