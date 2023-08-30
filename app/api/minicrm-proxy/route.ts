import { fetchMiniCRM } from "@/app/_utils/MiniCRM";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
	const endpoint = request.nextUrl.searchParams.get("endpoint");
	const id = request.nextUrl.searchParams.get("id");
	if (!endpoint || !id) {
		return new Response("Missing endpoint or id", { status: 400 });
	}
	const data = await fetchMiniCRM(endpoint, id);
	return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
	const endpoint = request.nextUrl.searchParams.get("endpoint");

	if (endpoint === "XML") {
		var myHeaders = new Headers();
		myHeaders.append("Authorization", process.env.MINICRM_AUTH!);
		myHeaders.append("Content-Type", "application/json");

		const payload = await request.text();
		var requestOptions = {
			method: "POST",
			headers: myHeaders,
			body: payload,
		};
		const response = await fetch("https://r3.minicrm.hu/Api/SyncFeed/119/Upload", requestOptions);
		if (response.ok) {
			return NextResponse.json(response);
		}
		return NextResponse.json("Error " + response.statusText, { status: 400 });
	}
	return NextResponse.json("Missing endpoint", { status: 400 });
}
