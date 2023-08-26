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
	return (
		<Products
			data={data}
			title='Termékek'
			columnDefs={[
				{ field: "name", headerName: "Név" },
				{ field: "sku", headerName: "SKU" },
				{ field: "category", headerName: "Kategória" },
			]}
		/>
	);
}
