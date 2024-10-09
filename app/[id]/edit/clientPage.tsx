import { Template } from "@/app/templates/page";
import ClientPage, { BaseFelmeresData, FelmeresItem, FelmeresMunkadíj } from "@/app/new/_clientPage";
import { Product } from "@/app/products/page";
import { ProductAttributes } from "@/app/products/_clientPage";
import { FelmeresQuestion } from "@/app/page";
import { FelmeresPictures } from "../_clientPage";
import { Munkadíj } from "@/app/munkadij/page";
import { useMemo } from "react";
import { useUserWithRole } from "@/lib/utils";

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
	const adatlapok = await fetch(
		`${process.env.NEXT_PUBLIC_BASE_URL}.dataupload.xyz/minicrm-adatlapok/${felmeres.adatlap_id}`
	)
		.then((response) => response.json())
		.catch((error) => {
			console.error("error", error);
			return { Results: {} };
		})
		.then((data) => [data]);

	const { user } = useUserWithRole();

	const system_id = useMemo(() => user?.system, [user]);
	const templates: Template[] = await fetch(
		`${process.env.NEXT_PUBLIC_BASE_URL}.dataupload.xyz/templates?system_id=${system_id}`,
		{
			next: { tags: ["templates"], revalidate: 300 },
		}
	)
		.then((response) => response.json())
		.catch((error) => console.error("error", error));

	const productAttributes: ProductAttributes[] = await fetch(
		`${process.env.NEXT_PUBLIC_BASE_URL}.dataupload.xyz/product_attributes?system_id=${system_id}`,
		{
			next: { tags: ["product-attributes"] },
		}
	)
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
