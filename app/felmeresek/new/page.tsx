import { Template } from "@/app/templates/page";
import ClientPage from "./_clientPage";

export interface Adatlap {
	Count: number;
	Results: {
		[adatlap_id: number]: AdatlapData;
	};
}

export interface AdatlapData {
	Id: number;
	Name: string;
	Url: string;
	ContactId: number;
	StatusId: number;
	UserId: number;
	Deleted: number;
	BusinessId?: number;
}

export default async function Page() {
	var myHeaders = new Headers();
	myHeaders.append("Authorization", "Basic MTE5OkQwNlBVTE9JM2VUUkJLY2xqQUdRWWJkNEZFcHVWeTFn");
	myHeaders.append("Content-Type", "application/json");

	var requestOptions = {
		method: "GET",
		headers: myHeaders,
	};

	const adatlapok: AdatlapData[] = await fetch("https://r3.minicrm.hu/Api/R3/Project?CategoryId=23", requestOptions)
		.then((response) => response.json())
		.then((result: Adatlap) =>
			Object.values(result.Results).filter((adatlap) => adatlap.Deleted === 0 && adatlap.StatusId === 3023)
		);
	const templates: Template[] = await fetch("http://pen.dataupload.xyz/templates").then((response) =>
		response.json()
	);
	return <ClientPage adatlapok={adatlapok} templates={templates}/>;
}
