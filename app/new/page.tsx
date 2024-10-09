import { Template } from "@/app/templates/page";
import ClientPage from "./_clientPage";
import { Product } from "@/app/products/page";
import { ProductAttributes } from "@/app/products/_clientPage";
import { AdatlapData } from "../_utils/types";
import { cookies } from "next/headers";

export default async function Page() {
	const system_id = cookies().get("system")?.value;
	const adatlapok: AdatlapData[] = await fetch(
		process.env.NEXT_PUBLIC_BASE_URL +
			".dataupload.xyz/minicrm-adatlapok/?CategoryId=23&StatusId=3082,3079,3083,3023,3084,2933,3086&system_id=" +
			system_id,
		{ cache: "no-store" }
	)
		.then((response) => response.json())
		.catch((error) => {
			console.error("error", error);
			return { Results: {} };
		});
	const templates: Template[] = await fetch(
		process.env.NEXT_PUBLIC_BASE_URL + ".dataupload.xyz/templates?system_id=" + system_id
	)
		.then((response) => response.json())
		.catch((error) => {
			console.error("error", error);
			return [];
		});
	const products: Product[] = await fetch(
		process.env.NEXT_PUBLIC_BASE_URL + ".dataupload.xyz/products?all=true&system_id=" + system_id,
		{
			next: { tags: ["products"] },
		}
	)
		.then((response) => response.json())
		.catch((error) => {
			console.error("error", error);
			return [];
		});
	const productAttributes: ProductAttributes[] = await fetch(
		process.env.NEXT_PUBLIC_BASE_URL + ".dataupload.xyz/product_attributes?system_id=" + system_id
	)
		.then((response) => response.json())
		.catch((error) => console.error("error", error));
	const munkadíjak = await fetch(process.env.NEXT_PUBLIC_BASE_URL + ".dataupload.xyz/munkadij?system_id=" + system_id)
		.then((response) => response.json())
		.catch((error) => console.error("error", error));

	return (
		<ClientPage
			adatlapok={adatlapok}
			templates={templates}
			products={products}
			productAttributes={productAttributes}
			munkadíjak={munkadíjak}
		/>
	);
}
