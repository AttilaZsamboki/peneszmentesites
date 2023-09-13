import { Product } from "../products/page";
import Questions from "./_clientComponent";
import { typeMap } from "../_utils/utils";

export interface Question {
	id: number;
	question: string;
	type: string;
	options: any;
	connection: string;
	products?: number[];
	mandatory: boolean;
	description: string;
	product?: number;
}

export interface QuestionProducts {
	question: number;
	product: number;
}

export default async function QuestionsFetch() {
	const response = await fetch("https://pen.dataupload.xyz/questions", { next: { tags: ["questions"] } });
	const data: Question[] = (await response.json()) as Question[];
	const productData: Product[] = (await fetch("https://pen.dataupload.xyz/products").then((res) =>
		res.json()
	)) as Product[];
	await Promise.all(
		data.map(async (question) => {
			if (question.connection === "Fix") return;
			const response = await fetch(`https://pen.dataupload.xyz/question_products/${question.id}`, {
				next: { tags: ["questionproducts", "questions", "product-attributes"] },
			});
			const dataLocal: QuestionProducts[] = (await response.json()) as QuestionProducts[];
			const products = dataLocal.map((product) => product.product);
			question.products = products;
		})
	);
	const allData = data.map((question) => {
		return {
			...question,
			subtitle:
				question.connection === "Fix"
					? "Fix"
					: productData.find(getFirstProduct(question))?.sku +
							" - " +
							(productData.find(getFirstProduct(question))?.name.substring(0, 25) +
								((
									productData.find(getFirstProduct(question))
										? productData.find(getFirstProduct(question))!.name.length > 25
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
export function getFirstProduct(question: Question): (value: Product, index: number, obj: Product[]) => unknown {
	return (product) => product.id === (question.products ? question.products[0] : 0);
}
