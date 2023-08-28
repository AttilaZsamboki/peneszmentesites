import { AdatlapDetails } from "../felmeresek/page";

export async function fetchAdatlapDetails(adatlap_id: string) {
	var myHeaders = new Headers();
	myHeaders.append("Authorization", process.env.MINICRM_API_KEY!);
	myHeaders.append("Content-Type", "application/json");

	var requestOptions = {
		method: "GET",
		headers: myHeaders,
	};

	const resp = await fetch("https://r3.minicrm.hu/Api/R3/Project/" + adatlap_id, requestOptions);
	if (resp.ok) {
		const data: AdatlapDetails = await resp.json();
		return data;
	}
	return {} as AdatlapDetails;
}
