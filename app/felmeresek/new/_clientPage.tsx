"use client";
import { Tooltip } from "@material-tailwind/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import React from "react";
import { FelmeresQuestions, ScaleOption } from "../page";
import { AdatlapData } from "./page";
import AutoComplete from "@/app/_components/AutoComplete";
import { Template } from "@/app/templates/page";
import { Product } from "@/app/products/page";
import { Question } from "@/app/questions/page";

import { ExclamationCircleIcon } from "@heroicons/react/20/solid";

import Input from "@/app/_components/Input";
import MultipleChoice from "@/app/_components/MultipleChoice";
import { GridOptions } from "../page";
import { Grid } from "@/app/_components/Grid";
import FileUpload from "@/app/_components/FileUpload";
import { useRouter } from "next/navigation";
import { ProductAttributes } from "@/app/products/_clientPage";
import { ToDo, assembleOfferXML, fetchMiniCRM, list_to_dos } from "@/app/_utils/MiniCRM";
import { useSearchParams } from "next/navigation";
import { useGlobalState } from "@/app/_clientLayout";

import { Page2 } from "./Page2";
import { useToast } from "@/components/ui/use-toast";

export interface ProductTemplate {
	product: number;
	template: number;
}

export interface BaseFelmeresData {
	id: number;
	adatlap_id: number;
	type: string;
	template: number;
	status: "DRAFT" | "IN_PROGRESS" | "COMPLETED" | undefined;
}

export interface FelmeresItems {
	name: string;
	place: boolean;
	placeOptions: string[];
	productId: number;
	inputValues: { value: string; id: number; ammount: number }[];
	netPrice: number;
	adatlap: number;
	sku: string;
	attributeId: number;
}

export const hufFormatter = new Intl.NumberFormat("hu-HU", {
	style: "currency",
	currency: "HUF",
});

export const numberFormatter = new Intl.NumberFormat("hu-HU", {
	style: "decimal",
});

export interface OtherFelmeresItems {
	name: string;
	value: number;
	type: "percent" | "fixed";
	id: number;
}

