import Heading from "../_components/Heading";
import { fetchAdatlapDetails } from "../_utils/MiniCRM";
import ClientPage from "./_clientPage";
import { BaseFelmeresData } from "./new/_clientPage";
import { AdatlapDetails } from "../_utils/MiniCRM";

export interface GridOptions {
	rows: string[];
	columns: string[];
}

export interface ScaleOption {
	min: number;
	max: number;
}

export interface FelmeresQuestions {
	id: number;
	adatlap_id: number;
	question: number;
	value: string;
	section: string;
}

export default async function Home() {
	const data = await fetch("https://pen.dataupload.xyz/felmeresek", { cache: "no-cache" });
	if (data.ok) {
		const felmeresek: BaseFelmeresData[] = await data.json();
		const adatlapok: AdatlapDetails[] = await Promise.all(
			felmeresek.map(async (felmeres) => fetchAdatlapDetails(felmeres.adatlap_id.toString()))
		);
		const templates = await Promise.all(
			felmeresek.map(async (felmeres) =>
				fetch("https://pen.dataupload.xyz/templates/" + felmeres.template, {
					next: { tags: [encodeURIComponent(felmeres.adatlap_id)] },
				})
					.then((res) => res.json())
					.catch((err) => console.log(err))
			)
		);

		return <ClientPage felmeresek={felmeresek} adatlapok={adatlapok} templates={templates} />;
	} else {
		return (
			<main className='flex min-h-screen flex-col items-center justify-start p-2'>
				<Heading variant='h2' title='Felmérések' />
				<p className='text-center text-gray-500'>Hiba akadt a felmérések lekérdezése közben</p>
			</main>
		);
	}
}
