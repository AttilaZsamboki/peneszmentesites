import { AdatlapData } from "../_utils/types";
import { Pagination } from "../page";
import Page1 from "./Page.1";

export default async function Page({ searchParams }: { searchParams: { view: "grid" | "kanban"; search?: string } }) {
	const data = await fetch(
		`https://pen.dataupload.xyz/minicrm-adatlapok/v2/?CategoryId=23&StatusId=3023,3084,3086${
			searchParams.search ? "&search=" + searchParams.search : ""
		}`
	)
		.then((res) => res.json())
		.catch((err) => {
			console.log(err);
			return [];
		})
		.then((data: Pagination<AdatlapData>) =>
			data.results
				.filter((adatlap) => adatlap)
				.map((adatlap) => ({ ...adatlap, BeepitesDatuma: new Date(adatlap.DateTime1953) }))
		);

	return <Page1 data={data} searchParams={searchParams} />;
}