export default function Page({
	adatlapok,
	templates,
	products,
	productAttributes,
}: {
	adatlapok: AdatlapData[];
	templates: Template[];
	products: Product[];
	productAttributes: ProductAttributes[];
}) {
	const { setProgress } = useGlobalState();
	const searchParams = useSearchParams();
	const [page, setPage] = React.useState(0);
	const [section, setSection] = React.useState("Alapadatok");
	const [felmeres, setFelmeres] = React.useState<BaseFelmeresData>({
		id: 0,
		adatlap_id: searchParams.get("adatlap_id") ? parseInt(searchParams.get("adatlap_id")!) : 0,
		type: "",
		template: 0,
		status: "DRAFT",
	});
	const [items, setItems] = React.useState<FelmeresItems[]>([]);
	const [numPages, setNumPages] = React.useState(0);
	const router = useRouter();
	const [data, setData] = React.useState<FelmeresQuestions[]>([]);
	const [questions, setQuestions] = React.useState<Question[]>([]);
	const [otherItems, setOtherItems] = React.useState<OtherFelmeresItems[]>([
		{
			name: "Munkadíj",
			value: 0,
			type: "percent",
			id: 0,
		},
		{
			name: "Egyéb szerelési segédanyagok",
			value: 0,
			type: "fixed",
			id: 1,
		},
	]);
	const [discount, setDiscount] = React.useState(0);
	const { toast } = useToast();

	React.useEffect(() => {
		const fetchQuestions = async () => {
			items.map(async (item) => {
				const res = await fetch("https://pen.dataupload.xyz/question_products?product=" + item.productId);
				if (res.ok) {
					const questionProducts: { question: number; product: number }[] = await res.json();
					questionProducts.map(async (questionProduct) => {
						const data = await fetch("https://pen.dataupload.xyz/questions/" + questionProduct.question);
						if (data.ok) {
							const question: Question = await data.json();
							setQuestions((prev) => [
								...prev.filter(
									(question) =>
										question.id !== questionProduct.question || question.product !== item.productId
								),
								{ ...question, product: item.productId },
							]);
						}
					});
				}
			});
			const res = await fetch("https://pen.dataupload.xyz/questions?connection=Fix");
			if (res.ok) {
				const data: Question[] = await res.json();
				setQuestions((prev) => [
					...prev.filter((question) => !data.map((q) => q.id).includes(question.id)),
					...data,
				]);
			}
		};
		fetchQuestions();
	}, [items]);

	const CreateFelmeres = async () => {
		const percent = (num: number) => Math.floor((num / 3157) * 100);
		const updateToast = (num: number) => {
			toast({
				title: "Felmérés létrehozása",
				description: "Felmérés létrehozása folyamatban...",
				duration: 5000,
				action: <div>{percent(num)}%</div>,
			});
		};
		setProgress({ percent: 1 });
		updateToast(1);
		const res = await fetch("https://pen.dataupload.xyz/felmeresek/", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ ...felmeres, created_at: new Date().toISOString().split("T")[0] }),
		});
		setProgress({ percent: percent(120) });
		updateToast(120);
		if (res.ok) {
			const felmeresResponseData: BaseFelmeresData = await res.json();
			await fetch("https://pen.dataupload.xyz/felmeres_items/", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(submitItems.map((item) => ({ ...item, adatlap: felmeresResponseData.id }))),
			});
			setProgress({ percent: percent(214) });
			updateToast(214);
			let status = 1;
			data.filter((question) => question.value).map(async (question) => {
				const resQuestions = await fetch("https://pen.dataupload.xyz/felmeres_questions/", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						...question,
						adatlap: felmeresResponseData.id,
						value: Array.isArray(question.value) ? JSON.stringify(question.value) : question.value,
					}),
				});
				if (!resQuestions.ok) {
					status = 0;
				}
			});
			if (status === 1) {
				const template = templates.find((template) => template.id === felmeres.template);
				await assembleOfferXML(
					"Elfogadásra vár",
					39636,
					adatlapok.find((adatlap) => adatlap.Id === felmeres.adatlap_id)
						? adatlapok.find((adatlap) => adatlap.Id === felmeres.adatlap_id)!.ContactId.toString()
						: "",
					submitItems,
					felmeres.adatlap_id.toString(),
					template?.description,
					template?.name
				);
				setProgress({ percent: percent(1762) });
				updateToast(1762);
				await fetch(`/api/minicrm-proxy/${felmeres.adatlap_id}?endpoint=Project`, {
					method: "PUT",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						FelmeresAdatok: "https://app.peneszmentesites.hu/felmeresek/" + felmeres.adatlap_id,
						StatusId: "Elszámolásra vár",
					}),
				});
				setProgress({ percent: percent(2271) });
				updateToast(2271);
				const todo_criteria = (todo: ToDo) => {
					return todo["Type"] === 225 && todo["Status"] === "Open";
				};

				const todo = await list_to_dos(felmeres.adatlap_id.toString(), todo_criteria);
				if (todo.length) {
					await fetchMiniCRM("ToDo", todo[0].Id.toString(), "PUT", { Status: "Closed" });
				}
				setProgress({ percent: percent(2591) });
				updateToast(2591);

				await fetch("/api/revalidate?tag=felmeresek");
				setProgress({ percent: percent(2992) });
				updateToast(2992);
				await fetch("/api/revalidate?tag=" + encodeURIComponent(felmeres.adatlap_id.toString()));

				setProgress({ percent: percent(3157) });
				updateToast(3157);
				router.push("/felmeresek");
			}
		}
	};

	const isDisabled = [
		!felmeres.adatlap_id || !felmeres.type || !felmeres.template,
		!items
			.map((item) => item.inputValues.map((value) => value.ammount).every((value) => value > 0))
			.every((value) => value === true) ||
			!items.length ||
			!items
				.map((item) =>
					item.place ? item.inputValues.map((value) => value.value).every((value) => value !== "") : true
				)
				.every((value) => value === true),
		...Array.from(new Set(data.map((field) => field.section))).map(
			(sect) =>
				!data
					.filter((field) =>
						questions
							.filter((question) => question.mandatory)
							.filter((question) =>
								question.connection === "Termék"
									? products.find((product) => product.id === question.product)?.name === sect
									: sect === "Fix"
							)
							.map((question) => question.id)
							.includes(field.question)
					)
					.every((field) => field.value !== "" && field.section === sect && field.value.length) ||
				!data.length
		),
	];

	const netTotal = items
		.map(({ inputValues, netPrice }) => netPrice * inputValues.reduce((a, b) => a + b.ammount, 0))
		.reduce((a, b) => a + b, 0);
	const otherItemsNetTotal = otherItems
		.map((item) =>
			item.type === "fixed"
				? item.value
				: (netTotal + otherItems.filter((item) => item.type !== "percent").reduce((a, b) => a + b.value, 0)) *
				  (item.value / 100)
		)
		.reduce((a, b) => a + b, 0);
	const submitItems = [
		...items,
		...otherItems.map((item) => ({
			name: item.name,
			place: false,
			placeOptions: [],
			productId: Math.floor(Math.random() * 10000),
			adatlap: felmeres.adatlap_id,
			inputValues: [{ ammount: 1, id: 0, value: "" }],
			netPrice: Math.round(
				item.type === "fixed"
					? item.value
					: (netTotal +
							otherItems.filter((item) => item.type !== "percent").reduce((a, b) => a + b.value, 0)) *
							(item.value / 100)
			),
			sku: null as unknown as string,
		})),
		{
			name: "Kedvezmény",
			place: false,
			placeOptions: [],
			productId: Math.floor(Math.random() * 10000),
			adatlap: felmeres.adatlap_id,
			inputValues: [{ ammount: 1, id: 0, value: "" }],
			netPrice: Math.round(-((netTotal + otherItemsNetTotal) * (discount / 100)) / 1.27),
			sku: null as unknown as string,
		},
	] as FelmeresItems[];
	const onPageChange = (page: number) => {
		if (page === 0) {
			setItems([]);
		}
	};

	return (
		<div className='w-full'>
			<div className='flex flex-row w-full flex-wrap lg:flex-nowrap justify-center mt-2'>
				<div className={`lg:mt-6 lg:px-10 ${page === 1 ? "lg:w-11/12" : page == 0 ? "lg:w-2/3" : "w-3/4"}`}>
					<Card>
						<CardHeader>
							<CardTitle>{section}</CardTitle>
						</CardHeader>
						<CardContent className='lg:p-8 p-0 transform'>
							<PageChooser
								setOtherItems={setOtherItems}
								globalData={data}
								setData={setData}
								page={page}
								adatlapok={adatlapok}
								setSection={setSection}
								felmeres={felmeres}
								items={items}
								setItems={setItems}
								setFelmeres={setFelmeres}
								templates={templates}
								setNumPages={setNumPages}
								products={products}
								productAttributes={productAttributes}
								questions={questions}
								otherItems={otherItems}
								discount={discount}
								setDiscount={setDiscount}
							/>
							<div className='flex flex-row justify-end gap-3 border-t py-4'>
								{page === 0 ? null : (
									<Button
										variant='outline'
										onClick={() => {
											setPage(page - 1);
											onPageChange(page - 1);
										}}>
										Előző
									</Button>
								)}
								{numPages === page + 1 ? (
									<Button
										className='bg-green-500 hover:bg-green-500/90'
										onClick={CreateFelmeres}
										disabled={isDisabled[numPages - 1]}>
										Beküldés
									</Button>
								) : (
									<Button
										onClick={() => {
											setPage(page + 1);
										}}
										disabled={isDisabled[page]}>
										Következő
									</Button>
								)}
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}

