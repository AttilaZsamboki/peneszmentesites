import { Product } from "../products/page";
import ClientPage from "./_clientPage";

export interface Template {
	id: number;
	name: string;
	type: string;
	description: string;
}

export default async function Page() {
	const templates: Template[] = await fetch("https://pen.dataupload.xyz/templates", {
		next: { tags: ["templates"] },
	}).then((resp) => resp.json());
	const products: Product[] = await fetch("https://pen.dataupload.xyz/products", {
		next: { tags: ["products"] },
	}).then((resp) => resp.json());
	return (
		<ClientPage
			templates={templates.map((template) => ({
				...template,
				truncatedDescription:
					template.description.substring(0, 40) + (template.description.length > 40 ? "..." : ""),
			}))}
			products={products}
		/>
	);
}
