import { Template } from "@/app/templates/page";
import ClientPage from "./_clientPage";
import { Product } from "@/app/products/page";
import { ProductAttributes } from "@/app/products/_clientPage";

export interface Adatlap {
	Count: number;
	Results: {
		[adatlap_id: number]: AdatlapData;
	};
}

export interface AdatlapData {
	Id: number;
	Name: string;
	Url: string;
	ContactId: number;
	StatusId: number;
	UserId: number;
	Deleted: number;
	BusinessId?: number;
}

export default async function Page() {
	const adatlapok = await fetch("https://pen.dataupload.xyz/minicrm-adatlapok/")
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
	const productAttributes: ProductAttributes[] = await fetch("https://pen.dataupload.xyz/product_attributes", {
		next: { tags: ["product-attributes"] },
	})
		.then((response) => response.json())
		.catch((error) => console.error("error", error));

	return (
		<ClientPage
			adatlapok={adatlapok}
			templates={templates}
			products={products}
			productAttributes={productAttributes}
		/>
	);
}
