import { Product } from "../products/page";
import ClientPage from "./clientPage";

export interface Munkadíj {
	id: number;
	type: string;
	value: number;
	description: string;
}

export default async function Page() {
	const munkadíjak = await fetch("https://pen.dataupload.xyz/munkadij", {
		cache: "no-cache",
	})
		.then((resp) => resp.json())
		.catch(() => []);

	return <ClientPage munkadijak={munkadíjak} />;
}
