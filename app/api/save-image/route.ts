import { NextRequest, NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { revalidateTag } from "next/cache";

export const runtime = "edge";

export async function POST(request: NextRequest) {
	const data = await request.formData();
	const files: File[] | null = data.getAll("files") as unknown as File[];

	if (!files) {
		console.log("FAIL");
		return NextResponse.json({ success: false }, { status: 400 });
	}

	const bytes = await files[1].arrayBuffer();
	const buffer = Buffer.from(bytes);

	const fileName = request.nextUrl.searchParams.get("id");
	const s3Client = new S3Client({
		region: process.env.AWS_REGION ?? "",
		credentials: {
			accessKeyId: process.env.AWS_ACCESS_KEY_ID ?? "",
			secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? "",
		},
	});
	const uploadParams = {
		Bucket: process.env.AWS_BUCKET_NAME,
		Key: fileName?.toString() ?? "",
		Body: buffer,
		ContentType: files[1].type,
		ACL: "public-read",
	};
	const uploadCommand = new PutObjectCommand(uploadParams);

	try {
		await s3Client.send(uploadCommand);
		const adatlapId = request.nextUrl.searchParams.get("adatlapId");
		revalidateTag(encodeURIComponent(adatlapId || "default"));

		return NextResponse.json({ success: true, async_id_symbol: fileName }, { status: 200 });
	} catch (error) {
		console.error(error);
		return NextResponse.json({ success: false }, { status: 500 });
	}
}
