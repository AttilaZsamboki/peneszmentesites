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
}

export default async function ProductsFetch({
	searchParams,
}: {
	searchParams: { page: string; limit: string; filter?: string };
}) {
	const page = parseInt(searchParams.page || "1");
	const limit = parseInt(searchParams.limit || "10");
	const offset = (page - 1) * limit;
	const filter = searchParams.filter ? searchParams.filter : null;
	const questions: Question[] = await fetch("https://pen.dataupload.xyz/questions").then(async (res) => {
		const data = await res.json();
		return data.filter((question: Question) => question.connection !== "Fix");
	});

	if (!filter) {
		const response = await fetch("https://pen.dataupload.xyz/products?limit=" + limit + "&offset=" + offset);
		const data: { count: number; results: Product[] } = await response.json().then((res) => res);
		return <Products data={data} questions={questions} />;
	} else {
		const response = await fetch("https://pen.dataupload.xyz/products?filter=" + filter);
		const data: { count: number; results: Product[] } = await response
			.json()
			.then((res) => ({ count: 10, results: res }));
		return <Products data={data} questions={questions} />;
	}
}
