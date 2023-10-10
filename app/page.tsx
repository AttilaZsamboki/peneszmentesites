import Heading from "./_components/Heading";

import ClientPage from "./_clientPage";

import { BaseFelmeresData } from "./new/_clientPage";

import { fetchAdatlapDetails, AdatlapDetails } from "./_utils/MiniCRM";
import { statusMap } from "./_utils/utils";

import { Template } from "./templates/page";
import { FilterItem } from "./_components/StackedList";
import { Filter } from "./products/page";

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
	const data = await fetch("https://pen.dataupload.xyz/felmeresek/", {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
		},
		cache: "no-cache",
	});
	if (data.ok) {
		const felmeresek: BaseFelmeresData[] = await data.json().catch((err) => console.log(err));
		const adatlapIds = Array.from(new Set(felmeresek.map((felmeres) => felmeres.adatlap_id.toString())));
		const adatlapok: (AdatlapDetails | null)[] = await Promise.all(
			adatlapIds.map(async (id) => fetchAdatlapDetails(id))
		).then((adatlapok) => adatlapok.filter((adatlap) => adatlap !== undefined));
		const templates: Template[] = await fetch("https://pen.dataupload.xyz/templates/")
			.then((res) => res.json())
			.catch((err) => console.log(err))
			.then((data: Template[]) =>
				data.filter((template) => felmeresek.map((felmeres) => felmeres.template).includes(template.id))
			);
		const allData = felmeresek.map((felmeres) => {
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
				"Felmérés neve":
					(adatlap ? adatlap.Name : "") +
					(adatlap && template ? " - " : "") +
					(template ? template.name : ""),
				"Felmérő": adatlap ? adatlap.Felmero2 : "",
				"Ingatla képe": adatlap ? adatlap.IngatlanKepe : "",
				"created_at": formattedDate,
			};
		});
		const filters: Filter[] = await fetch("https://pen.dataupload.xyz/filters?type=Felmérések").then(
			async (resp) => await resp.json()
		);

		const savedFilters = await Promise.all(
			filters.map(async (item) => {
				const response = await fetch("https://pen.dataupload.xyz/filter_items?filter=" + item.id);
				if (response.ok) {
					const data: FilterItem[] = await response.json();
					return {
						...item,
						filters: data.map((item) =>
							item.type === "daterange"
								? {
										...item,
										value: item.value
											? {
													from: new Date(
														JSON.parse(
															item.value
																? (item.value as unknown as string).replace(/'/g, '"')
																: "{}"
														).from
													),
													to:
														item.value &&
														JSON.parse((item.value as unknown as string).replace(/'/g, '"'))
															.to
															? new Date(
																	JSON.parse(
																		item.value
																			? (item.value as unknown as string).replace(
																					/'/g,
																					'"'
																			  )
																			: "{}"
																	).to
															  )
															: (null as unknown as Date),
											  }
											: undefined,
								  }
								: item
						),
					};
				}
			})
		);
		return (
			<ClientPage
				allData={allData}
				savedFilters={
					savedFilters.map((filter) =>
						filter ? (filter as Filter) : { id: 0, filters: [], name: "", type: "" }
					) as Filter[]
				}
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
