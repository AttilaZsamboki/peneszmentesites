import { fetchAdatlapokV2 } from "@/lib/fetchers";
import { AdatlapData } from "../_utils/types";
import { Pagination } from "../page";
import Page1 from "./Page.1";

export default async function Page({ searchParams }: { searchParams: { [key: string]: string } }) {
	const data: Pagination<AdatlapData> = await fetchAdatlapokV2(searchParams);
	return <Page1 data={data} />;
}
