import { Template } from "@/app/templates/page";
import ClientPage, { BaseFelmeresData, FelmeresItem } from "@/app/new/_clientPage";
import { Product } from "@/app/products/page";
import { ProductAttributes } from "@/app/products/_clientPage";
import { Adatlap } from "@/app/new/page";
import { FelmeresQuestion } from "@/app/page";

export default async function Page({
	felmeres,
	felmeresItems,
	felmeresQuestions,
}: {
	felmeres: BaseFelmeresData;
	felmeresItems: FelmeresItem[];
	felmeresQuestions: FelmeresQuestion[];
}) {
	var myHeaders = new Headers();
	myHeaders.append("Authorization", "Basic MTE5OkQwNlBVTE9JM2VUUkJLY2xqQUdRWWJkNEZFcHVWeTFn");
	myHeaders.append("Content-Type", "application/json");

	var requestOptions: RequestInit = {
		cache: "no-store",
		method: "GET",
		headers: myHeaders,
	};

	const adatlapok = await fetch("https://r3.minicrm.hu/Api/R3/Project?CategoryId=23", requestOptions)
		.then((response) => response.json())
		.catch((error) => {
			console.error("error", error);
			return { Results: {} };
		})
		.then((result: Adatlap) => Object.values(result.Results).filter((adatlap) => adatlap.Deleted === 0));
	const templates: Template[] = await fetch("https://pen.dataupload.xyz/templates")
		.then((response) => response.json())
		.catch((error) => console.error("error", error));
	const products: Product[] = await fetch("https://pen.dataupload.xyz/products?all=true", {
		next: { tags: ["products"] },
	}).then((response) => response.json());
	const productAttributes: ProductAttributes[] = await fetch("https://pen.dataupload.xyz/product_attributes", {
		next: { tags: ["product-attributes"] },
	})
		.then((response) => response.json())
		.catch((error) => console.error("error", error));

	return (
		<ClientPage
			editFelmeresItems={felmeresItems}
			editFelmeres={felmeres}
			adatlapok={adatlapok}
			templates={templates}
			products={products}
			productAttributes={productAttributes}
			editData={felmeresQuestions}
			startPage={1}
		/>
	);
}
