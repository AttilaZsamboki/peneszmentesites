import { ProductAttributes } from "../products/[id]/page";
import { Product } from "../products/page";
import ClientPage from "./_clientPage";

export interface Template {
	id: number;
	name: string;
	type: string;
	description: string;
}

export default async function Page() {
	const templates = await fetch("https://pen.dataupload.xyz/templates", { cache: "no-cache" }).then((resp) =>
		resp.json()
	);
	const products: Product[] = await fetch("https://pen.dataupload.xyz/products", { cache: "no-cache" }).then((resp) =>
		resp.json()
	);
	return <ClientPage templates={templates} products={products} />;
}
