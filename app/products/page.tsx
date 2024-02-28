import { FilterItem } from "../_components/StackedList";
import { Question } from "../questions/page";
import Products from "./_clientPage";

export interface Product {
	id: number;
	name: string;
	sku: string;
	type: string;
	barcodes?: string;
	alternative_sku?: string;
	minimum_stock_quantity?: string;
	optimal_stock_quantity?: string;
	category?: string;
	parent_id?: string;
	parent_sku?: string;
	bundles_sku?: string;
	description?: string;
	short_description?: string;
	images?: string;
	unit?: string;
	moq?: string;
	uom?: string;
	length?: string;
	width?: string;
	height?: string;
	weight?: string;
	net_weight?: string;
	webshop_sort_order?: string;
	commodity_code?: string;
	excisable_product?: string;
	combined_nomenclature?: string;
	quantity_multiplier?: string;
	supplementary_unit?: string;
	country_of_origin?: string;
	garancia_period?: string;
	garancia_period_unit?: string;
	virtual?: string;
	fragile?: string;
	product_class?: string;
	upsell_products?: string;
	upsell_categories?: string;
	tags?: string;
	virtual_net_cost?: string;
	virtual_net_cost_currency?: string;
	tracking_type?: string;
	manufacturer?: string;
	manufacturer_sku?: string;
	price_list_alapertelmezett_net_price_huf: number;
	price_list_alapertelmezett_price_huf?: string;
	price_list_alapertelmezett_vat?: string;
	price_list_alapertelmezett_vat_field?: string;
	price_list_alapertelmezett_quantity_discount?: string;
	price_list_alapertelmezett_formula?: string;
	price_list_alapertelmezett_price_type?: string;
	sale_price_list_alapertelmezett_net_price_huf?: string;
	sale_price_list_alapertelmezett_price_huf?: string;
	sale_price_list_alapertelmezett_vat?: string;
	sale_price_list_alapertelmezett_vat_field?: string;
	sale_price_list_alapertelmezett_from_date?: string;
	sale_price_list_alapertelmezett_to_date?: string;
	sale_price_list_alapertelmezett_quantity_discount?: string;
	sale_price_list_alapertelmezett_formula?: string;
	sale_price_list_alapertelmezett_price_type?: string;
	warehouse_raktar_1_allowed?: string;
	warehouse_raktar_1_minimum_stock_quantity?: string;
	warehouse_raktar_1_optimal_stock_quantity?: string;
	warehouse_selejt_allowed?: string;
	warehouse_selejt_minimum_stock_quantity?: string;
	warehouse_selejt_optimal_stock_quantity?: string;
}

export interface Filter {
	id: number;
	name: string;
	filters: FilterItem[];
	type: string;
	sort_by?: string;
	sort_order: "asc" | "desc";
}

export const dynamic = "force-dynamic";

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
