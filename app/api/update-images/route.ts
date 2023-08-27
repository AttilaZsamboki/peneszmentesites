import { NextRequest, NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { FelmeresQuestions } from "@/app/felmeresek/page";
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

	const fileName = files[1].name;
	const s3Client = new S3Client({
		region: process.env.AWS_REGION ?? "",
		credentials: {
			accessKeyId: process.env.AWS_ACCESS_KEY_ID ?? "",
			secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? "",
		},
	});
	const uploadParams = {
		Bucket: process.env.AWS_BUCKET_NAME,
		Key: fileName,
		Body: buffer,
		ContentType: files[1].type,
		ACL: "public-read",
	};
	const uploadCommand = new PutObjectCommand(uploadParams);

	try {
		await s3Client.send(uploadCommand);
		const adatlapId = request.headers
			.get("referer")
			?.substring((request.headers.get("referer")?.lastIndexOf("/") as unknown as number) + 1);
		const id = request.nextUrl.searchParams.get("id");
		const dataResp = await fetch(`http://pen.dataupload.xyz/felmeres_questions/${adatlapId}`);
		const dataJson: FelmeresQuestions[] = await dataResp.json();
		const felmeres = dataJson.find((felmeres) => felmeres.id === parseInt(id ?? ""));
		if (!felmeres) {
			return NextResponse.json({ success: false }, { status: 400 });
		}
		const updateResp = await fetch(`http://pen.dataupload.xyz/felmeres_questions/${id}/`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				field: felmeres.field.toString(),
				value: JSON.stringify([...JSON.parse(felmeres.value), "KÉZI" + fileName]),
				adatlap_id: felmeres.adatlap_id.toString(),
				options: JSON.stringify(felmeres.options),
				type: "FILE_UPLOAD",
				section: felmeres.section.toString(),
			}),
		});
		if (!updateResp.ok) {
			return NextResponse.json({ success: false }, { status: 400 });
		}
		revalidateTag(encodeURIComponent(adatlapId || "default"));

		return NextResponse.json({ success: true, async_id_symbol: fileName }, { status: 200 });
	} catch (error) {
		console.error(error);
		return NextResponse.json({ success: false }, { status: 500 });
	}
}
