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
