import { AdatlapData } from "@/app/_utils/types";
import { Template } from "../app/templates/page";
import { ProductTemplate } from "@/app/new/_clientPage";

export const createTemplate = async (items: ProductTemplate[], template: Template) => {
	const templateResponse = await fetch("https://pen.dataupload.xyz/templates/", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(template),
	});
	if (templateResponse.ok) {
		return await saveProducts(templateResponse, items, undefined);
	}
};

export const updateTemplate = async (template: Template, items: ProductTemplate[]) => {
	const response = await fetch(`https://pen.dataupload.xyz/templates/${template.id}/`, {
		method: "PUT",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(template),
	});

	return await saveProducts(response, items, template);
};
async function saveProducts(
	templateResponse: Response,
	items: ProductTemplate[],
	template?: Template
): Promise<Template> {
	const templateResponseData = await templateResponse.json();
	await fetch(
		`https://pen.dataupload.xyz/product_templates/?template_id=${template?.id ?? templateResponseData.id}`,
		{
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(items),
		}
	);
	await fetch("/api/revalidate?tag=templates");
	return templateResponseData;
}

export async function getAdatlapok(queryParams: { CategoryId?: string; id?: string; StatusIds?: number[] }) {
	return await fetch(
		`https://pen.dataupload.xyz/minicrm-adatlapok/${Object.entries(queryParams)
			.map(
				([key, value], index) =>
					`${index === 0 ? "?" : ""}${key}=${typeof value === "object" ? value.join(",") : value}`
			)
			.join("&")}`,
		{
			next: { tags: ["adatlapok"], revalidate: 120 },
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		}
	)
		.then((res) => res.json())
		.catch((err) => {
			console.log(err);
			return [];
		})
		.then((data: AdatlapData[]) => data.filter((adatlap) => adatlap));
}
