import { AdatlapData } from "../_utils/types";
import Page1 from "./Page.1";

export async function fetchAdatlapokV2(searchParams: { [key: string]: string }) {
	return await fetch(
		`https://pen.dataupload.xyz/minicrm-adatlapok/v2/?CategoryId=23&StatusId=3023,3084,3086${Object.entries(
			searchParams
		)
			.filter(([key, value]) => key !== "view" && value !== undefined)
			.map(([key, value]: string[], index) => `${index === 0 ? "&" : ""}${key}=${value}`)
			.join("&")}`,
		{
			next: { tags: ["adatlapok-v2"], revalidate: 1800 },
		}
	)
		.then((res) => res.json())
		.then((data: any) => {
			data.forEach((item: any) => {
				item.DateTime1953 = item.DateTime1953 ? new Date(item.DateTime1953) : null;
			});
			return data.slice(0, 100);
		})
		.catch((err) => {
			console.log(err);
			return [];
		});
}

export default async function Page({ searchParams }: { searchParams: { [key: string]: string } }) {
	const data: AdatlapData[] = await fetchAdatlapokV2(searchParams);
	return <Page1 data={data} />;
}
