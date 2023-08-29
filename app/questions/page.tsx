import { Product } from "../products/page";
import Questions from "./_clientComponent";

export interface Question {
	id: number;
	question: string;
	type: string;
	options: any;
	connection: string;
	product?: number;
}


export default async function QuestionsFetch() {
	const response = await fetch("http://pen.dataupload.xyz/questions", { cache: "no-store" });
	const data: Question[] = (await response.json()) as Question[];
	const productData: Product[] = (await fetch("http://pen.dataupload.xyz/products").then((res) =>
		res.json()
	)) as Product[];
	return (
		<Questions
			data={data.map((question) => {
				try {
					question.options = JSON.parse(question.options as string);
				} catch (e) {
					question.options = {};
				}
				return {
					...question,
				};
			})}
			products={productData}
		/>
	);
}
