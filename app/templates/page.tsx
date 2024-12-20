import { Munkadíj } from "../munkadij/page";
import { Product } from "../products/page";
import ClientPage from "./_clientPage";

export interface Template {
	id: number;
	name: string;
	type: string;
	description: string;
	items?: Product[];
}

export default async function Page() {
	const templates: Template[] = await fetch("https://pen.dataupload.xyz/templates", {
		cache: "no-cache",
	}).then((resp) => resp.json());

	const products: Product[] = await fetch("https://pen.dataupload.xyz/products?all=true", {
		next: { tags: ["products"], revalidate: 60 },
	}).then((resp) => resp.json());
	await Promise.all(
		templates.map(async (template) => {
			const response: { product: number; template: number }[] = await fetch(
				`https://pen.dataupload.xyz/product_templates/${template.id}/`
			)
				.then((res) => res.json())
				.catch(() => []);
			template.items = response.map((item: { product: number }) =>
				products.find((product) => product.id === item.product)
			) as Product[];
		})
	);
	const munkadíjak: Munkadíj[] = await fetch("https://pen.dataupload.xyz/munkadij")
		.then((resp) => resp.json())
		.catch(() => []);

	return (
		<ClientPage
			templates={
				templates.map((template) => ({
					...template,
					id: template.id.toString(),
					firstProduct: template.items ? template.items[0]?.sku : "",
					jsonProducts: JSON.stringify(template.items),
				})) as unknown as Template[]
			}
			munkadíjak={munkadíjak}
			products={products}
		/>
	);
}
