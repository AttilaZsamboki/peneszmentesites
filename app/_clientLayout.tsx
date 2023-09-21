"use client";
import React from "react";
import { HomeIcon, ArchiveBoxIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { usePathname } from "next/navigation";
import CircularProgressBar from "./_components/CircularProgressBar";
import { Toaster } from "@/components/ui/toaster";
import { Tab, Tabs, TabsHeader } from "@material-tailwind/react";

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
			href: "/felmeresek",
			icon: <HomeIcon className='w-6 h-6' />,
			subRoutes: [
				{
					name: "Felmérések",
					href: "/felmeresek",
				},
				{
					name: "Kérdések",
					href: "/questions",
				},
				{
					name: "Sablonok",
					href: "/templates",
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
		<div>
			{progress.percent ? <CircularProgressBar percent={progress.percent} /> : null}
			<div className='flex w-full h-full'>
				<Navbar routes={routes} />
				<Navbar2 routes={routes}>
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
		<div className='flex border-r'>
			<aside>
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

				{/* <div className='h-screen py-8 overflow-y-auto bg-white border-l border-r sm:w-64 w-60 dark:bg-gray-900 dark:border-gray-700 sticky top-0'>
					<h2 className='px-5 text-lg font-medium text-gray-800 dark:text-white'>
						{
							routes.find((route) =>
								route.subRoutes
									? [...route.subRoutes.map((route) => route.href), route.href].includes(
											"/" + router.split("/")[1]
									)
									: false
							)!.name
						}
					</h2>

					<div className='mt-8 space-y-4'>
						{routes
							.find((route) =>
								route.subRoutes
									? [...route.subRoutes.map((route) => route.href), route.href].includes(
											"/" + router.split("/")[1]
									)
									: false
							)!
							.subRoutes.map((route) => {
								return (
									<Link key={route.href} href={route.href}>
										<button
											className={`${
												route.href === router
													? "bg-gray-200"
													: "text-gray-500 dark:text-gray-400 dark:hover:bg-gray-800 hover:bg-gray-100"
											}  flex items-center w-full px-5 py-2 transition-colors duration-200 gap-x-2 focus:outline-none`}>
											<div className='text-left rtl:text-right'>
												<h1 className='text-sm font-medium text-gray-700 capitalize dark:text-white'>
													{route.name}
												</h1>
											</div>
										</button>
									</Link>
								);
							})}
					</div>
				</div> */}
			</aside>
		</div>
	);
}

function Navbar2({
	children,
	routes,
}: {
	children: React.ReactNode;
	routes: { name: string; href: string; icon: any; subRoutes: { name: string; href: string }[] }[];
}) {
	const router = usePathname().split("?")[0];

	const activeRoute = routes.find(
		(route) => route.subRoutes.map((route) => route.href).includes(router) || route.href === router
	);
	return (
		<div className='flex flex-col w-full'>
			{activeRoute ? (
				<div className='bg-white pt-2'>
					<Tabs value={router} className='flex flex-row w-full border-b pl-6'>
						{activeRoute?.subRoutes.map((route) => (
							<TabsHeader
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
