"use client";
import Link from "next/link";
import React from "react";
import autoAnimate from "@formkit/auto-animate";
import { Card, CardBody } from "@material-tailwind/react";
import { AdatlapDetails } from "../felmeresek/page";
import { BaseFelmeresData } from "../felmeresek/new/_clientPage";
import { Template } from "../templates/page";

export default function StackedList({
	adatlapok,
	felmeresek,
	detailsHref = "felmeresek",
	templates,
}: {
	adatlapok: AdatlapDetails[];
	felmeresek: BaseFelmeresData[];
	detailsHref?: string;
	templates: Template[];
}) {
	const parent = React.useRef<HTMLUListElement | null>(null);
	React.useEffect(() => {
		if (parent.current) {
			autoAnimate(parent.current);
		}
	}, [parent.current]);
	const [search, setSearch] = React.useState("");
	return (
		<div className='w-2/3 flex flex-col'>
			<div className='flex flex-row justify-between items-center mb-5'>
				<div className='mx-auto flex w-full'>
					<div className='relative flex items-center w-full h-12 rounded-lg focus-within:shadow-lg bg-white overflow-hidden'>
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
							placeholder='Keress valamit..'
							onChange={(e) => setSearch(e.target.value)}
						/>
					</div>
				</div>
			</div>
			<ul ref={parent} role='list' className='w-full bg-white rounded-lg flex flex-col justify-between border'>
				{adatlapok.map((adatlap, index) => {
					const felmeres = felmeresek.find((felmeres) => felmeres.adatlap_id === adatlap.Id)!;
					if (JSON.stringify(felmeres).includes(search) || JSON.stringify(adatlap).includes(search)) {
						return (
							<Link href={`/${detailsHref}/` + adatlap.Id} key={adatlap.Id}>
								<Card
									className={`rounded-none shadow-none border-b ${
										index === 0 ? "rounded-t-md" : ""
									} ${index === adatlapok.length - 1 ? "rounded-b-md" : ""}`}>
									<CardBody className='flex justify-between py-5 bg-white bg-opacity-20 transform'>
										<div className='flex flex-row min-w-0 gap-4'>
											<div className='min-w-0 flex-auto'>
												<p className='text-sm font-semibold leading-6 text-gray-900'>
													{adatlap.Name}
												</p>

												<p className='mt-1 truncate text-xs leading-5 text-gray-500'>
													{adatlap.Cim2} {adatlap.Telepules} {adatlap.Iranyitoszam}{" "}
													{adatlap.Orszag}
												</p>
											</div>
										</div>
										<div className='hidden shrink-0 sm:flex sm:flex-col sm:items-end'>
											<p className='text-sm leading-6 text-gray-900'>
												{felmeres.type} -{" "}
												{templates.find((template) => template.id === felmeres.template)?.name}
											</p>
											<p className='mt-1 text-xs leading-5 text-gray-500'>{adatlap.Felmero2}</p>
										</div>
									</CardBody>
								</Card>
							</Link>
						);
					}
				})}
			</ul>
		</div>
	);
}
