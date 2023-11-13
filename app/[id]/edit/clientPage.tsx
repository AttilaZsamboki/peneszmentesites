import { Template } from "@/app/templates/page";
import ClientPage, { BaseFelmeresData, FelmeresItem, FelmeresMunkadíj } from "@/app/new/_clientPage";
import { Product } from "@/app/products/page";
import { ProductAttributes } from "@/app/products/_clientPage";
import { FelmeresQuestion } from "@/app/page";
import { FelmeresPictures } from "../_clientPage";
import { Munkadíj } from "@/app/munkadij/page";

export default async function Page({
	felmeres,
	felmeresItems,
	felmeresQuestions,
	products,
	pictures,
	felmeresMunkadíjak,
	munkadíjak,
}: {
	felmeres: BaseFelmeresData;
	felmeresItems: FelmeresItem[];
	felmeresQuestions: FelmeresQuestion[];
	products: Product[];
	pictures: FelmeresPictures[];
	felmeresMunkadíjak: FelmeresMunkadíj[];
	munkadíjak: Munkadíj[];
}) {
	const adatlapok = await fetch(`https://pen.dataupload.xyz/minicrm-adatlapok/${felmeres.adatlap_id}`)
		.then((response) => response.json())
		.catch((error) => {
			console.error("error", error);
			return { Results: {} };
		})
		.then((data) => [data]);

	const templates: Template[] = await fetch("https://pen.dataupload.xyz/templates", {
		next: { tags: ["templates"], revalidate: 300 },
	})
		.then((response) => response.json())
		.catch((error) => console.error("error", error));

	const productAttributes: ProductAttributes[] = await fetch("https://pen.dataupload.xyz/product_attributes", {
		next: { tags: ["product-attributes"] },
	})
		.then((response) => response.json())
		.catch((error) => console.error("error", error));

	return (
		<ClientPage
			editFelmeresMunkadíjak={felmeresMunkadíjak}
			munkadíjak={munkadíjak}
			editPictures={pictures}
			editFelmeresItems={felmeresItems}
			editFelmeres={felmeres}
			adatlapok={adatlapok}
			templates={templates}
			products={products}
			productAttributes={productAttributes}
			editData={felmeresQuestions}
			startPage={1}
			isEdit={true}
		/>
	);
}
