import { Kanban } from "@/components/component/kanban";
import Header from "./Page.1";
import { Grid } from "@/components/component/table";
import { getAdatlapok } from "@/lib/fetchers";
import { AdatlapData } from "../_utils/types";

export default async function Page({ searchParams }: { searchParams: { view: "grid" | "kanban" } }) {
	const data = await getAdatlapok([], 29);
	// Todo: Pagination
	const LIMIT = 10;
	return (
		<div className='flex flex-col h-screen'>
			<header className='h-[60px] flex items-center shadow-none bg-white border-b'>
				<Header searchParams={searchParams} />
			</header>
			<Body searchParams={searchParams} data={data.slice(0, LIMIT)} />
		</div>
	);
}
function Body({ searchParams, data }: { searchParams: { view: "grid" | "kanban" }; data: AdatlapData[] }) {
	if (searchParams.view === "kanban") {
		return <Kanban data={data} />;
	} else if (searchParams.view === "grid") {
		return <Grid data={data} />;
	} else {
		return <div>404</div>;
	}
}
