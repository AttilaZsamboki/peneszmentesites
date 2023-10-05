"use client";
import { Tooltip } from "@material-tailwind/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import React from "react";
import { FelmeresQuestion, ScaleOption } from "../page";
import { AdatlapData } from "./page";
import AutoComplete from "@/app/_components/AutoComplete";
import { Template } from "@/app/templates/page";
import { Product } from "@/app/products/page";
import { Question } from "@/app/questions/page";

import { ExclamationCircleIcon } from "@heroicons/react/20/solid";

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
import Textarea from "../_components/Textarea";
import { Checkmark } from "@/components/check";
import { isJSONParsable } from "../[id]/_clientPage";
import _ from "lodash";
import Gallery from "../_components/Gallery";
import { ToastAction } from "@/components/ui/toast";
import { IterationCw } from "lucide-react";
import { Separator } from "@/components/ui/separator";

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
	created_at: string;
}

export interface FelmeresItem {
	id?: number;
	name: string;
	place: boolean;
	placeOptions: string[];
	product: number;
	inputValues: { value: string; id: number; ammount: number }[];
	netPrice: number;
	adatlap: number;
	sku: string;
	attributeId: number;
	type: "Item" | "Fee" | "Discount";
	valueType: "percent" | "fixed";
}

export const hufFormatter = new Intl.NumberFormat("hu-HU", {
	style: "currency",
	currency: "HUF",
});

export const numberFormatter = new Intl.NumberFormat("hu-HU", {
	style: "decimal",
});