function PageChooser({
	page,
	adatlapok,
	setSection,
	templates,
	productAttributes,
	felmeres,
	setFelmeres,
	items,
	setItems,
	setData,
	setNumPages,
	globalData,
	products,
	questions,
	otherItems,
	setOtherItems,
	discount,
	setDiscount,
}: {
	page: number;
	setData: React.Dispatch<React.SetStateAction<FelmeresQuestions[]>>;
	adatlapok: AdatlapData[];
	setSection: React.Dispatch<React.SetStateAction<string>>;
	templates: Template[];
	felmeres: BaseFelmeresData;
	setFelmeres: React.Dispatch<React.SetStateAction<BaseFelmeresData>>;
	items: FelmeresItems[];
	setItems: React.Dispatch<React.SetStateAction<FelmeresItems[]>>;
	setNumPages: React.Dispatch<React.SetStateAction<number>>;
	globalData: FelmeresQuestions[];
	products: Product[];
	productAttributes: ProductAttributes[];
	questions: Question[];
	otherItems: OtherFelmeresItems[];
	setOtherItems: React.Dispatch<React.SetStateAction<OtherFelmeresItems[]>>;
	discount: number;
	setDiscount: React.Dispatch<React.SetStateAction<number>>;
}) {
	interface PageMap {
		component: JSX.Element;
		title: string;
	}

	const pageMap: PageMap[] = [
		{
			component: (
				<Page1 felmeres={felmeres} setFelmeres={setFelmeres} adatlapok={adatlapok} templates={templates} />
			),
			title: "Alapadatok",
		},
		{
			component: (
				<Page2
					products={products}
					felmeres={felmeres}
					items={items}
					setItems={setItems}
					productAttributes={productAttributes}
					otherItems={otherItems}
					setOtherItems={setOtherItems}
					discount={discount}
					setDiscount={setDiscount}
				/>
			),
			title: "Tételek",
		},
		...Array.from(new Set(questions.map((question) => question.product))).map((product) => ({
			component: (
				<QuestionPage
					globalData={globalData}
					product={items.find((item) => item.productId === product)?.name || ""}
					adatlap_id={felmeres.adatlap_id}
					questions={questions.filter((question) => question.product === product)}
					setData={setData}
				/>
			),
			title:
				(items.find((item) => item.productId === product)
					? items.find((item) => item.productId === product)!.name
					: "") || "Fix kérdések",
		})),
	];
	React.useEffect(() => {
		setNumPages(pageMap.length);
	}, [pageMap.length]);

	setSection(pageMap[page].title);
	return pageMap[page].component;
}

