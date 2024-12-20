import { NextRequest, NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";

export async function GET(request: NextRequest) {
	const tag = request.nextUrl.searchParams.get("tag");
	const path = request.nextUrl.searchParams.get("path");

	if (path) {
		revalidatePath(path);
		return NextResponse.json({ revalidated: true, now: Date.now() });
	} else if (tag) {
		revalidateTag(tag);
		return NextResponse.json({ revalidated: true, now: Date.now() });
	}

	return NextResponse.json({
		revalidated: false,
		now: Date.now(),
		message: "Missing path to revalidate",
	});
}
