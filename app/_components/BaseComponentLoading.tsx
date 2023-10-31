"use client";
import Skeleton from "react-loading-skeleton";
import LoadingDots from "./LoadingDots";
import { usePathname } from "next/navigation";
import Heading from "./Heading";
import { Button } from "@/components/ui/button";

export default function BaseComponentLoading() {
	const pathname = usePathname();
	const paths = [
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
			name: "Termékek",
			href: "/products",
		},
	];
	const pageName = paths.find((path) => path.href === pathname)?.name ?? "";
	return (
		<main className='flex min-h-screen flex-col items-center justify-start w-full '>
			<div className='flex flex-col items-center justify-start w-full border-b bg-white'>
				<div className='lg:w-2/3 flex flex-row justify-between py-0'>
					<Heading border={false} width='w-full' title={pageName} marginY='mt-11 mb-8' variant='h2'>
						<div>
							<div className='flex flex-row justify-end w-full relative top-3 z-50 items-center gap-3'>
								<Button
									disabled
									className='w-36 h-10 flex animate-pulse items-center justify-center py-4 rounded-md hover:shadow-none shadow-none font-semibold uppercase'>
									Töltödik...
								</Button>
							</div>
						</div>
					</Heading>
				</div>
			</div>
			<div className='flex flex-row justify-center w-full flex-wrap'>
				{/* Stacked List */}
				<div className='lg:w-2/3 lg:px-0 flex flex-col w-full px-5'>
					<div className='flex flex-row justify-between items-center mb-3 w-full gap-5 mt-5'>
						<div className='mx-auto flex w-full'>
							<div className='relative flex items-center w-full h-12 bg-white overflow-hidden rounded-md border'>
								<div className='grid place-items-center h-full w-12 text-gray-300'>
									<svg
										xmlns='http://www.w3.org/2000/svg'
										className='h-6 w-6'
										fill='none'
										viewBox='0 0 24 24'
										stroke='currentColor'>
										<path
											strokeLinecap='round'
											strokeLinejoin='round'
											strokeWidth='2'
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
													<Skeleton className='lg:w-[150px] w-[50px]' />
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
			</div>
		</main>
	);
}
