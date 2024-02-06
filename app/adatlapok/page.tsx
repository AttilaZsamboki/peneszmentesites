import { Kanban } from "@/components/component/kanban";
import Header from "./Page.1";
import { Grid } from "@/components/component/table";
import { getAdatlapok } from "@/lib/fetchers";

export default async function Page({ searchParams }: { searchParams: { view: "grid" | "kanban" } }) {
	const data = await getAdatlapok();
	return (
		<div className='flex flex-col h-screen'>
			<header className='h-[60px] flex items-center shadow-none bg-white border-b'>
				<Header searchParams={searchParams} />
			</header>
			<Body searchParams={searchParams} />
		</div>
	);
}
function Body({ searchParams }: { searchParams: { view: "grid" | "kanban" } }) {
	if (searchParams.view === "kanban") {
		return <Kanban />;
	} else if (searchParams.view === "grid") {
		return <Grid />;
	} else {
		return <div>404</div>;
	}
}
