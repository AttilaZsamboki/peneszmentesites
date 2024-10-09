import { AdatlapData } from "@/app/_utils/types";
import { Template } from "../app/templates/page";
import { ProductTemplate } from "@/app/new/_clientPage";
import { Pagination } from "@/app/page";
import { cookies } from "next/headers";

export const createTemplate = async (items: ProductTemplate[], template: Template) => {
	"use server";
	const system_id = cookies().get("system")?.value;
	const templateResponse = await fetch("https://pen.dataupload.xyz/templates/", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ ...template, system: system_id }),
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
	"use server";
	const system_id = cookies().get("system")?.value;
	return await fetch(
		`https://pen.dataupload.xyz/minicrm-adatlapok/?system_id=${system_id}${Object.entries(queryParams)
			.map(
				([key, value], index) =>
					`${index === 0 ? "&" : ""}${key}=${typeof value === "object" ? value.join(",") : value}`
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
			return [];
		})
		.then((data: AdatlapData[]) => data.filter((adatlap) => adatlap));
}

export async function fetchAdatlapokV2(searchParams: { [key: string]: string }): Promise<Pagination<AdatlapData>> {
	"use server";
	const system_id = cookies().get("system")?.value;
	return await fetch(
		`https://pen.dataupload.xyz/minicrm-adatlapok/v2/?system_id=${system_id}&CategoryId=23&StatusId=3023,3084,3086${Object.entries(
			searchParams
		)
			.map(([key, value]: string[], index) => `${index === 0 ? "&" : ""}${key}=${value}`)
			.join("&")}`,
		{
			next: { tags: ["adatlapok-v2"], revalidate: 1800 },
		}
	)
		.then((res) => res.json())
		.then((data: any) => {
			data.results.forEach((item: AdatlapData) => {
				if (item.DateTime1953) {
					item.DateTime1953 = new Date(item.DateTime1953);
				}
				item.FelmeresIdopontja2 = new Date(item.FelmeresIdopontja2);
			});
			return data;
		})
		.catch((err) => {
			return [];
		});
}