export function QuestionTemplate({
	children,
	title,
	type,
	mandatory,
}: {
	children: React.ReactNode;
	title: string;
	type?: string;
	mandatory?: boolean;
}) {
	return (
		<div className='px-4 py-6 flex flex-row sm:gap-4 sm:px-0'>
			<div className='text-base flex flex-row font-medium leading-6 text-gray-900 w-1/3'>
				<div>{title}</div>
				{mandatory ? (
					<Tooltip content='Kötelező'>
						<span className='font-bold text-lg ml-1'>
							<ExclamationCircleIcon className='w-4 h-4' />
						</span>
					</Tooltip>
				) : null}
			</div>
			<div className='flex justify-end w-full items-center'>
				<div
					className={`${["GRID", "CHECKBOX_GRID", "FILE_UPLOAD"].includes(type ?? "") ? "w-full" : "w-1/3"}`}>
					{children}
				</div>
			</div>
		</div>
	);
}

function Page1({
	adatlapok,
	templates,
	felmeres,
	setFelmeres,
}: {
	adatlapok: AdatlapData[];
	templates: Template[];
	felmeres: BaseFelmeresData;
	setFelmeres: React.Dispatch<React.SetStateAction<BaseFelmeresData>>;
}) {
	return (
		<>
			<QuestionTemplate title='Adatlap'>
				<AutoComplete
					options={adatlapok.map((adatlap) => ({
						label: adatlap.Name,
						value: adatlap.Id.toString(),
					}))}
					onChange={(e) => {
						setFelmeres({
							...felmeres,
							adatlap_id: adatlapok.find((adatlap) => adatlap.Id === parseInt(e))
								? adatlapok.find((adatlap) => adatlap.Id === parseInt(e))!.Id
								: 0,
						});
					}}
					value={
						adatlapok.find((adatlap) => adatlap.Id === felmeres.adatlap_id)
							? adatlapok.find((adatlap) => adatlap.Id === felmeres.adatlap_id)!.Name
							: ""
					}
				/>
			</QuestionTemplate>
			{felmeres.adatlap_id ? (
				<QuestionTemplate title='Milyen rendszert tervezel?'>
					<AutoComplete
						options={[
							"Helyi elszívós rendszer",
							"Központi ventillátoros",
							"Passzív rendszer",
							"Hővisszanyerős",
						].map((option) => ({
							label: option,
							value: option,
						}))}
						onChange={(e) => setFelmeres({ ...felmeres, type: e })}
						value={felmeres.type}
					/>
				</QuestionTemplate>
			) : null}
			{felmeres.type ? (
				<QuestionTemplate title='Sablon'>
					<AutoComplete
						options={templates
							.filter((template) => template.type === felmeres.type)
							.map((template) => ({
								label: template.name,
								value: template.id.toString(),
							}))}
						onChange={(e) => {
							setFelmeres({
								...felmeres,
								template: templates.find((template) => template.id === parseInt(e))!
									? templates.find((template) => template.id === parseInt(e))!.id
									: 0,
							});
						}}
						value={templates.find((template) => template.id === felmeres.template)?.name || ""}
					/>
				</QuestionTemplate>
			) : null}
		</>
	);
}

