"use client";
import React from "react";
import { HomeIcon, ArchiveBoxIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { usePathname } from "next/navigation";
import CircularProgressBar from "./_components/CircularProgressBar";
import { Toaster } from "@/components/ui/toaster";
import { Tab, Tabs, TabsHeader } from "@material-tailwind/react";
import { Menu } from "lucide-react";
import { useAutoAnimate } from "@formkit/auto-animate/react";

interface Progress {
	percent: number;
}

export const GlobalContext = React.createContext<{
	setProgress: React.Dispatch<React.SetStateAction<Progress>>;
	progress: Progress;
}>({
	setProgress: () => {},
	progress: { percent: 0 },
});

export default function RootLayoutClient({ children }: { children: React.ReactNode }) {
	const [progress, setProgress] = React.useState<Progress>({ percent: 0 });
	const [openNav, setOpenNav] = React.useState(false);
	const [ref] = useAutoAnimate<HTMLDivElement>();

	React.useEffect(() => {
		if (progress.percent === 100) {
			setTimeout(() => {
				setProgress({ percent: 0 });
			}, 2500);
		}
	}, [progress.percent]);

	const routes: { name: string; href: string; icon: any; subRoutes: { name: string; href: string }[] }[] = [
		{
			name: "Főoldal",
			href: "/",
			icon: <HomeIcon className='w-6 h-6' />,
			subRoutes: [
				{
					name: "Felmérések",
					href: "/",
				},
				{
					name: "Kérdések",
					href: "/questions",
				},
				{
					name: "Sablonok",
					href: "/templates",
				},
				{
					name: "Felmérések",
					href: "/new",
				},
			],
		},
		{
			name: "Készlet",
			href: "/products",
			icon: <ArchiveBoxIcon className='w-6 h-6' />,
			subRoutes: [
				{
					name: "Termékek",
					href: "/products",
				},
			],
		},
	];

	return (
		<div className='overflow-hidden h-[100dvh]'>
			{progress.percent ? <CircularProgressBar percent={progress.percent} /> : null}
			<div className='flex w-full h-full' ref={ref}>
				{openNav ? <Navbar routes={routes} /> : null}
				<Navbar2 setOpen={setOpenNav} routes={routes}>
					<GlobalContext.Provider value={{ setProgress, progress }}>
						{children}
						<Toaster />
					</GlobalContext.Provider>
				</Navbar2>
			</div>
		</div>
	);
}

export function useGlobalState() {
	const context = React.useContext(GlobalContext);
	if (context === undefined) {
		throw new Error("useNavbarState must be used within a NavbarProvider");
	}
	return context;
}

function Navbar({
	routes,
}: {
	routes: { name: string; href: string; icon: any; subRoutes: { name: string; href: string }[] }[];
}) {
	const router = usePathname();

	return (
		<div className='flex'>
			<aside className='border-r'>
				<div className='flex flex-col items-center w-16 h-screen py-8 space-y-8 bg-white dark:bg-gray-900 dark:border-gray-700 sticky top-0'>
					<div className='flex flex-col items-center w-16 h-screen py-8 space-y-8 bg-white dark:bg-gray-900 dark:border-gray-700 sticky top-0'>
						<a href='/'>
							<img src='/logo.jpg' className='w-15 h-5' />
						</a>

						{routes.map((route) => (
							<Link
								key={route.href}
								href={route.href}
								className={`p-1.5 ${
									route.subRoutes
										? [...route.subRoutes.map((route) => route.href), route.href].includes(
												"/" + router.split("/")[1]
										  )
											? "bg-gray-200"
											: "text-gray-500 dark:text-gray-400 dark:hover:bg-gray-800 hover:bg-gray-100"
										: ""
								} focus:outline-nones transition-colors duration-200 rounded-lg`}>
								{route.icon}
							</Link>
						))}
					</div>
				</div>
			</aside>
		</div>
	);
}

function Navbar2({
	children,
	routes,
	setOpen,
}: {
	children: React.ReactNode;
	routes: { name: string; href: string; icon: any; subRoutes: { name: string; href: string }[] }[];
	setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
	const router = usePathname().split("?")[0];

	const routerParts = router.split("/");
	const routerBasePath = isNaN(Number(routerParts[1])) ? routerParts[1] : routerParts[0]; // Check if the base path is an integer

	const activeRoute = routes.find(
		(route) =>
			route.subRoutes.some((subRoute) => "/" + routerBasePath === subRoute.href) ||
			"/" + routerBasePath === route.href
	);

	return (
		<div className='flex flex-col w-full'>
			{activeRoute ? (
				<div className='bg-white sm:border-t-0 border-t lg:relative absolute bottom-0 md:top-0 md:fixed z-50 w-full pt-2'>
					<Tabs value={router} className='flex flex-row w-full border-b pl-3 lg:pl-6 items-center'>
						<TabsHeader
							className='rounded-none bg-transparent p-0 cursor-pointer'
							onClick={() => {
								setOpen((prev) => !prev);
							}}
							indicatorProps={{
								className: "bg-transparent border-b-2 border-gray-900 mx-3 shadow-none rounded-none",
							}}>
							<div className='pb-2 bg-white active:bg-white'>
								<Menu className='bg-white' />
							</div>
						</TabsHeader>
						{activeRoute?.subRoutes.map((route) => (
							<TabsHeader
								key={route.href}
								className='rounded-none bg-transparent p-0'
								indicatorProps={{
									className:
										"bg-transparent border-b-2 border-gray-900 mx-3 shadow-none rounded-none",
								}}>
								<Link href={route.href}>
									<Tab value={route.href} className='pb-2'>
										<div className='hover:bg-gray-100 px-3 py-1 rounded-md'>{route.name}</div>
									</Tab>
								</Link>
							</TabsHeader>
						))}
					</Tabs>
				</div>
			) : null}
			<div className='w-full'>{children}</div>
		</div>
	);
}
