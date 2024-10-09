import { cookies } from "next/headers";
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
	const system_id = cookies().get("system")?.value;
	const templates: Template[] = await fetch(
		process.env.NEXT_PUBLIC_BASE_URL + ".dataupload.xyz/templates?system_id=" + system_id,
		{
			cache: "no-cache",
		}
	).then((resp) => resp.json());

	const products: Product[] = await fetch(
		process.env.NEXT_PUBLIC_BASE_URL + ".dataupload.xyz/products?all=true&system_id=" + system_id,
		{
			next: { tags: ["products"], revalidate: 60 },
		}
	).then((resp) => resp.json());
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
	const munkadíjak: Munkadíj[] = await fetch(
		process.env.NEXT_PUBLIC_BASE_URL + ".dataupload.xyz/munkadij?system_id=" + system_id
	)
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
