import Heading from "./_components/Heading";

import ClientPage from "./_clientPage";

import { BaseFelmeresData } from "./new/_clientPage";

import { fetchAdatlapDetails, AdatlapDetails } from "./_utils/MiniCRM";
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
	section: string;
}

export default async function Home() {
	const data = await fetch("https://pen.dataupload.xyz/felmeresek", { next: { tags: ["felmeresek"] } });
	if (data.ok) {
		const felmeresek: BaseFelmeresData[] = await data.json();
		const adatlapok: AdatlapDetails[] = await Promise.all(
			felmeresek.map(async (felmeres) => fetchAdatlapDetails(felmeres.adatlap_id.toString()))
		).then((adatlapok) => adatlapok.filter((adatlap) => adatlap !== undefined));
		const templates: Template[] = await Promise.all(
			felmeresek.map(async (felmeres) =>
				fetch("https://pen.dataupload.xyz/templates/" + felmeres.template, {
					next: { tags: [encodeURIComponent(felmeres.adatlap_id)] },
				})
					.then((res) => res.json())
					.catch((err) => console.error(err))
			)
		);
		const allData = felmeresek.map((felmeres) => {
			const adatlap = adatlapok.find((adatlap) => adatlap.Id === felmeres.adatlap_id);
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
				"Felmérés neve": (adatlap ? adatlap.Name + " - " : "") + (template ? template.name : ""),
				"Felmérő": adatlap ? adatlap.Felmero2 : "",
				"Ingatla képe": adatlap ? adatlap.IngatlanKepe : "",
				"created_at": formattedDate,
			};
		});

		return <ClientPage allData={allData} />;
	} else {
		return (
			<main className='flex min-h-screen flex-col items-center justify-start p-2'>
				<Heading variant='h2' title='Felmérések' />
				<p className='text-center text-gray-500'>Hiba akadt a felmérések lekérdezése közben</p>
			</main>
		);
	}
}
