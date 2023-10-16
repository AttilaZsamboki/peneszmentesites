"use client";
import React from "react";
import { ArchiveBoxIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { usePathname } from "next/navigation";
import CircularProgressBar from "./_components/CircularProgressBar";
import { Toaster } from "@/components/ui/toaster";
import { ChevronDown, Menu, Search } from "lucide-react";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { Separator } from "@/components/ui/separator";
import useBreakpointValue from "./_components/useBreakpoint";

interface Progress {
	percent: number;
}

interface Route {
	name: string;
	href: string;
	icon: any;
	subRoutes: {
		name: string;
		href: string[];
	}[];
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

	const routes: Route[] = [
		{
			name: "Felmérések",
			href: "/",
			icon: <Search className='w-5 h-5' />,
			subRoutes: [
				{
					name: "Felmérések",
					href: ["/", "/new"],
				},
				{
					name: "Kérdések",
					href: ["/questions"],
				},
				{
					name: "Sablonok",
					href: ["/templates"],
				},
			],
		},
		{
			name: "Készlet",
			href: "/products",
			icon: <ArchiveBoxIcon className='w-5 h-5' />,
			subRoutes: [
				{
					name: "Termékek",
					href: ["/products"],
				},
			],
		},
	];

	return (
		<div className='overflow-hidden h-[100dvh]'>
			{progress.percent ? <CircularProgressBar percent={progress.percent} /> : null}
			<div className='flex w-full h-full'>
				<Navbar routes={routes} />

				<div className='flex flex-col w-full'>
					<GlobalContext.Provider value={{ setProgress, progress }}>
						<div className='w-full'>{children}</div>
						<Toaster />
					</GlobalContext.Provider>
				</div>
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

function Navbar({ routes }: { routes: Route[] }) {
	const deviceSize = useBreakpointValue();
	const router = usePathname().split("?")[0];
	const [open, setOpen] = React.useState("");
	const [openNav, setOpenNav] = React.useState(false);
	const [ref] = useAutoAnimate<HTMLDivElement>();

	React.useEffect(() => {
		setOpenNav(deviceSize !== "sm");
	}, [deviceSize]);

	const handleSetOpen = (route: string) => {
		setOpen((prev) => (prev === route ? "" : route));
	};
	const routerParts = router.split("/");
	const routerBasePath = isNaN(Number(routerParts[1])) ? routerParts[1] : routerParts[0]; // Check if the base path is an integer
	const activeRoute: any = routes.find(
		(route) =>
			route.subRoutes.some((subRoute) => subRoute.href.includes("/" + routerBasePath)) ||
			"/" + routerBasePath === route.href
	);

	return (
		<div className='flex' ref={ref}>
			{!openNav ? (
				deviceSize === "sm" || !deviceSize ? (
					<div
						className='border rounded-sm active:bg-white cursor-pointer absolute top-2 left-2 bg-white'
						onClick={() => setOpenNav((prev) => !prev)}>
						<Menu className='' />
					</div>
				) : (
					<aside className='border-r'>
						<div className='flex flex-col items-center w-16 h-screen py-8 space-y-8 bg-white dark:bg-gray-900 dark:border-gray-700 sticky top-0'>
							<div className='flex flex-col items-center w-16 h-screen py-8 space-y-8 bg-white dark:bg-gray-900 dark:border-gray-700 sticky top-0'>
								<div
									className='pb-2 active:bg-white cursor-pointer'
									onClick={() => setOpenNav((prev) => !prev)}>
									<Menu className='bg-white' />
								</div>
								<div className='self-center'>
									<a href='/'>
										<img src='/logo.jpg' className='w-15 h-5' />
									</a>
								</div>

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
				)
			) : (
				<div className='flex'>
					<aside className='border-r'>
						<div className='flex flex-col items-start w-[250px] lg:w-[300px] h-full py-8 space-y-8 bg-white dark:bg-gray-900 dark:border-gray-700 sticky top-0'>
							<div className='flex flex-col items-start w-full px-4 h-full bg-white dark:bg-gray-900 dark:border-gray-700 sticky top-0 gap-2'>
								<div
									className='pb-2 active:bg-white cursor-pointer justify-self-end self-end'
									onClick={() => setOpenNav((prev) => !prev)}>
									<Menu className='bg-white' />
								</div>
								<div className='self-center pb-6'>
									<a href='/'>
										<img src='/logo.jpg' className='w-full h-10' />
									</a>
								</div>

								{routes.map((route) => {
									return (
										<div key={route.href} className='flex flex-col w-full'>
											<div
												className={`${
													route.subRoutes
														? router === route.href
															? "bg-gray-200"
															: "text-gray-500 dark:text-gray-400 dark:hover:bg-gray-800 hover:bg-gray-100"
														: ""
												} focus:outline-nones flex flex-row w-full p-2 items-center gap-5 transition-colors duration-200 rounded-lg relative`}>
												<Link
													key={route.href}
													href={route.href}
													className='w-full flex flex-row gap-5'>
													<div>{route.icon}</div>
													<div>{route.name}</div>
												</Link>
												<ChevronDown
													className={`w-5 ${
														route.subRoutes.length > 1 ? "" : "opacity-0"
													} h-5 absolute right-3 transform transition-transform duration-300 cursor-pointer ${
														open === route.name ? "rotate-180" : ""
													}`}
													onClick={() =>
														handleSetOpen(activeRoute === route ? route.name : "")
													}
												/>
											</div>
											{open === route.name ? (
												<div className='flex flex-row w-full px-3 gap-2 pt-2'>
													<Separator
														orientation='vertical'
														className='w-[3px] text-gray-600'
													/>
													<div className='flex flex-col gap-1 w-full'>
														{route.subRoutes.map((subRoute, index) =>
															index === 0 ? null : (
																<Link
																	key={subRoute.href[0]}
																	href={subRoute.href[0]}
																	className={`${
																		subRoute.href.includes(router)
																			? "bg-gray-200"
																			: "text-gray-500 dark:text-gray-400 dark:hover:bg-gray-800 hover:bg-gray-100"
																	} focus:outline-nones flex flex-row w-full p-2 items-center gap-5 transition-colors duration-200 rounded-lg`}>
																	<div className=''>{subRoute.name}</div>
																</Link>
															)
														)}
													</div>
												</div>
											) : null}
										</div>
									);
								})}
							</div>
						</div>
					</aside>
				</div>
			)}
		</div>
	);
}
