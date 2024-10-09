import { cookies } from "next/headers";
import ClientPage from "./clientPage";

export type MunkadíjValueType = "hour" | "fix";

export interface Munkadíj {
	id: number;
	type: string;
	value: number;
	description: string;
	value_type: MunkadíjValueType;
	num_people: number;
}

export default async function Page() {
	const system_id = cookies().get("system")?.value;
	const munkadíjak = await fetch(
		`${process.env.NEXT_PUBLIC_BASE_URL}.dataupload.xyz/munkadij?system_id=${system_id}`,
		{
			cache: "no-cache",
		}
	)
		.then((resp) => resp.json())
		.catch(() => []);

	return <ClientPage munkadijak={munkadíjak} />;
}
