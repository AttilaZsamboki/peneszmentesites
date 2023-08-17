import StackedList from "./_components/StackedList";
import Heading from "./_components/Heading";

export interface GridOptions {
	rows: string[];
	columns: string[];
}

export interface ListOption {
	label: string;
	value: string;
}

export interface ScaleOption {
	min: number;
	max: number;
}

export interface Felmeres {
	id: number;
	adatlap_id: number;
	field: string;
	value: string;
	options: {} | GridOptions | ListOption[] | ScaleOption;
	type: "CHECKBOX" | "LIST" | "MULTIPLE_CHOICE" | "SCALE" | "TEXT" | "CHECKBOX_GRID" | "GRID" | "FILE_UPLOAD";
}

export default async function Home() {
	const data = await fetch("http://pen.dataupload.xyz/felmeresek");
	const felmeresek: Felmeres[] = await data.json();
	const formattedFelmeresek = Array.from(new Set(felmeresek.map((felmeresek) => felmeresek.adatlap_id))).map(
		(adatlap_id) => {
			let i: any = {};
			felmeresek
				.filter((felmeresek) => felmeresek.adatlap_id === adatlap_id)
				.map((felmeresek) => {
					i[felmeresek.field] = felmeresek.value;
				});
			return i;
		}
	);

	// console.log(formattedFelmeresek);

	return (
		<main className='flex min-h-screen flex-col items-center justify-start p-2'>
			<Heading title='Felmérések' />
			<StackedList items={formattedFelmeresek} />
		</main>
	);
}
