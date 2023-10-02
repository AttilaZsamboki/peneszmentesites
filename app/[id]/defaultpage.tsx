import { Question } from "@/app/questions/page";
import { FelmeresQuestion } from "../page";
import ClientPage from "./_clientPage";
import { BaseFelmeresData, FelmeresItem } from "../new/_clientPage";
import { fetchAdatlapDetails } from "@/app/_utils/MiniCRM";
import EditClientPage from "./edit/clientPage";

export default async function DefaultPage({ params, edit }: { params: { id: string }; edit: boolean }) {
	const felmeresId = params.id;
	const felmeresQuestions: FelmeresQuestion[] = await fetch(
		"https://pen.dataupload.xyz/felmeres_questions/" + felmeresId,
		{
			next: { tags: [encodeURIComponent(felmeresId)] },
		}
	)
		.then((res) => res.json())
		.catch((err) => console.error(err));

	const felmeres: BaseFelmeresData = await fetch("https://pen.dataupload.xyz/felmeresek/" + felmeresId, {
		next: { tags: [encodeURIComponent(felmeresId)] },
	})
		.then((res) => res.json())
		.catch((err) => console.error(err));
	const felmeresItems: FelmeresItem[] = await fetch(
		"https://pen.dataupload.xyz/felmeres_items?adatlap_id=" + felmeresId,
		{
			next: { tags: [encodeURIComponent(felmeresId)] },
		}
	)
		.then((res) => res.json())
		.catch((err) => console.error(err));

	if (edit) {
		return (
			<EditClientPage felmeres={felmeres} felmeresItems={felmeresItems} felmeresQuestions={felmeresQuestions} />
		);
	}
	const question: Question[] = await Promise.all(
		felmeresQuestions.map(async (field) => {
			const question = await fetch("https://pen.dataupload.xyz/questions/" + field.question, {
				next: { tags: [encodeURIComponent(felmeresId)] },
			})
				.then((res) => res.json())
				.catch((err) => console.error(err));
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

	const adatlap = await fetchAdatlapDetails(felmeres.adatlap_id.toString());

	const template = await fetch("https://pen.dataupload.xyz/templates/" + felmeres.template, {
		next: { tags: [encodeURIComponent(felmeresId)] },
	})
		.then((res) => res.json())
		.catch((err) => {
			console.error(err);
			return {};
		});

	if (adatlap) {
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
	} else {
		return <div>Nincs adatlap</div>;
	}
}
