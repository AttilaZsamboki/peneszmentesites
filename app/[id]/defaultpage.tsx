import { Question } from "@/app/questions/page";
import { FelmeresQuestion } from "../page";
import ClientPage from "./_clientPage";
import { BaseFelmeresData, FelmeresItem } from "../new/_clientPage";
import { fetchAdatlapDetails } from "@/app/_utils/MiniCRM";
import EditClientPage from "./edit/clientPage";
import { notFound } from "next/navigation";
import { Product } from "../products/page";

export default async function DefaultPage({ params, edit }: { params: { id: string }; edit: boolean }) {
	const felmeresId = params.id;
	const felmeresQuestions: FelmeresQuestion[] = await fetch(
		"https://pen.dataupload.xyz/felmeres_questions/" + felmeresId,
		{
			next: { tags: [encodeURIComponent(felmeresId)] },
		}
	)
		.then((res) => res.json())
		.catch((err) => {
			console.error(err);
			return [];
		});

	const felmeres: BaseFelmeresData = await fetch("https://pen.dataupload.xyz/felmeresek/" + felmeresId, {
		next: { tags: [encodeURIComponent(felmeresId)] },
	})
		.then((res) => res.json())
		.catch((err) => {
			console.error(err);
			return { adatlap_id: 0 };
		});
	const felmeresItems: FelmeresItem[] = await fetch(
		"https://pen.dataupload.xyz/felmeres_items?adatlap_id=" + felmeresId,
		{
			next: { tags: [encodeURIComponent(felmeresId)] },
		}
	)
		.then((res) => res.json())
		.catch((err) => console.error(err));
	const products: Product[] = await fetch("https://pen.dataupload.xyz/products?all=true", {
		next: { tags: ["products"] },
	}).then((response) => response.json());

	if (edit) {
		return (
			<EditClientPage
				felmeres={felmeres}
				felmeresItems={felmeresItems}
				felmeresQuestions={felmeresQuestions}
				products={products}
			/>
		);
	}
	const question: Question[] = await Promise.all(
		Array.from(new Set(felmeresQuestions.map((field) => field.question))).map(async (questionId) => {
			const question = await fetch("https://pen.dataupload.xyz/questions/" + questionId, {
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
	console.log(felmeres);
	if (!felmeres || !felmeres.adatlap_id) {
		console.log(felmeres);
		notFound();
	}

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
				products={products}
			/>
		);
	} else {
		return <div>Nincs adatlap</div>;
	}
}
