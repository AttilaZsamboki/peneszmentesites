import { Product } from "../products/page";
import { Question } from "../questions/page";

export const typeMap = {
	TEXT: "Szöveg",
	LIST: "Lista",
	MULTIPLE_CHOICE: "Több választós",
	GRID: "Rács",
	CHECKBOX_GRID: "Jelölőnégyzetes rács",
	SCALE: "Skála",
	FILE_UPLOAD: "Fájlfeltöltés",
};

export function getFirstProduct(question: Question): (value: Product, index: number, obj: Product[]) => unknown {
	return (product) => product.id === (question.products ? question.products[0] : 0);
}
