import { Product } from "../products/page";
import { Question } from "../questions/page";

export const typeMap = {
	TEXT: "Szöveg",
	LIST: "Lista",
	CHECKBOX: "Jelölőnégyzet",
	MULTIPLE_CHOICE: "Több választós",
	GRID: "Rács",
	CHECKBOX_GRID: "Jelölőnégyzetes rács",
	SCALE: "Skála",
	FILE_UPLOAD: "Fájlfeltöltés",
};

export const statusMap = {
	DRAFT: { name: "Vázlat", color: "gray", className: "bg-gray-900/10 text-gray-900" },
	IN_PROGRESS: { name: "Folyamatban", color: "blue", className: "bg-blue-500/20 text-blue-900" },
	COMPLETED: { name: "Kész", color: "green", className: "bg-green-500/20 text-green-900" },
};

export function getFirstProduct(question: Question): (value: Product, index: number, obj: Product[]) => unknown {
	return (product) => product.id === (question.products ? question.products[0] : 0);
}
