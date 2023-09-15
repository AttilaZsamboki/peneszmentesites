"use client";
import React from "react";
import { Alert, Button, Typography } from "@material-tailwind/react";
import { HomeIcon, ArchiveBoxIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { usePathname } from "next/navigation";
import CircularProgressBar from "./_components/CircularProgressBar";
import { ArrowPathIcon } from "@heroicons/react/20/solid";

interface Progress {
	percent: number;
}

export const GlobalContext = React.createContext<{
	setAlert: React.Dispatch<
		React.SetStateAction<{
			message: string;
			level: "information" | "warning" | "error" | "success";
		} | null>
	>;
	setConfirm: React.Dispatch<
		React.SetStateAction<{
			message: string;
			onConfirm: () => void;
			onCancel?: (() => void) | undefined;
		} | null>
	>;
	setProgress: React.Dispatch<React.SetStateAction<Progress>>;
}>({
	setAlert: () => {},
	setConfirm: () => {},
	setProgress: () => {},
});

export default function RootLayoutClient({ children }: { children: React.ReactNode }) {
	const [alert, setAlert] = React.useState<{
		message: string;
		level: "information" | "warning" | "error" | "success";
	} | null>(null);
	const [confirm, setConfirm] = React.useState<{
		message: string;
		onConfirm: () => void;
		onCancel?: () => void;
	} | null>(null);
	const [progress, setProgress] = React.useState<Progress>({ percent: 0 });

	React.useEffect(() => {
		if (progress.percent === 100) {
			setTimeout(() => {
				setProgress({ percent: 0 });
			}, 2500);
		}
	}, [progress.percent]);

	return (
		<div>
			{alert && (
				<div className='flex justify-center items-center'>
					<Alert
						open={alert.message ? true : false}
						color={
							alert.level === "information"
								? "blue"
								: alert.level === "warning"
								? "gray"
								: alert.level === "success"
								? "green"
								: "red"
						}
						className='z-50 top-10 w-2/3 lg:w-1/3 absolute backdrop-filter backdrop-blur-sm'
						onClose={() => setAlert(null)}>
						<Typography variant='h5' color='white'>
							{alert.level === "information"
								? "Információ"
								: alert.level === "warning"
								? "Figyelmeztetés"
								: alert.level === "success"
								? "Siker"
								: "Hiba"}
						</Typography>
						<Typography color='white' className='mt-2 font-normal'>
							{alert.message}
						</Typography>
					</Alert>
				</div>
			)}
			{confirm && (
				<div className='flex justify-center items-center'>
					<Alert
						open={confirm.message ? true : false}
						color='red'
						className='z-50 top-10 w-2/3 h-20 lg:w-1/3 absolute flex flex-row justify-between items-center backdrop-filter backdrop-blur-sm'>
						<Typography className='font-normal w-2/3 text-left'>{confirm.message}</Typography>
						<div className='absolute right-5 bottom-5 items-center w-full flex flex-row justify-end gap-4'>
							<Button
								color='gray'
								onClick={() => {
									confirm.onConfirm();
									setConfirm(null);
								}}>
								Igen
							</Button>
							<Button
								color='gray'
								variant='outlined'
								onClick={() => {
									confirm.onCancel && confirm.onCancel();
									setConfirm(null);
								}}>
								Mégsem
							</Button>
						</div>
					</Alert>
				</div>
			)}
			<CircularProgressBar percent={progress.percent} />
			<div className='flex w-full'>
				<Navbar />
				<GlobalContext.Provider value={{ setAlert, setConfirm, setProgress }}>
					{children}
				</GlobalContext.Provider>
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

function Navbar() {
	const routes: { name: string; href: string; icon: any; subRoutes: { name: string; href: string }[] }[] = [
		{
			name: "Főoldal",
			href: "/felmeresek",
			icon: <HomeIcon className='w-6 h-6' />,
			subRoutes: [
				{
					name: "Főoldal",
					href: "/",
				},
				{
					name: "Felmérések",
					href: "/felmeresek",
				},
				{
					name: "Kérdések",
					href: "/questions",
				},
				{
					name: "Árajánlat sablonok",
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
	const router = usePathname();

	return (
		<aside className='flex'>
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

			<div className='h-screen py-8 overflow-y-auto bg-white border-l border-r sm:w-64 w-60 dark:bg-gray-900 dark:border-gray-700 sticky top-0'>
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
			</div>
		</aside>
	);
}
