import { fetchMiniCRM } from "@/app/_utils/MiniCRM";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(request: NextRequest, id: { params: { adatlap_id: string } }) {
	const adatlap_id = id.params.adatlap_id;
	const endpoint = request.nextUrl.searchParams.get("endpoint");
	const data = await fetchMiniCRM(endpoint ?? "Project", adatlap_id, "PUT", await request.json());
	return NextResponse.json(JSON.stringify(data));
}