function QuestionPage({
	questions,
	setData,
	adatlap_id,
	product,
	globalData,
}: {
	product: string;
	questions: Question[];
	setData: React.Dispatch<React.SetStateAction<FelmeresQuestions[]>>;
	adatlap_id: number;
	globalData: FelmeresQuestions[];
}) {
	return (
		<>
			{questions.map((question) => (
				<QuestionTemplate
					key={question.id}
					title={question.question}
					type={question.type}
					mandatory={question.mandatory}>
					<FieldCreate
						globalData={globalData}
						product={product}
						adatlap_id={adatlap_id}
						question={question}
						setGlobalData={setData}
					/>
				</QuestionTemplate>
			))}
		</>
	);
}

function FieldCreate({
	question,
	setGlobalData,
	globalData,
	adatlap_id,
	product,
}: {
	question: Question;
	setGlobalData: React.Dispatch<React.SetStateAction<FelmeresQuestions[]>>;
	globalData: FelmeresQuestions[];
	adatlap_id: number;
	product?: string;
}) {
	React.useEffect(() => {
		if (
			!globalData.find(
				(felmeres) =>
					felmeres.question === question.id &&
					(felmeres.section === "Termék" ? felmeres.section === product : true)
			)
		) {
			setGlobalData((prev) => [
				...prev.filter((felmeres) => felmeres.question !== question.id || felmeres.section !== product),
				{
					adatlap_id: adatlap_id,
					id: 0,
					value: "",
					question: question.id,
					section: product ? product : "Fix",
				},
			]);
		}
	}, [adatlap_id, product, question.id, setGlobalData]);

	const isTrue = (felmeres: FelmeresQuestions) => {
		return (
			felmeres.question === question.id && (question.connection === "Fix" ? true : felmeres.section === product)
		);
	};

	const setterSingle = (value: string) => {
		setGlobalData((prev) => prev.map((felmeres) => (isTrue(felmeres) ? { ...felmeres, value: value } : felmeres)));
	};
	const felmeres = globalData.find((felmeres) => isTrue(felmeres));

	const setterMultipleUnordered = (value: string) => {
		setGlobalData((prev) =>
			prev.map((felmeres) =>
				isTrue(felmeres)
					? {
							...felmeres,
							value: felmeres.value.includes(value)
								? ((felmeres.value as unknown as string[]).filter(
										(v) => v !== value
								  ) as unknown as string)
								: ([...(felmeres.value as unknown as string[]), value] as unknown as string),
					  }
					: felmeres
			)
		);
	};

	const setterSingleOrdered = (value: { column: string; row: number }) => {
		setGlobalData((prev) =>
			prev.map((felmeres) => {
				if (isTrue(felmeres)) {
					return {
						...felmeres,
						value: [
							...((felmeres.value as unknown as Array<{
								column: string;
								row: number;
							}>)
								? (
										felmeres.value as unknown as Array<{
											column: string;
											row: number;
										}>
								  ).filter((v) => v.row !== value.row)
								: []),
							value,
						] as unknown as string,
					};
				} else {
					return felmeres;
				}
			})
		);
	};

	const setterMultipleOrdered = (value: { column: string; row: number }) => {
		setGlobalData((prev) =>
			prev.map((felmeres) =>
				isTrue(felmeres)
					? {
							...felmeres,
							value: (felmeres.value
								? !(
										felmeres.value as unknown as Array<{
											column: string;
											row: number;
										}>
								  ).filter((v) => v.column === value.column && v.row === value.row).length
									? [
											...(felmeres.value as unknown as Array<{
												column: string;
												row: number;
											}>),
											value,
									  ]
									: (
											felmeres.value as unknown as Array<{
												column: string;
												row: number;
											}>
									  ).filter((v) => !(v.column === value.column && v.row === value.row))
								: [value]) as unknown as string,
					  }
					: felmeres
			)
		);
	};

	if (question.type === "TEXT") {
		return (
			<Input onChange={(e) => setterSingle(e.target.value)} value={felmeres?.value as string} variant='simple' />
		);
	} else if (question.type === "LIST") {
		return (
			<AutoComplete
				options={(question.options as string[]).map((option) => ({
					label: option,
					value: option,
				}))}
				onChange={setterSingle}
				value={felmeres?.value as string}
			/>
		);
	} else if (["MULTIPLE_CHOICE", "CHECKBOX"].includes(question.type)) {
		return (
			<MultipleChoice
				options={(question.options as string[]).map((option) => option)}
				value={felmeres?.value as string}
				onChange={question.type === "CHECKBOX" ? setterMultipleUnordered : setterSingle}
				radio={question.type === "MULTIPLE_CHOICE"}
			/>
		);
	} else if (question.type === "GRID" || question.type === "CHECKBOX_GRID") {
		return (
			<Grid
				columns={(question.options as GridOptions).columns}
				rows={(question.options as GridOptions).rows}
				value={felmeres?.value as unknown as { column: string; row: number }[]}
				onChange={(value) => {
					if (question.type === "CHECKBOX_GRID") {
						setterMultipleOrdered(value);
					} else {
						setterSingleOrdered(value);
					}
				}}
				radio={question.type === "CHECKBOX_GRID" ? false : true}
				disabled={false}
			/>
		);
	} else if (question.type === "SCALE") {
		return (
			<MultipleChoice
				options={Array.from({ length: (question.options as ScaleOption).max }, (_, i) => (i + 1).toString())}
				value={felmeres?.value as string}
				onChange={setterSingle}
				radio={true}
			/>
		);
	} else if (question.type === "FILE_UPLOAD") {
		return (
			<FileUpload
				route={`/api/save-image`}
				onUpload={(file) =>
					setGlobalData((prev) =>
						prev.map((felmeres) =>
							isTrue(felmeres)
								? {
										adatlap_id: adatlap_id,
										id: 0,
										question: question.id,
										section: felmeres.section,
										value: [
											...(felmeres.value as unknown as string[]),
											"https://felmeres-note-images.s3.eu-central-1.amazonaws.com/" +
												file.filename,
										] as unknown as string,
								  }
								: felmeres
						)
					)
				}
			/>
		);
	}
}
