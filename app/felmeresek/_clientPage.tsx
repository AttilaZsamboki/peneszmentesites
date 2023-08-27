"use client";
import StackedList from "../_components/StackedList";
import Heading from "../_components/Heading";
import AutoComplete from "../_components/AutoComplete";
import { PlusCircleIcon, MinusCircleIcon } from "@heroicons/react/20/solid";
import React from "react";
import autoAnimate from "@formkit/auto-animate";
import { useSearchParams, usePathname, useRouter, ReadonlyURLSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@material-tailwind/react";
import { AdatlapDetails, Felmeres } from "./page";
import { BaseFelmeresData } from "./new/_clientPage";

export interface Filter {
	id: number;
	search: string;
	searchField: string;
}

export default function ClientPage({
	felmeresek,
	adatlapok,
}: {
	felmeresek: BaseFelmeresData[];
	adatlapok: AdatlapDetails[];
}) {
	return (
		<main className='flex min-h-screen flex-col items-center justify-start w-full'>
			<Heading width='w-2/3' title='Felmérések' variant='h2'>
				<Link href={"/felmeresek/new"}>
					<div className='flex flex-row justify-start w-full relative z-50 items-center pr-10 gap-3'>
						<Button className='w-40'>Új felmérés</Button>
					</div>
				</Link>
			</Heading>
			<StackedList adatlapok={adatlapok} felmeresek={felmeresek} />
		</main>
	);
}
