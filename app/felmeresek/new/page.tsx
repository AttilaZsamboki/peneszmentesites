import { Template } from "@/app/templates/page";
import ClientPage from "./_clientPage";
import { Question } from "@/app/questions/page";
import { Product } from "@/app/products/page";
import { ProductAttributes } from "@/app/products/[id]/page";
import { fetchAllContactDetails, fetchContactDetails } from "@/app/_utils/MiniCRM";

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
	var myHeaders = new Headers();
	myHeaders.append("Authorization", "Basic MTE5OkQwNlBVTE9JM2VUUkJLY2xqQUdRWWJkNEZFcHVWeTFn");
	myHeaders.append("Content-Type", "application/json");

	var requestOptions: RequestInit = {
		cache: "no-store",
		method: "GET",
		headers: myHeaders,
	};

	const adatlapok: AdatlapData[] = await fetch("https://r3.minicrm.hu/Api/R3/Project?CategoryId=23", requestOptions)
		.then((response) => response.json())
		.then((result: Adatlap) =>
			Object.values(result.Results).filter((adatlap) => adatlap.Deleted === 0 && adatlap.StatusId === 3023)
		);
	const templates: Template[] = await fetch("https://pen.dataupload.xyz/templates").then((response) =>
		response.json()
	);
	const products: Product[] = await fetch("https://pen.dataupload.xyz/products", {
		next: { tags: ["products"] },
	}).then((response) => response.json());
	const productAttributes: ProductAttributes[] = await fetch("https://pen.dataupload.xyz/product_attributes", {
		next: { tags: ["product-attributes"] },
	}).then((response) => response.json());

	return (
		<ClientPage
			adatlapok={adatlapok}
			templates={templates}
			products={products}
			productAttributes={productAttributes}
		/>
	);
}
