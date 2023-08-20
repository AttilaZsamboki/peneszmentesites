import { NextRequest, NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import { join } from "path";

export async function POST(request: NextRequest) {
	const data = await request.formData();
	const files: File[] | null = data.getAll("files") as unknown as File[];

	if (!files) {
		console.log("FAIL");
		return NextResponse.json({ success: false }, { status: 400 });
	}

	const bytes = await files[1].arrayBuffer();
	const buffer = Buffer.from(bytes);

	// With the file data in the buffer, you can do whatever you want with it.
	// For this, we'll just write it to the filesystem in a new location

	const path = join(process.cwd(), "images", files[1].name);
	const id = request.headers
		.get("referer")
		?.substring((request.headers.get("referer")?.lastIndexOf("/") as unknown as number) + 1);
	await fetch("http://pen.dataupload.xyz/felmeresek_notes", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			type: "images",
			created_at: new Date().toISOString(),
			adatlap_id: id,
			value: JSON.stringify(
				files.filter((file) => (file as unknown as string) !== '{"color":null}').map((file) => file.name)
			),
		}),
	});
	await writeFile(path, buffer);

	return NextResponse.json({ success: true, async_id_symbol: files[1].name }, { status: 200 });
}
