import { AdatlapData } from "../_utils/types";
import { Pagination } from "../page";
import Page1 from "./Page.1";

export default async function Page({ searchParams }: { searchParams: { view: "grid"; search?: string } }) {
	const data: Pagination<AdatlapData> = await fetch(
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
		.catch((err) => {
			console.log(err);
			return [];
		});

	return <Page1 data={data} />;
}
