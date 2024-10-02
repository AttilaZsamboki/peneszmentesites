"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Settings, Users, Mail, GitBranch, Database, ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const sidebarItems = [
	{ name: "Általános Beállítások", href: "/settings", icon: Settings },
	{ name: "User Management", href: "/settings/users", icon: Users },
	{ name: "Email Integration", href: "/settings/email", icon: Mail },
	{ name: "Automation Rules", href: "/settings/automation", icon: GitBranch },
	{ name: "Data Import/Export", href: "/settings/data", icon: Database },
];

export default function SettingsLayoutComponent({ children }: { children: React.ReactNode }) {
	const [isOpen, setIsOpen] = useState(false);
	const pathname = usePathname();

	return (
		<div className='grid lg:grid-cols-5'>
			<main className='col-span-3 lg:col-span-4 lg:border-r h-dvh'>
				<div className='h-full px-4 py-6 lg:px-8'>{children}</div>
			</main>
			<Sheet open={isOpen} onOpenChange={setIsOpen}>
				<SheetTrigger asChild>
					<Button variant='ghost' className='lg:hidden fixed right-4 top-4 z-40 w-10 px-0'>
						<ChevronRight className='h-6 w-6' />
						<span className='sr-only'>Toggle Settings Menu</span>
					</Button>
				</SheetTrigger>
				<SheetContent side='right' className='w-[240px] sm:w-[300px] pr-0'>
					<MobileSidebar pathname={pathname} setIsOpen={setIsOpen} />
				</SheetContent>
			</Sheet>
			<aside className='hidden lg:block'>
				<DesktopSidebar pathname={pathname} />
			</aside>
		</div>
	);
}

function MobileSidebar({ pathname, setIsOpen }: { pathname: string; setIsOpen: (isOpen: boolean) => void }) {
	return (
		<ScrollArea className='my-4 h-[calc(100vh-8rem)] pb-10 pr-6'>
			<div className='flex flex-col gap-2'>
				{sidebarItems.map((item) => (
					<MobileLink key={item.href} href={item.href} pathname={pathname} setIsOpen={setIsOpen}>
						<item.icon className='mr-2 h-4 w-4' />
						{item.name}
					</MobileLink>
				))}
			</div>
		</ScrollArea>
	);
}

function MobileLink({
	children,
	href,
	pathname,
	setIsOpen,
}: {
	children: React.ReactNode;
	href: string;
	pathname: string;
	setIsOpen: (isOpen: boolean) => void;
}) {
	return (
		<Link
			href={href}
			className={cn(
				"flex items-center rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50",
				pathname === href ? "bg-gray-100 text-gray-900" : "text-gray-500"
			)}
			onClick={() => setIsOpen(false)}>
			{children}
		</Link>
	);
}

function DesktopSidebar({ pathname }: { pathname: string }) {
	return (
		<div className='space-y-4 py-4'>
			<div className='px-3 py-2'>
				<h2 className='mb-2 px-4 text-lg font-semibold tracking-tight'>Beállítások</h2>
				<div className='space-y-1'>
					{sidebarItems.map((item) => (
						<Button
							key={item.href}
							variant={pathname === item.href ? "secondary" : "ghost"}
							className='w-full justify-start'
							asChild>
							<Link href={item.href}>
								<item.icon className='mr-2 h-4 w-4' />
								{item.name}
							</Link>
						</Button>
					))}
				</div>
			</div>
		</div>
	);
}

function GeneralSettings() {
	return (
		<div className='space-y-6'>
			<div>
				<h3 className='text-lg font-medium'>Általános Beállítások</h3>
				<p className='text-sm text-muted-foreground'>Manage your API key and system ID.</p>
			</div>
			<div className='space-y-4'>
				<div className='space-y-2'>
					<Label htmlFor='api-key'>API Kulcs</Label>
					<Input id='api-key' type='password' placeholder='Add meg az API kulcsod' />
				</div>
				<div className='space-y-2'>
					<Label htmlFor='system-id'>Rendszer azonosító</Label>
					<Input id='system-id' placeholder='Add meg a Rendszer azonosítód' />
				</div>
			</div>
			<Button>Mentés</Button>
		</div>
	);
}

export { GeneralSettings };
