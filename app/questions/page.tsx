import { Product } from "../products/page";
import Questions from "./_clientComponent";

import { typeMap } from "../_utils/utils";
import { getFirstProduct } from "../_utils/utils";
import { cookies } from "next/headers";

export interface Question {
	id: number;
	question: string;
	type: string;
	options: any;
	connection: "Termék" | "Fix" | "";
	products?: number[];
	mandatory: boolean;
	description: string;
	product?: number;
	created_from?: string;
	is_created?: boolean;
}

export interface QuestionProduct {
	question: number;
	product: number;
}

export const dynamic = "force-dynamic";

export default async function QuestionsFetch() {
	const system_id = cookies().get("system")?.value;
	const response = await fetch(
		process.env.NEXT_PUBLIC_BASE_URL + ".dataupload.xyz/questions?system_id=" + system_id,
		{ cache: "no-store" }
	);
	const data: Question[] = (await response.json()) as Question[];
	const productData: Product[] = (await fetch(
		process.env.NEXT_PUBLIC_BASE_URL + ".dataupload.xyz/products?all=true&system_id=" + system_id
	).then((res) => res.json())) as Product[];
	await Promise.all(
		data.map(async (question) => {
			if (question.connection === "Fix") return;
			const response = await fetch(`https://pen.dataupload.xyz/question_products/${question.id}`, {
				cache: "no-store",
			});
			const dataLocal: QuestionProduct[] = (await response.json()) as QuestionProduct[];
			const products = dataLocal.map((product) => product.product);
			question.products = products;
		})
	);
	const allData = data.map((question) => {
		return {
			...question,
			Termék:
				question.connection === "Fix"
					? "Fix"
					: productData.find(getFirstProduct(question))?.sku +
							" - " +
							productData.find(getFirstProduct(question))?.name +
							"" || "",
			Típus: (typeMap as any)[question.type] || "Nincs típus",
			Kötelező: question.mandatory ? "Kötelező" : "Nem kötelező",
			jsonProducts: JSON.stringify(
				question.connection === "Termék"
					? question.products?.map((product) => productData.find((p) => p.id === product))
					: ""
			),
		};
	});

	return <Questions data={allData} products={productData} />;
}
