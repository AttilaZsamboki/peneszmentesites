import { Felmeres } from "../page";
import ClientPage from "./_clientPage";

export interface FelmeresNotes {
	id: number;
	value: string;
	type: string;
	created_at: Date;
	adatlap_id: string;
}

export default async function Page({ params }: { params: { id: string } }) {
	const felmeresId = params.id;
	const data = await fetch("http://pen.dataupload.xyz/felmeresek/" + felmeresId, { next: { tags: [felmeresId] } });
	const felmeres: Felmeres[] = data.ok ? await data.json() : [];
	const formattedFelmeres = felmeres.map((field) =>
		["GRID", "CHECKBOX_GRID", "FILE_UPLOAD"].includes(field.type)
			? {
					...field,
					value: JSON.parse(field.value.replace(/None/g, null as unknown as string).replace(/'/g, '"')),
			  }
			: { ...field }
	);
	const notes = await fetch("http://pen.dataupload.xyz/felmeresek_notes?adatlap_id=" + felmeresId, {
		cache: "no-store",
	});
	const felmeresNotes: FelmeresNotes[] = notes.ok ? await notes.json() : [];

	return <ClientPage formattedFelmeres={formattedFelmeres} felmeresNotes={felmeresNotes} felmeresId={felmeresId} />;
}
