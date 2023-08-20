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
	const data = await fetch("https://pen.dataupload.xyz/felmeresek/" + felmeresId, { next: { tags: [felmeresId] } });
	const felmeres: Felmeres[] = data.ok ? await data.json() : [];
	const formattedFelmeres = felmeres.map((field) =>
		["GRID", "CHECKBOX_GRID", "FILE_UPLOAD"].includes(field.type)
			? {
					...field,
					value: JSON.parse(field.value.replace(/None/g, null as unknown as string).replace(/'/g, '"')),
			  }
			: { ...field }
	);
	const notes = await fetch("https://pen.dataupload.xyz/felmeresek_notes?adatlap_id=" + felmeresId, {
		cache: "no-store",
	});
	const felmeresNotes: FelmeresNotes[] = notes.ok ? await notes.json() : [];

	return (
		<div className='bg-white'>
			<div className='px-4 sm:px-0 pt-10'>
				<h3 className='text-base font-semibold leading-7 text-gray-900'>Felmérés adatok</h3>
			</div>
			<div className='mt-6 border-t border-gray-100'>
				<ClientPage
					formattedFelmeres={formattedFelmeres}
					felmeresNotes={felmeresNotes}
					felmeresId={felmeresId}
				/>
			</div>
		</div>
	);
}
