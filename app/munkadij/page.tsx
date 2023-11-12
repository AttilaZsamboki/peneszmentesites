import { Product } from "../products/page";
import ClientPage from "./clientPage";

export interface Munkadíj {
	id: number;
	type: string;
	value: number;
	description: string;
}

export default async function Page() {
	const munkadíjak = await fetch("https://pen.dataupload.xyz/munkadij", {
		next: { tags: ["munkadijak"], revalidate: 600 },
	})
		.then((resp) => resp.json())
		.catch(() => []);

	const products: Product[] = await fetch("https://pen.dataupload.xyz/products?all=true", {
		next: { tags: ["products"] },
	}).then((resp) => resp.json());

	return <ClientPage munkadijak={munkadíjak} products={products} />;
}
