import { Template } from "@/app/templates/page";
import ClientPage from "./_clientPage";
import { Product } from "@/app/products/page";
import { ProductAttributes } from "@/app/products/_clientPage";
import { AdatlapData } from "../_utils/types";

export default async function Page() {
	const adatlapok: AdatlapData[] = await fetch(
		"https://pen.dataupload.xyz/minicrm-adatlapok/?CategoryId=23&StatusId=3082,3079,3083,3023,3084,2933,3086",
		{ cache: "no-store" }
	)
		.then((response) => response.json())
		.catch((error) => {
			console.error("error", error);
			return { Results: {} };
		});
	const templates: Template[] = await fetch("https://pen.dataupload.xyz/templates")
		.then((response) => response.json())
		.catch((error) => {
			console.error("error", error);
			return [];
		});
	const products: Product[] = await fetch("https://pen.dataupload.xyz/products?all=true", {
		next: { tags: ["products"] },
	})
		.then((response) => response.json())
		.catch((error) => {
			console.error("error", error);
			return [];
		});
	const productAttributes: ProductAttributes[] = await fetch("https://pen.dataupload.xyz/product_attributes")
		.then((response) => response.json())
		.catch((error) => console.error("error", error));
	const munkadíjak = await fetch("https://pen.dataupload.xyz/munkadij")
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
