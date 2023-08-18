import { NextResponse, NextRequest } from "next/server";
import { unlink } from "fs/promises";

export async function DELETE(request: NextRequest) {
	const image = await request.json();
	const path = `C:/Users/zsamb/Documents/dev/pen-frontend/public/images/${image["filename"]}`;
	try {
		await unlink(path);
	} catch (err) {
		console.error(err);
	}

	return NextResponse.json({ success: true }, { status: 200 });
}
