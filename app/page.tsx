import Heading from "./_components/Heading";

import ClientPage from "./_clientPage";

import { BaseFelmeresData } from "./new/_clientPage";

import { AdatlapData } from "./_utils/types";
import { statusMap } from "./_utils/utils";

import { Template } from "./templates/page";

export interface GridOptions {
	rows: string[];
	columns: string[];
}

export interface ScaleOption {
	min: number;
	max: number;
}

export interface FelmeresQuestion {
	id: number;
	adatlap_id: number;
	question: number;
	value: string;
	product: number | null;
}

export interface Pagination<T> {
	count: number;
	next: string | null;
	previous: string | null;
	results: T[];
}

export default async function Home({ searchParams }: { searchParams: { page?: string; filter?: string } }) {
	const data = await fetch(
		`https://pen.dataupload.xyz/felmeresek/?ordering=-created_at&page=${searchParams?.page ?? 1}${
			searchParams.filter ? "&search=" + searchParams.filter : ""
		}`,
		{
			next: { tags: ["felmeresek"], revalidate: 60 },
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		}
	);
	if (data.ok) {
		const felmeresek: Pagination<BaseFelmeresData> = await data.json().catch((err) => {
			console.log(err);
			return [];
		});
		const adatlapIds = Array.from(new Set(felmeresek.results.map((felmeres) => felmeres.adatlap_id.toString())));
		const adatlapok = await fetch("https://pen.dataupload.xyz/minicrm-adatlapok/?Id=" + adatlapIds.join(","), {
			next: { tags: ["adatlapok"], revalidate: 60 },
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		})
			.then((res) => res.json())
			.catch((err) => {
				console.log("Adatlaphiba" + err);
				return [];
			})
			.then((data: AdatlapData[]) => {
				return data.filter((adatlap) => adatlap);
			});

		const templates: Template[] = await fetch("https://pen.dataupload.xyz/templates/", {
			next: { tags: ["templates"], revalidate: 300 },
		})
			.then((res) => res.json())
			.catch((err) => {
				console.log(err);
				return [];
			})
			.then((data: Template[]) =>
				data.filter((template) => felmeresek.results.map((felmeres) => felmeres.template).includes(template.id))
			);
		const allData = felmeresek.results.map((felmeres) => {
			const adatlap = adatlapok
				.filter((adatlap) => adatlap)
				.find((adatlap) => adatlap!.Id === felmeres.adatlap_id);
			const template = templates.find((template) => template?.id === felmeres.template);
			let date = new Date(felmeres.created_at);
			let formattedDate =
				date.getFullYear() +
				"-" +
				("0" + (date.getMonth() + 1)).slice(-2) +
				"-" +
				("0" + date.getDate()).slice(-2) +
				" " +
				("0" + date.getHours()).slice(-2) +
				":" +
				("0" + date.getMinutes()).slice(-2) +
				":" +
				("0" + date.getSeconds()).slice(-2);

			return {
				...adatlap,
				...template,
				...felmeres,
				"Azonosító": felmeres.id,
				"Teljes cím": `${adatlap ? adatlap.Cim2 : ""} ${adatlap ? adatlap.Telepules : ""} ${
					adatlap ? adatlap.Iranyitoszam : ""
				} ${adatlap ? adatlap.Orszag : ""}`,
				"Felmérés típusa": felmeres.type,
				"Státusz": statusMap[felmeres.status ? felmeres.status : "DRAFT"],
				"Felmérés neve": felmeres.name,
				"Felmérő": adatlap ? adatlap.Felmero2 : "",
				"created_at": formattedDate,
			};
		});

		return (
			<ClientPage
				allData={allData}
				paginationData={{ active: true, numPages: Math.ceil(felmeresek.count / 10) }}
			/>
		);
	} else {
		return (
			<main className='flex min-h-screen flex-col items-center justify-start p-2'>
				<Heading variant='h2' title='Felmérések' />
				<p className='text-center text-gray-500'>Hiba akadt a felmérések lekérdezése közben</p>
			</main>
		);
	}
}
