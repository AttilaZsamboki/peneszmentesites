import Heading from "./_components/Heading";
import ClientPage from "./_clientPage";
import { Filter } from "./_clientPage";

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
	section: string;
}

export default async function Home({ searchParams }: { searchParams: any }) {
	const data = await fetch("http://pen.dataupload.xyz/felmeresek", { next: { tags: ["felmeresek"] } });
	function queryParamsToFilters(searchParams: any) {
		const filters: Filter[] = [];
		let index = 0;
		while (true) {
			const id = searchParams[`filters[${index}][id]`];
			const search = searchParams[`filters[${index}][search]`];
			const searchField = searchParams[`filters[${index}][searchField]`];
			if (id === undefined || search === undefined || searchField === undefined) {
				break;
			}
			filters.push({
				id: Number(id),
				search,
				searchField,
			});
			index++;
		}
		return filters;
	}
	const filters = queryParamsToFilters(searchParams);
	if (data.ok) {
		const felmeresek: Felmeres[] = await data.json();
		const formattedFelmeresek = Array.from(new Set(felmeresek.map((felmeresek) => felmeresek.adatlap_id)))
			.map((adatlap_id) => {
				let i: any = {};
				felmeresek
					.filter((felmeresek) => felmeresek.adatlap_id === adatlap_id)
					.map((felmeresek) => {
						i[felmeresek.field] = felmeresek.value;
					});
				return i;
			})
			.filter((item) =>
				filters
					? filters
							.map((filter) =>
								filter.searchField === ""
									? true
									: item[filter.searchField]
									? item[filter.searchField].toLowerCase().includes(filter.search?.toLowerCase())
									: false
							)
							.every((filter) => filter !== false)
					: true
			);

		return <ClientPage felmeresek={formattedFelmeresek} />;
	} else {
		return (
			<main className='flex min-h-screen flex-col items-center justify-start p-2'>
				<Heading variant='h2' title='Felmérések' />
				<p className='text-center text-gray-500'>Hiba akadt a felmérések lekérdezése közben</p>
			</main>
		);
	}
}
