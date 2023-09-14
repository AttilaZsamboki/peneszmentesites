import { Question } from "@/app/questions/page";
import { FelmeresQuestions } from "../page";
import ClientPage from "./_clientPage";
import { BaseFelmeresData, FelmeresItems } from "../new/_clientPage";
import { fetchAdatlapDetails } from "@/app/_utils/MiniCRM";

export interface FelmeresNotes {
	id: number;
	value: string;
	type: string;
	created_at: Date;
	adatlap_id: string;
}

export default async function Page({ params }: { params: { id: string } }) {
	const felmeresId = params.id;
	const felmeresQuestions: FelmeresQuestions[] = await fetch(
		"https://pen.dataupload.xyz/felmeres_questions/" + felmeresId,
		{
			next: { tags: [encodeURIComponent(felmeresId)] },
		}
	)
		.then((res) => res.json())
		.catch((err) => console.log(err));
	const question: Question[] = await Promise.all(
		felmeresQuestions.map(async (field) => {
			const question = await fetch("https://pen.dataupload.xyz/questions/" + field.question, {
				next: { tags: [encodeURIComponent(felmeresId)] },
			})
				.then((res) => res.json())
				.catch((err) => console.log(err));
			return question;
		})
	);

	const formattedFelmeres = felmeresQuestions.map((field) =>
		["GRID", "CHECKBOX_GRID", "FILE_UPLOAD", "CHECKBOX"].includes(
			question.find((q) => q.id === field.id)?.type ?? ""
		)
			? {
					...field,
					value: JSON.parse(field.value),
			  }
			: { ...field }
	);
	const felmeres: BaseFelmeresData = await fetch("https://pen.dataupload.xyz/felmeresek/" + felmeresId, {
		next: { tags: [encodeURIComponent(felmeresId)] },
	})
		.then((res) => res.json())
		.catch((err) => console.log(err));
	const felmeresItems: FelmeresItems[] = await fetch(
		"https://pen.dataupload.xyz/felmeres_items?adatlap_id=" + felmeresId,
		{
			next: { tags: [encodeURIComponent(felmeresId)] },
		}
	)
		.then((res) => res.json())
		.catch((err) => console.log(err));
	const adatlap = await fetchAdatlapDetails(felmeres.adatlap_id.toString());
	const template = await fetch("https://pen.dataupload.xyz/templates/" + felmeres.template, {
		next: { tags: [encodeURIComponent(felmeresId)] },
	})
		.then((res) => res.json())
		.catch((err) => console.log(err));

	return (
		<ClientPage
			felmeresQuestions={formattedFelmeres}
			felmeresItems={felmeresItems}
			questions={question}
			felmeresId={felmeresId}
			felmeresNonState={felmeres}
			adatlap={adatlap}
			template={template}
		/>
	);
}
