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
	const munkadíjak = await fetch("https://pen.dataupload.xyz/munkadij", {
		cache: "no-cache",
	})
		.then((resp) => resp.json())
		.catch(() => []);

	return <ClientPage munkadijak={munkadíjak} />;
}
