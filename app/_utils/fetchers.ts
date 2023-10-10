import { Template } from "../templates/page";

export const createTemplate = async (items: string[], template: Template) => {
	const templateResponse = await fetch("https://pen.dataupload.xyz/templates/", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(template),
	});
	if (templateResponse.ok) {
		const templateResponseData = await templateResponse.json();
		await Promise.all(
			items.map(
				async (item) =>
					await fetch("https://pen.dataupload.xyz/product_templates/", {
						method: "POST",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify({ template_id: templateResponseData.id, product_id: parseInt(item) }),
					})
			)
		);
		return templateResponseData;
	}
};
