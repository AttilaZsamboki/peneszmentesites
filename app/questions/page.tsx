import { Filters, Product } from "../products/page";
import Questions from "./_clientComponent";

export interface Question {
	id: number;
	question: string;
	type: string;
	options: any;
	connection: string;
	product: number;
}

export function isJSONParsable(str: string) {
	try {
		JSON.parse(str);
		return true;
	} catch (e) {
		return false;
	}
}

export default async function QuestionsFetch() {
	const response = await fetch("http://pen.dataupload.xyz/questions", { cache: "no-store" });
	const data: Question[] = await response.json();
	const productData: Product[] = await fetch("http://pen.dataupload.xyz/products").then((res) => res.json());
	return (
		<Questions
			data={data.map((question) => ({
				...question,
				options: isJSONParsable(question.options) ? JSON.parse(question.options) : {},
			}))}
			products={productData}
		/>
	);
}
