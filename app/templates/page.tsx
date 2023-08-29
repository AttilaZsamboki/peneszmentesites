import { Product } from "../products/page";
import ClientPage from "./_clientPage";

export interface Template {
	id: number;
	name: string;
	type: string;
	description: string;
}

export default async function Page() {
	const templates = await fetch("https://pen.dataupload.xyz/templates").then((resp) => resp.json());
	console.log(templates);

	const products: Product[] = await fetch("https://pen.dataupload.xyz/products").then((resp) => resp.json());
	return <ClientPage templates={templates} products={products} />;
}
