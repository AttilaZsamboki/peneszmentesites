import { Product } from "../products/page";
import Questions from "./_clientComponent";
import { typeMap } from "../_utils/utils";

export interface Question {
	id: number;
	question: string;
	type: string;
	options: any;
	connection: string;
	product?: number;
	mandatory: boolean;
	description: string;
}

export default async function QuestionsFetch() {
	const response = await fetch("https://pen.dataupload.xyz/questions", { next: { tags: ["questions"] } });
	const data: Question[] = (await response.json()) as Question[];
	const productData: Product[] = (await fetch("https://pen.dataupload.xyz/products").then((res) =>
		res.json()
	)) as Product[];
	const allData = data.map((question) => {
		return {
			...question,
			subtitle:
				question.connection === "Fix"
					? "Fix"
					: productData.find((product) => product.id === question.product)?.sku +
							" - " +
							(productData.find((product) => product.id === question.product)?.name.substring(0, 25) +
								((
									productData.find((product) => product.id === question.product)
										? productData.find((product) => product.id === question.product)!.name.length >
										  25
										: false
								)
									? "..."
									: "")) ||
					  "" ||
					  "",
			subtitle2: (typeMap as any)[question.type] || "Nincs típus",
			isMandatory: question.mandatory ? "Kötelező" : "Nem kötelező",
		};
	});

	return <Questions data={allData} products={productData} />;
}
