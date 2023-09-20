"use client";
import { List, ListItem, Typography } from "@material-tailwind/react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Skeleton from "react-loading-skeleton";
import LoadingDots from "./LoadingDots";
import { usePathname } from "next/navigation";

export default function BaseComponentLoading() {
	const pathname = usePathname();
	const paths = [
		{
			name: "",
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
			name: "Sablonok",
			href: "/templates",
		},
		{
			name: "Termékek",
			href: "/products",
		},
	];
	return (
		<main className='flex min-h-screen flex-col items-center justify-start w-full'>
			<div className='flex flex-col items-center justify-start w-full border-b'>
				<div className='w-2/3 flex flex-row justify-between py-0'>
					<div className={`flex lg:flex-row flex-col justify-between items-center w-full mb-2`}>
						<div className='flex flex-col justify-items items-center w-full'>
							<div
								className={`flex flex-col w-full px-2 lg:items-start sm:items-center justify-center mt-11 mb-8 lg:justify-between text-center`}>
								<Typography
									variant='h2'
									className={`font-semibold text-gradient-to-tr from-gray-900 to-gray-800 lg:my-0 text-left`}>
									{paths.find((path) => path.href === pathname)?.name}
								</Typography>
							</div>
						</div>
						<div className='flex flex-row justify-end w-full relative top-3 z-50 items-center gap-3'>
							<Button className='w-36 h-10 flex items-center justify-center py-4 rounded-md hover:shadow-none shadow-none'>
								<LoadingDots />
							</Button>
						</div>
					</div>
				</div>
			</div>
			<div className='flex flex-row justify-center w-full'>
				<div className='w-2/3 flex flex-col'>
					<div className='flex flex-row justify-between items-center mb-3 w-full gap-5 mt-5'>
						<div className='mx-auto flex w-full rounded-md !border !border-gray-200'>
							<div className='relative flex items-center w-full h-12 bg-white overflow-hidden'>
								<div className='grid place-items-center h-full w-12 text-gray-300'>
									<svg
										xmlns='http://www.w3.org/2000/svg'
										className='h-6 w-6'
										fill='none'
										viewBox='0 0 24 24'
										stroke='currentColor'>
										<path
											stroke-linecap='round'
											stroke-linejoin='round'
											stroke-width='2'
											d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
										/>
									</svg>
								</div>

								<input
									className='peer h-full w-full outline-none text-sm text-gray-700 pr-2'
									type='text'
									id='search'
									placeholder='Töltödik...'
								/>
							</div>
						</div>
					</div>

					<ul role='list' className='w-full bg-white rounded-lg flex flex-col justify-between border'>
						{Array.from({ length: 10 }, (_, i) => i).map((item, index) => (
							<div
								key={index}
								className={`rounded-none shadow-none border-b ${index === 0 ? "rounded-t-md" : ""} ${
									index === 9 ? "rounded-b-md" : ""
								}`}>
								<div className='flex px-6 justify-between py-5 bg-white bg-opacity-20 transform'>
									<div className='flex flex-row min-w-0 gap-4'>
										<Skeleton circle={true} height={50} width={50} />
										<div className='min-w-0 flex-auto'>
											<div className='flex flex-row items-center gap-2'>
												<p className='text-sm font-semibold leading-6 text-gray-900'>
													<Skeleton width={150} />
												</p>

												<Skeleton width={100} height={20} />
											</div>
											<p className='mt-1 truncate text-xs leading-5 text-gray-500'>
												<Skeleton width={200} />
											</p>
										</div>
									</div>
									<div className='hidden shrink-0 sm:flex sm:flex-col sm:items-end'>
										<p className='text-sm leading-6 text-gray-900'>
											<Skeleton width={120} height={20} />
										</p>
										<Skeleton width={70} />
									</div>
								</div>
							</div>
						))}
					</ul>
				</div>
				<div className='flex flex-row justify-center relative top-5'>
					<div className='flex flex-col items-center w-full mx-4'>
						<Card className='w-full rounded-md shadow-none border'>
							<List>
								<CardHeader className='active:bg-white hover:bg-white after:bg-white before:bg-white bg-white'>
									<CardTitle>Filterek</CardTitle>
								</CardHeader>

								{Array.from({ length: 5 }, (_, i) => i).map((i) => (
									<ListItem key={i}>
										<Skeleton width={200} height={25} />
									</ListItem>
								))}
							</List>
						</Card>
					</div>
				</div>
			</div>
		</main>
	);
}