export interface OtherFelmeresItem {
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
	editFelmeres,
	editFelmeresItems,
	editData,
	startPage,
	isEdit,
}: {
	adatlapok: AdatlapData[];
	templates: Template[];
	products: Product[];
	productAttributes: ProductAttributes[];
	editFelmeres?: BaseFelmeresData;
	editFelmeresItems?: FelmeresItem[];
	editData?: FelmeresQuestion[];
	startPage?: number;
	isEdit?: boolean;
}) {
	const { setProgress } = useGlobalState();
	const searchParams = useSearchParams();
	const [page, setPage] = React.useState(startPage ? startPage : 0);
	const [section, setSection] = React.useState("Alapadatok");
	const [felmeres, setFelmeres] = React.useState<BaseFelmeresData>(
		editFelmeres
			? editFelmeres
			: {
					id: 0,
					adatlap_id: searchParams.get("adatlap_id") ? parseInt(searchParams.get("adatlap_id")!) : 0,
					type: "",
					template: 0,
					status: "DRAFT",
					created_at: "",
			  }
	);
	const [items, setItems] = React.useState<FelmeresItem[]>(
		editFelmeresItems ? editFelmeresItems.filter((item) => item.type === "Item") : []
	);
	const [numPages, setNumPages] = React.useState(0);
	const router = useRouter();
	const [data, setData] = React.useState<FelmeresQuestion[]>(
		editData
			? editData.map((field) => ({
					...field,
					value: isJSONParsable(field.value) ? JSON.parse(field.value) : field.value,
			  }))
			: []
	);
	const [questions, setQuestions] = React.useState<Question[]>([]);
	const [otherItems, setOtherItems] = React.useState<OtherFelmeresItem[]>(
		editFelmeresItems
			? editFelmeresItems
					.filter((item) => item.type === "Fee")
					.map((item) => ({
						id: item.id ? item.id : 0,
						name: item.name,
						type: item.valueType ? item.valueType : "fixed",
						value: item.netPrice,
					}))
			: [
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
			  ]
	);
	const [discount, setDiscount] = React.useState(
		editFelmeresItems
			? editFelmeresItems.find((item) => item.type === "Discount")
				? editFelmeresItems.find((item) => item.type === "Discount")!.netPrice
				: 0
			: 0
	);
	const { toast } = useToast();

	React.useEffect(() => {
		const fetchQuestions = async () => {
			setQuestions((prev) => prev.filter((question) => items.map((item) => item.product).includes(question.id)));
			if (!data.length) {
				setData((prev) => prev.filter((field) => items.map((item) => item.product).includes(field.question)));
			}
			items.map(async (item) => {
				const res = await fetch("https://pen.dataupload.xyz/question_products?product=" + item.product);
				if (res.ok) {
					const questionProducts: { question: number; product: number }[] = await res.json();
					questionProducts.map(async (questionProduct) => {
						const data = await fetch("https://pen.dataupload.xyz/questions/" + questionProduct.question);
						if (data.ok) {
							const question: Question = await data.json();
							setQuestions((prev) => [
								...prev.filter(
									(question) =>
										question.id !== questionProduct.question || question.product !== item.product
								),
								{ ...question, product: item.product },
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
		const start = performance.now();
		const percent = (num: number) => Math.floor((num / 3400) * 100);
		const updateStatus = (num: number) => {
			toast({
				title: "Felmérés létrehozása",
				description:
					percent(num) === 100 ? "Felmérés sikeresen létrehozva!" : "Felmérés létrehozása folyamatban...",
				duration: 5000,
				action: percent(num) === 100 ? <Checkmark width={50} height={50} /> : <div>{percent(num)}%</div>,
			});
			setProgress({ percent: percent(num) });
		};
		updateStatus(1);

		// Felmérés alapadatok mentése
		let date = new Date();
		date.setHours(date.getHours() + 4);
		let formattedDate =
			date.getFullYear() +
			"-" +
			("0" + (date.getMonth() + 1)).slice(-2) +
			"-" +
			("0" + date.getDate()).slice(-2) +
			" " +
			("0" + date.getHours()).slice(-2) +
			":" +
			("0" + date.getMinutes()).slice(-2) +
			":" +
			("0" + date.getSeconds()).slice(-2);
		const res = await fetch("https://pen.dataupload.xyz/felmeresek/", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ ...felmeres, created_at: formattedDate }),
		});
		updateStatus(57);
		const createFelmeres = performance.now();
		console.log("Felmérés alapadatok mentése: " + (createFelmeres - start) + "ms");

		if (res.ok) {
			// Tételek mentése
			const felmeresResponseData: BaseFelmeresData = await res.json();
			await fetch("https://pen.dataupload.xyz/felmeres_items/", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(
					submitItems.map((item) => ({
						...item,
						create_name: item.product ? null : item.name,
						adatlap: felmeresResponseData.id,
						netPrice: item.netPrice,
					}))
				),
			});
			updateStatus(196);
			const saveOfferItems = performance.now();
			console.log("Tételek mentése: " + (saveOfferItems - start) + "ms");

			// Kérdések mentése
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
			updateStatus(203);
			const createQuestions = performance.now();
			console.log("Kérdések létrehozása: " + (createQuestions - start) + "ms");

			// MiniCRM ajánlat létrehozása
			if (
				status === 1 &&
				(isEdit
					? !_.isEqual(
							editFelmeresItems?.map((item) => ({
								...item,
								id: 0,
								inputValues: item.inputValues.map((value) => value.ammount),
								sku: item.sku ? item.sku : null,
								adatlap: null,
							})),
							submitItems.map((item) => ({
								...item,
								id: 0,
								inputValues: item.inputValues.map((value) => value.ammount),
								sku: item.sku ? item.sku : null,
								adatlap: null,
							}))
					  )
					: true)
			) {
				// XML string összeállítása
				const template = templates.find((template) => template.id === felmeres.template);
				await assembleOfferXML(
					"Elfogadásra vár",
					39636,
					adatlapok.find((adatlap) => adatlap.Id === felmeres.adatlap_id)
						? adatlapok.find((adatlap) => adatlap.Id === felmeres.adatlap_id)!.ContactId.toString()
						: "",
					submitItems.map((item) => ({
						...item,
						netPrice:
							item.valueType === "percent"
								? item.type === "Fee"
									? submitItems
											.map((sumItem) =>
												sumItem.type === "Item" ||
												(item.type === "Fee" && sumItem.name !== item.name)
													? sumItem.netPrice *
													  sumItem.inputValues
															.map((value) => value.ammount)
															.reduce((a, b) => a + b, 0)
													: 0
											)
											.reduce((a, b) => a + b, 0) *
									  (item.netPrice / 100)
									: item.type === "Discount"
									? -((otherItemsNetTotal + netTotal) * (item.netPrice / 100))
									: item.netPrice
								: item.netPrice,
					})),

					felmeres.adatlap_id.toString(),
					template?.description,
					template?.name,
					felmeresResponseData.id
				);
				updateStatus(2035);
				const createXmlString = performance.now();
				console.log("Ajánlat létrehozása: " + (createXmlString - start) + "ms");

				// MiniCRM ajánlat létrehozása
				await fetch(`/api/minicrm-proxy/${felmeres.adatlap_id}?endpoint=Project`, {
					method: "PUT",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						FelmeresAdatok: "https://app.peneszmentesites.hu/" + felmeresResponseData.id,
						StatusId: "Elszámolásra vár",
					}),
				});
				updateStatus(2961);
				const createOffer = performance.now();
				console.log("Ajánlat létrehozása: " + (createOffer - start) + "ms");
				const todo_criteria = (todo: ToDo) => {
					return todo["Type"] === 225 && todo["Status"] === "Open";
				};

				if (isEdit) {
					// Régi ajánlat stornózása
					const cancelOffer = async () => {
						const resp = await fetch("https://pen.dataupload.xyz/cancel_offer/", {
							method: "POST",
							headers: {
								"Content-Type": "application/json",
							},
							body: JSON.stringify({
								// adatlap_id: felmeresResponseData.id,
								adatlap_id: felmeres.id.toString(),
							}),
						});
						if (!resp.ok) {
							toast({
								title: "Hiba",
								description: "Hiba akadt a régi adatlap sztornózása közben: " + resp.statusText,
								variant: "destructive",
								action: (
									<ToastAction
										altText='Try again'
										onClick={async () => {
											const retryResp = await cancelOffer();
											if (retryResp === "Error") {
												return;
											}
											updateStatus(3400);
											router.push("/");
										}}>
										<IterationCw className='w-5 h-5' />
									</ToastAction>
								),
							});
							return "Error";
						}
					};
					const resp = await cancelOffer();
					if (resp === "Error") {
						return;
					}
					updateStatus(3400);
					router.push("/");
				} else {
					const todo = await list_to_dos(felmeres.adatlap_id.toString(), todo_criteria);
					if (todo.length) {
						await fetchMiniCRM("ToDo", todo[0].Id.toString(), "PUT", { Status: "Closed" });
					}
					const closeTodo = performance.now();
					console.log("ToDo lezárása: " + (closeTodo - start) + "ms");
					updateStatus(3400);
					router.push("/");
				}
			}
			updateStatus(3400);
			router.push("/");
		}
	};

	const isDisabled = {
		Alapadatok: !felmeres.adatlap_id || !felmeres.type || !felmeres.template,
		Tételek:
			!items
				.map((item) => item.inputValues.map((value) => value.ammount).every((value) => value > 0))
				.every((value) => value === true) ||
			!items.length ||
			!items
				.map((item) =>
					item.place ? item.inputValues.map((value) => value.value).every((value) => value !== "") : true
				)
				.every((value) => value === true),
		...Object.assign(
			{},
			...Array.from(new Set(data.map((field) => field.section))).map((sect) => ({
				[sect]: !data
					.filter((field) =>
						questions
							.filter((question) => question.mandatory)
							.filter((question) =>
								question.connection === "Termék"
									? products.find((product) => product.id === question.product)?.sku +
											" - " +
											products.find((product) => product.id === question.product)?.name ===
									  sect
									: sect === "Fix"
							)
							.map((question) => question.id)
							.includes(field.question)
					)
					.every((field) => {
						return field.value.toString() !== "" && field.section === sect && field.value.toString().length;
					}),
			}))
		),
	};

	const submitItems = [
		...items,
		...otherItems.map((item) => ({
			name: item.name,
			place: false,
			placeOptions: [],
			product: null,
			adatlap: felmeres.adatlap_id,
			inputValues: [{ ammount: 1, id: 0, value: "" }],
			netPrice: item.value,
			sku: null as unknown as string,
			type: "Fee",
			valueType: item.type,
		})),
		{
			name: "Kedvezmény",
			place: false,
			placeOptions: [],
			product: null,
			adatlap: felmeres.adatlap_id,
			inputValues: [{ ammount: 1, id: 0, value: "" }],
			netPrice: discount,
			sku: null as unknown as string,
			type: "Discount",
			valueType: "percent",
		},
	] as FelmeresItem[];
	const onPageChange = (page: number) => {
		if (page === 0) {
			setItems([]);
		}
	};
	const netTotal = items
		.map(({ inputValues, netPrice }) => netPrice * inputValues.reduce((a, b) => a + b.ammount, 0))
		.reduce((a, b) => a + b, 0);
	const otherItemsNetTotal = otherItems
		.filter((item) => !isNaN(item.value))
		.map((item) =>
			item.type === "fixed"
				? item.value
				: (netTotal +
						otherItems
							.filter((item) => item.type !== "percent" && !isNaN(item.value))
							.reduce((a, b) => a + b.value, 0)) *
				  (item.value / 100)
		)
		.reduce((a, b) => a + b, 0);

	return (
		<div className='w-full overflow-y-scroll h-[100dvh] pb-0 mb-0 lg:pb-10 lg:mb-10'>
			<div className='flex flex-row w-full flex-wrap lg:flex-nowrap justify-center mt-0 lg:mt-2'>
				<div
					className={`lg:mt-6 lg:px-10 px-0 w-full ${
						page === 1 ? "lg:w-11/12" : page == 0 ? "lg:w-1/4" : "lg:w-2/3"
					}`}>
					<Card className='lg:rounded-md rounded-none lg:border border-0'>
						<CardHeader>
							<CardTitle>{section}</CardTitle>
						</CardHeader>
						<CardContent className={`${page !== 1 ? "p-8" : null} transform`}>
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
							<div className='flex flex-row justify-end gap-3 py-4'>
								{page === 0 || startPage === page ? null : (
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
										disabled={isDisabled[section === "Fix kérdések" ? "Fix" : section]}>
										Beküldés
									</Button>
								) : (
									<Button
										onClick={() => {
											setPage(page + 1);
										}}
										disabled={isDisabled[section === "Fix kérdések" ? "Fix" : section]}>
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
	setData: React.Dispatch<React.SetStateAction<FelmeresQuestion[]>>;
	adatlapok: AdatlapData[];
	setSection: React.Dispatch<React.SetStateAction<string>>;
	templates: Template[];
	felmeres: BaseFelmeresData;
	setFelmeres: React.Dispatch<React.SetStateAction<BaseFelmeresData>>;
	items: FelmeresItem[];
	setItems: React.Dispatch<React.SetStateAction<FelmeresItem[]>>;
	setNumPages: React.Dispatch<React.SetStateAction<number>>;
	globalData: FelmeresQuestion[];
	products: Product[];
	productAttributes: ProductAttributes[];
	questions: Question[];
	otherItems: OtherFelmeresItem[];
	setOtherItems: React.Dispatch<React.SetStateAction<OtherFelmeresItem[]>>;
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
		...Array.from(new Set(questions.map((question) => question.product))).map((product) => {
			const sectionName = items.find((item) => item.product === product)
				? items.find((item) => item.product === product)!.sku +
				  " - " +
				  items.find((item) => item.product === product)!.name
				: "";
			return {
				component: (
					<QuestionPage
						globalData={globalData}
						product={sectionName || ""}
						adatlap_id={felmeres.adatlap_id}
						questions={questions.filter((question) => question.product === product)}
						setData={setData}
					/>
				),
				title: sectionName || "Fix kérdések",
			};
		}),
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
	mandatory,
	description,
}: {
	children: React.ReactNode;
	title: string;
	mandatory?: boolean;
	description?: string;
}) {
	return (
		<div className='space-y-2'>
			<div className='text-base flex flex-row font-medium leading-6 text-gray-900'>
				<label className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'>
					{title}
				</label>
				{mandatory ? (
					<Tooltip content='Kötelező'>
						<span className='font-bold text-lg ml-1'>
							<ExclamationCircleIcon className='w-4 h-4' />
						</span>
					</Tooltip>
				) : null}
			</div>

			<div className='flex justify-end w-full items-center'>
				<div className={`w-full`}>{children}</div>
			</div>
			<p id=':r2o:-form-item-description' className='text-[0.8rem] text-muted-foreground'>
				{description}
			</p>
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
		<div className='flex flex-col items-center gap-5'>
			<QuestionTemplate title='Adatlap'>
				<AutoComplete
					inputClassName='flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50'
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
						inputClassName='flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50'
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
						inputClassName='flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50'
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
		</div>
	);
}

export function QuestionPage({
	questions,
	setData,
	adatlap_id,
	product,
	globalData,
}: {
	product: string;
	questions: Question[];
	setData: React.Dispatch<React.SetStateAction<FelmeresQuestion[]>>;
	adatlap_id: number;
	globalData: FelmeresQuestion[];
}) {
	return (
		<div className='flex flex-col gap-10'>
			{questions.map((question, index) => (
				<>
					{index === 0 ? <Separator /> : null}
					<QuestionTemplate
						key={question.id}
						title={question.question}
						description={question.description}
						mandatory={question.mandatory}>
						<FieldCreate
							globalData={globalData}
							product={product}
							adatlap_id={adatlap_id}
							question={question}
							setGlobalData={setData}
						/>
					</QuestionTemplate>
					{index === questions.length - 1 ? null : <Separator />}
				</>
			))}
		</div>
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
	setGlobalData: React.Dispatch<React.SetStateAction<FelmeresQuestion[]>>;
	globalData: FelmeresQuestion[];
	adatlap_id: number;
	product?: string;
}) {
	React.useEffect(() => {
		if (!globalData.find((felmeres) => isTrue(felmeres))) {
			console.log(product);
			setGlobalData((prev) => [
				...prev.filter((felmeres) => !isTrue(felmeres)),
				{
					adatlap_id: adatlap_id,
					id: 0,
					value: "",
					question: question.id,
					section: question.connection === "Fix" ? "Fix" : product || "",
				},
			]);
		}
	}, [adatlap_id, product, question.id, setGlobalData]);

	const isTrue = (felmeres: FelmeresQuestion) => {
		return (
			felmeres.question === question.id &&
			(question.connection === "Fix" ? true : felmeres.section === product && product !== "")
		);
	};

	const setterSingle = (value: string) => {
		console.log(value);
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
		return <Textarea onChange={(e) => setterSingle(e)} value={felmeres?.value as string} />;
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
	} else if (["MULTIPLE_CHOICE", "CHECKBOX", "SCALE"].includes(question.type)) {
		return (
			<MultipleChoice
				options={
					question.type === "SCALE"
						? Array.from({ length: (question.options as ScaleOption).max }, (_, i) => (i + 1).toString())
						: (question.options as string[]).map((option) => option)
				}
				value={felmeres?.value.toString() as string}
				onChange={question.type === "CHECKBOX" ? setterMultipleUnordered : setterSingle}
				radio={question.type === "MULTIPLE_CHOICE" || question.type === "SCALE"}
				orientation={question.type === "SCALE" ? "row" : "column"}
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
	} else if (question.type === "FILE_UPLOAD") {
		return (
			<div className='flex flex-col gap-2'>
				{globalData.find((felmeres) => isTrue(felmeres))?.value ? (
					<Gallery
						media={globalData.find((felmeres) => isTrue(felmeres))?.value as unknown as string[]}
						edit={true}
						onDelete={(index) => {
							setGlobalData((prev) =>
								prev.map((felmeres) =>
									isTrue(felmeres)
										? {
												...felmeres,
												value: (felmeres.value as unknown as string[]).filter(
													(_, i) => i !== index
												) as unknown as string,
										  }
										: felmeres
								)
							);
						}}
					/>
				) : null}
				<FileUpload
					route={`/api/save-image`}
					onUpload={(file) =>
						setGlobalData((prev) =>
							prev.map((felmeres) =>
								isTrue(felmeres)
									? {
											...felmeres,
											adatlap_id: adatlap_id,
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
			</div>
		);
	}
}
