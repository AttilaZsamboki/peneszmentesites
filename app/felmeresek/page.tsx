import Heading from "../_components/Heading";
import { fetchAdatlapDetails } from "../_utils/_fetchMiniCRM";
import ClientPage from "./_clientPage";
import { Filter } from "./_clientPage";
import { BaseFelmeresData } from "./new/_clientPage";

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

export interface AdatlapDetails {
	Id: number;
	CategoryId: number;
	ContactId: number;
	StatusId: string;
	UserId: string;
	Name: string;
	StatusUpdatedAt: string;
	IsPrivate: number;
	Invited: string;
	Deleted: number;
	CreatedBy: string;
	CreatedAt: string;
	UpdatedBy: string;
	UpdatedAt: string;
	EmailOpen_Phone: string;
	EmailOpen_Tablet: string;
	EmailOpen_iPhone: string;
	EmailOpen_iPad: string;
	EmailOpen_Android: string;
	Serial_Number: string;
	Type: string;
	Url: string;
	MilyenProblemavalFordultHozzank: string;
	Tavolsag: number;
	FelmeresiDij: number;
	FelmeresIdopontja2: string;
	MiAzUgyfelFoSzempontja3: string;
	EgyebSzempontok3: string;
	Cim2: string;
	UtazasiIdoKozponttol: string;
	Alaprajz: string;
	LezarasOka: string;
	LezarasSzovegesen: string;
	Telepules: string;
	Iranyitoszam: string;
	Forras: string;
	Megye: string;
	Orszag: string;
	Felmero2: string;
	DijbekeroPdf2: string;
	DijbekeroSzama2: string;
	DijbekeroMegjegyzes2: string;
	DijbekeroUzenetek: string;
	FizetesiMod2: string;
	KiallitasDatuma: string;
	FizetesiHatarido: string;
	MennyireVoltMegelegedve2: string;
	Pontszam3: number;
	SzovegesErtekeles4: string;
	IngatlanKepe: string;
	Munkalap: string;
	BruttoFelmeresiDij: number;
	MunkalapMegjegyzes: string;
	FelmeresVisszaigazolva: string;
	SzamlaPdf: string;
	SzamlaSorszama2: string;
	KiallitasDatuma2: string;
	SzamlaUzenetek: string;
	SzamlaMegjegyzes: string;
	FelmeresAdatok: string;
	UtvonalAKozponttol: string;
	StreetViewUrl: string;
	BusinessId: number;
	ProjectHash: string;
	ProjectEmail: string;
}

export default async function Home({ searchParams }: { searchParams: any }) {
	const data = await fetch("http://pen.dataupload.xyz/felmeresek", { next: { tags: ["felmeresek"] } });
	if (data.ok) {
		const felmeresek: BaseFelmeresData[] = await data.json();
		const adatlapok: AdatlapDetails[] = await Promise.all(
			felmeresek.map(async (felmeres) => fetchAdatlapDetails(felmeres.adatlap_id))
		);

		return <ClientPage felmeresek={felmeresek} adatlapok={adatlapok} />;
	} else {
		return (
			<main className='flex min-h-screen flex-col items-center justify-start p-2'>
				<Heading variant='h2' title='Felmérések' />
				<p className='text-center text-gray-500'>Hiba akadt a felmérések lekérdezése közben</p>
			</main>
		);
	}
}
