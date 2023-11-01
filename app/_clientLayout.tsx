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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getCookie, createJWT, useLocalStorageState, useUserWithRole, Role } from "@/lib/utils";
import jwt from "jsonwebtoken";

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

				<div className='flex flex-col w-full relative z-10'>
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
	const pathname = usePathname().split("?")[0];
	const [open, setOpen] = React.useState("");
	const [openNav, setOpenNav] = useLocalStorageState("navbarOpen", deviceSize === "2xl");
	const [ref] = useAutoAnimate<HTMLDivElement>();

	const handleSetOpen = (route: string) => {
		setOpen((prev) => (prev === route ? "" : route));
	};
	const routerParts = pathname.split("/");
	const routerBasePath = isNaN(Number(routerParts[1])) ? routerParts[1] : routerParts[0]; // Check if the base path is an integer
	const activeRoute: any = routes.find(
		(route) =>
			route.subRoutes.some((subRoute) => subRoute.href.includes("/" + routerBasePath)) ||
			"/" + routerBasePath === route.href
	);
	const { user, error, isLoading } = useUserWithRole();

	if (!user && !isLoading) {
		window.location.href = "/api/auth/login";
		return null;
	}
	if (user && user.sub) {
		const JWT = getCookie("jwt");
		if (!JWT) {
			document.cookie = `jwt=${createJWT(user.sub!)}; path=/`;
		} else if (JWT) {
			try {
				jwt.verify(JWT, process.env.NEXT_PUBLIC_SECRET as string);
			} catch (err) {
				if (err instanceof jwt.TokenExpiredError) {
					document.cookie = `jwt=${createJWT(user.sub!)}; path=/`;
				}
			}
		}
	}
	return (
		<div className='flex' ref={ref}>
			{!openNav ? (
				deviceSize === "sm" || !deviceSize ? (
					<div
						className='rounded-sm cursor-pointer absolute top-2 left-2 z-20'
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
														"/" + pathname.split("/")[1]
												  )
													? "bg-gray-200"
													: "text-gray-500 dark:text-gray-400 dark:hover:bg-gray-800 hover:bg-gray-100"
												: ""
										} focus:outline-nones transition-colors duration-200 rounded-lg`}>
										{route.icon}
									</Link>
								))}

								<div className='flex w-full flex-col items-center h-full relative'>
									<div className='px-2 w-full bottom-0 py-2 absolute'>
										{isLoading ? (
											<div className='flex items-center justify-center w-full h-full'>
												<div className='flex justify-center items-center space-x-1 text-sm text-gray-700'>
													<svg
														fill='none'
														className='w-6 h-6 animate-spin'
														viewBox='0 0 32 32'
														xmlns='http://www.w3.org/2000/svg'>
														<path
															clip-rule='evenodd'
															d='M15.165 8.53a.5.5 0 01-.404.58A7 7 0 1023 16a.5.5 0 011 0 8 8 0 11-9.416-7.874.5.5 0 01.58.404z'
															fill='currentColor'
															fill-rule='evenodd'
														/>
													</svg>
												</div>
											</div>
										) : (
											<div className='flex w-full flex-row items-center gap-2 justify-between'>
												<DropdownMenu>
													<DropdownMenuTrigger>
														<Avatar>
															<AvatarImage src={user?.picture ?? ""} />
															<AvatarFallback>{user?.nickname}</AvatarFallback>
														</Avatar>
													</DropdownMenuTrigger>
													<DropdownMenuContent>
														<DropdownMenuLabel>Fiókom</DropdownMenuLabel>
														<DropdownMenuSeparator />
														<a href='/api/auth/logout'>
															<DropdownMenuItem className='text-red-700 hover:text-red-700 font-semibold'>
																Kijelentkezés
															</DropdownMenuItem>
														</a>
													</DropdownMenuContent>
												</DropdownMenu>
											</div>
										)}
									</div>
								</div>
							</div>
						</div>
					</aside>
				)
			) : (
				<div className='flex'>
					<aside className='border-r'>
						<div className='flex justify-between flex-col items-start w-[250px] lg:w-[300px] h-full py-8 space-y-8 bg-white dark:bg-gray-900 dark:border-gray-700 sticky top-0'>
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
														? pathname === route.href
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
																		subRoute.href.includes(pathname)
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

							<div className='flex w-full flex-col'>
								<Separator className='w-full h-[1px]' />
								<div className='px-8 w-full bg-gray-100 bottom-0 py-8'>
									{isLoading ? (
										<div className='flex items-center justify-center w-full h-full'>
											<div className='flex justify-center items-center space-x-1 text-sm text-gray-700'>
												<svg
													fill='none'
													className='w-6 h-6 animate-spin'
													viewBox='0 0 32 32'
													xmlns='http://www.w3.org/2000/svg'>
													<path
														clip-rule='evenodd'
														d='M15.165 8.53a.5.5 0 01-.404.58A7 7 0 1023 16a.5.5 0 011 0 8 8 0 11-9.416-7.874.5.5 0 01.58.404z'
														fill='currentColor'
														fill-rule='evenodd'
													/>
												</svg>

												<div>Töltődik ...</div>
											</div>
										</div>
									) : !user ? (
										<a href='/api/auth/login'>Login</a>
									) : (
										<div className='flex w-full flex-row items-center gap-2 justify-between'>
											<Avatar>
												<AvatarImage src={user.picture ?? ""} />
												<AvatarFallback>{user.nickname}</AvatarFallback>
											</Avatar>
											<div className='flex flex-col'>
												<DropdownMenu>
													<DropdownMenuTrigger>{user.name}</DropdownMenuTrigger>
													<DropdownMenuContent>
														<DropdownMenuLabel>Fiókom</DropdownMenuLabel>
														<DropdownMenuSeparator />
														<a href='/api/auth/logout'>
															<DropdownMenuItem className='text-red-700 hover:text-red-700 font-semibold'>
																Kijelentkezés
															</DropdownMenuItem>
														</a>
													</DropdownMenuContent>
												</DropdownMenu>
												<p className='text-sm text-muted-foreground text-right'>
													{user.role as unknown as Role}
												</p>
											</div>
										</div>
									)}
								</div>
								<Separator className='w-full h-[1px]' />
							</div>
						</div>
					</aside>
				</div>
			)}
		</div>
	);
}
