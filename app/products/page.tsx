import { FilterItem } from "../_components/StackedList";
import { Question } from "../questions/page";
import Products from "./_clientPage";

export interface Product {
	id: number;
	name: string;
	sku: string;
	type: string;
	price_list_alapertelmezett_net_price_huf: number;
}

export interface Filter {
	id: number;
	name: string;
	filters: FilterItem[];
	type: string;
	sort_by: string;
	sort_order: "asc" | "desc";
}

export default async function ProductsFetch({ searchParams }: { searchParams: { page: string; filter?: string } }) {
	const questions: Question[] = await fetch("https://pen.dataupload.xyz/questions").then(async (res) => {
		const data = await res.json();
		return data.filter((question: Question) => question.connection !== "Fix");
	});

	const data: { count: number; results: Product[] } = await fetch(
		`https://pen.dataupload.xyz/products${Object.entries(searchParams)
			.filter(([key, value]) => key !== "selectedFilter" && key !== "sort_by" && key !== "sort_order")
			.map(([key, value]: string[], index) => `${index === 0 ? "?" : ""}${key}=${value}`)
			.join("&")}`,
		{
			cache: "no-store",
		}
	)
		.then((res) => res.json())
		.catch((err) => {
			console.error(err);
			return { count: 0, results: [] };
		});
	return <Products data={data} questions={questions} />;
}
