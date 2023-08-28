"use client";
import StackedList from "../_components/StackedList";
import Heading from "../_components/Heading";
import React from "react";
import Link from "next/link";
import { Button } from "@material-tailwind/react";
import { AdatlapDetails } from "./page";
import { BaseFelmeresData } from "./new/_clientPage";
import { Template } from "../templates/page";

export interface Filter {
	id: number;
	search: string;
	searchField: string;
}

export default function ClientPage({
	felmeresek,
	adatlapok,
	templates,
}: {
	felmeresek: BaseFelmeresData[];
	adatlapok: AdatlapDetails[];
	templates: Template[];
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
			<StackedList adatlapok={adatlapok} felmeresek={felmeresek} templates={templates} />
		</main>
	);
}
