import Products from "./_clientPage";

export interface Product {
	id: number;
	name: string;
	sku: string;
	type: string;
}

export interface Filters {
	id: number;
	name: string;
	value: any;
}

export default async function ProductsFetch() {
	const response = await fetch("http://pen.dataupload.xyz/products");
	const data: Product[] = await response.json();
	const filterResponse = await fetch("http://pen.dataupload.xyz/filters?type=product", { cache: "no-store" });
	const filterData: Filters[] = await filterResponse.json();
	return (
		<Products
			data={data}
			savedFilters={filterData}
			title='Termékek'
			columnDefs={[
				{ field: "name", headerName: "Név" },
				{ field: "sku", headerName: "SKU" },
				{ field: "category", headerName: "Kategória" },
			]}
		/>
	);
}
