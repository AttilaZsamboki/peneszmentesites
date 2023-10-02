"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Skeleton from "react-loading-skeleton";
import useBreakpointValue from "../_components/useBreakpoint";
import { Separator } from "@/components/ui/separator";
import Heading from "../_components/Heading";
import {
	Accordion,
	AccordionBody,
	AccordionHeader,
	Checkbox,
	Switch,
	Tab,
	Tabs,
	TabsHeader,
	Typography,
} from "@material-tailwind/react";
import Input from "../_components/Input";
import React from "react";
import { FileEdit } from "lucide-react";

export default function Loading() {
	const deviceSize = useBreakpointValue();

	function Icon({ open }: { open: boolean }) {
		return (
			<svg
				xmlns='http://www.w3.org/2000/svg'
				fill='none'
				viewBox='0 0 24 24'
				strokeWidth={2}
				stroke='currentColor'
				className={`${open ? "rotate-180" : ""} h-5 w-5 transition-transform`}>
				<path strokeLinecap='round' strokeLinejoin='round' d='M19.5 8.25l-7.5 7.5-7.5-7.5' />
			</svg>
		);
	}
	return (
		<div className='w-full overflow-y-scroll overflow-x-hidden lg:h-[93dvh] h-[80dvh]'>
			<div className='flex flex-row w-ful flex-wrap lg:flex-nowrap justify-center mt-2'>
				<div className='w-full'>
					<div className='mt-6 lg:px-10 px-3 w-full'>
						<Card>
							<CardHeader>
								<div className='flex gap-5 flex-row items-center justify-between w-full flex-wrap'>
									<div className='flex flex-row items-center gap-5'>
										<CardTitle>
											<Skeleton width={150} height={24} />
										</CardTitle>
										<Skeleton width={128} height={40} />
									</div>
									{deviceSize !== "" ? deviceSize === "sm" ? <Separator /> : null : null}
									<div className='flex w-full lg:w-1/4 lg:justify-normal justify-center h-5 items-center space-x-4 lg:text-md lg:font-medium text-sm'>
										<Skeleton width={80} height={40} />
										{Array.from({ length: 2 }).map((_, i) => (
											<>
												<Separator orientation='vertical' />
												<Skeleton width={80} height={40} />
											</>
										))}
									</div>

									<div>
										<div className='cursor-not-allowed text-gray-800'>
											<FileEdit />
										</div>
									</div>
								</div>
							</CardHeader>
							<CardContent>
								<div className='border-t'></div>
							</CardContent>
						</Card>
					</div>
				</div>
				{deviceSize !== "sm" ? (
					<div className='w-full lg:w-3/12 lg:mr-10 flex justify-center lg:justify-normal lg:items-start items-center lg:px-0 px-3 mt-6'>
						<div className='w-full sticky top-8 '>
							<div className='relative'>
								<Tabs className='sticky top-5 w-full flex flex-col ' orientation='vertical'>
									<TabsHeader className='rounded-none lg:rounded-sm px-5 border'>
										<Accordion open={true} icon={<Icon open={true} />}>
											<AccordionHeader>
												<div className='mx-3 my-1 mb-3 w-full'>
													<Input />
												</div>
											</AccordionHeader>
											<AccordionBody>
												{Array.from({ length: 5 }).map((_, i) => (
													<Tab key={i} disabled={true} value=''>
														<Skeleton width={332} height={34} />
													</Tab>
												))}
											</AccordionBody>
										</Accordion>
									</TabsHeader>
								</Tabs>
							</div>
							<div className='flex flex-row w-full justify-between my-5 p-2 px-4 border rounded-md bg-white'>
								<Typography className='text-gray-600' variant='h6'>
									Módosítás
								</Typography>
								<Switch crossOrigin='' disabled={true} color='gray' />
							</div>
							<div className='flex flex-row w-full justify-between bg-white my-5 p-2 px-4 border rounded-md items-center'>
								<Typography className='text-gray-600' variant='h6'>
									Minden
								</Typography>
								<Checkbox crossOrigin='' disabled={true} />
							</div>
						</div>
					</div>
				) : (
					<div className='bg-white sm:border-t-0 border-t bottom-0 fixed z-40 w-full pt-2'>
						<Tabs
							value=''
							className='flex flex-row w-full border-b pl-3 lg:pl-6 items-center overflow-x-scroll'>
							{Array(3).map((_, i) => (
								<TabsHeader
									key={i}
									className='rounded-none bg-transparent p-0'
									indicatorProps={{
										className:
											"bg-transparent border-b-2 border-gray-900 mx-3 shadow-none rounded-none",
									}}>
									<Tab value='' className='pb-2'>
										<div className='hover:bg-gray-100 px-3 py-1 rounded-md truncate max-w-[12rem]'>
											<Skeleton width={100} />
										</div>
									</Tab>
								</TabsHeader>
							))}
						</Tabs>
					</div>
				)}
			</div>
		</div>
	);
}
