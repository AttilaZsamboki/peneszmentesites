import { Question } from "@/app/questions/page";
import { FelmeresQuestion } from "../page";
import ClientPage from "./_clientPage";
import { BaseFelmeresData, FelmeresItem, FelmeresMunkadíj } from "../new/_clientPage";
import EditClientPage from "./edit/clientPage";
import { notFound } from "next/navigation";
import { Product } from "../products/page";
import { cookies } from "next/headers";

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

	const cookieStore = cookies();
	const JsonWebToken = cookieStore.get("jwt")?.value;
	if (!JsonWebToken) {
		return <div>Nincs bejelentkezve</div>;
	}

	const felmeres: BaseFelmeresData = await fetch("https://pen.dataupload.xyz/felmeresek/" + felmeresId, {
		next: { tags: [encodeURIComponent(felmeresId)], revalidate: 60 },
		headers: {
			"Content-Type": "application/json",
			"Authorization": `Bearer ${JsonWebToken}`,
		},
	})
		.then((res) => res.json())
		.catch((err) => {
			return { adatlap_id: 0 };
		});
	const felmeresItems: FelmeresItem[] = await fetch(
		"https://pen.dataupload.xyz/felmeres_items?adatlap_id=" + felmeresId,
		{
			next: { tags: [encodeURIComponent(felmeresId)], revalidate: 60 },
		}
	)
		.then((res) => res.json())
		.then((data: FelmeresItem[]) => data.map((d, index) => ({ ...d, sort_number: index })))
		.catch((err) => {
			console.error(err);
			return [];
		});
	const felmeresMunkadíjak: FelmeresMunkadíj[] = await fetch(
		"https://pen.dataupload.xyz/felmeres-munkadij?felmeres=" + felmeresId,
		{
			next: { tags: [encodeURIComponent(felmeresId)], revalidate: 60 },
		}
	)
		.then((res) => res.json())
		.catch((err) => {
			console.error(err);
			return [];
		});

	const system_id = cookieStore.get("system")?.value;
	const products: Product[] = await fetch(
		`${process.env.NEXT_PUBLIC_BASE_URL}.dataupload.xyz/products?system_id=${system_id}&all=true`,
		{
			next: { tags: ["products"] },
		}
	).then((response) => (response.ok ? response.json() : []));
	const pictures = await fetch("https://pen.dataupload.xyz/felmeres-pictures?felmeres_id=" + felmeresId, {
		next: { tags: [encodeURIComponent(felmeresId)] },
	})
		.then((res) => res.json())
		.catch((err) => {
			console.error(err);
			return [];
		});
	const munkadíjak = await fetch(
		`${process.env.NEXT_PUBLIC_BASE_URL}.dataupload.xyz/munkadij?system_id=${system_id}`,
		{
			next: { tags: ["munkadijak"] },
		}
	)
		.then((response) => response.json())
		.catch((error) => console.error("error", error));

	if (edit) {
		return (
			<EditClientPage
				munkadíjak={munkadíjak}
				felmeresMunkadíjak={felmeresMunkadíjak.map((munkadij, index) => ({ ...munkadij, order_id: index }))}
				pictures={pictures}
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
				.catch((err) => {
					console.error(err);
					return {};
				});
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
	if (!felmeres || !felmeres.adatlap_id) {
		notFound();
	}

	const adatlap = await fetch("https://pen.dataupload.xyz/minicrm-adatlapok/" + felmeres.adatlap_id.toString())
		.then((res) => res.json())
		.catch((err) => {
			console.error(err);
			return {};
		});

	const chat = await fetch("https://pen.dataupload.xyz/felmeres-notes?felmeres_id=" + felmeres.id, {
		next: { tags: [encodeURIComponent(felmeresId)] },
	})
		.then((res) => res.json())
		.catch((err) => {
			console.error(err);
			return [];
		});

	if (adatlap) {
		return (
			<ClientPage
				felmeresMunkadíjak={felmeresMunkadíjak}
				munkadíjak={munkadíjak}
				pictures={pictures}
				felmeresQuestions={formattedFelmeres}
				felmeresItems={felmeresItems}
				questions={question}
				felmeresId={felmeresId}
				felmeresNonState={felmeres}
				adatlap={adatlap}
				products={products}
				chat={chat}
			/>
		);
	} else {
		return <div>Nincs adatlap</div>;
	}
}
