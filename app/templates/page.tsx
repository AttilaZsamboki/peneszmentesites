import { Product } from "../products/page";
import ClientPage from "./_clientPage";

export interface Template {
	id: number;
	name: string;
	type: string;
	description: string;
}

export default async function Page() {
	const templates: Template[] = await fetch("http://pen.dataupload.xyz/templates", { cache: "no-store" }).then(
		(resp) => resp.json()
	);
	const products: Product[] = await fetch("http://pen.dataupload.xyz/products", { cache: "no-store" }).then((resp) =>
		resp.json()
	);
	return <ClientPage templates={templates} products={products} />;
}
