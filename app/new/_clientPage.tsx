"use client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import React from "react";
import { FelmeresQuestion } from "../page";
import { AdatlapData } from "./page";
import AutoComplete from "@/app/_components/AutoComplete";
import { Template } from "@/app/templates/page";
import { Product } from "@/app/products/page";
import { Question } from "@/app/questions/page";

import { ExclamationCircleIcon } from "@heroicons/react/20/solid";

import { useRouter } from "next/navigation";
import { ProductAttributes } from "@/app/products/_clientPage";
import { ToDo, assembleOfferXML, fetchMiniCRM, list_to_dos } from "@/app/_utils/MiniCRM";
import { AdatlapDetails } from "../_utils/types";
import { useSearchParams } from "next/navigation";
import { useGlobalState } from "@/app/_clientLayout";

import { Page2 } from "./Page2";
import { useToast } from "@/components/ui/use-toast";
import { Checkmark } from "@/components/check";
import { FelmeresPictures, FelmeresPicturesComponent, PageMap, SectionName, isJSONParsable } from "../[id]/_clientPage";
import _ from "lodash";
import { ToastAction } from "@/components/ui/toast";
import { CornerUpLeft, IterationCw, MenuSquare } from "lucide-react";
import { QuestionPage } from "../../components/QuestionPage";
import { TooltipTrigger, Tooltip, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";
import Link from "next/link";
import { FelmeresStatus, statusMap, useCreateQueryString } from "../_utils/utils";
import { calculatePercentageValue, cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DialogFooter, DialogHeader } from "@material-tailwind/react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";

export interface ProductTemplate {
	product: number;
	template: number;
}

export interface BaseFelmeresData {
	id: number;
	adatlap_id: number;
	type: string;
	template: number;
	status: FelmeresStatus;
	created_at: string;
	description: string;
	offer_status?: "Elfogadott ajánlat" | "Sikeres megrendelés" | null;
	subject: string;
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
	type: "Item" | "Fee" | "Discount" | "Other Material";
	valueType: "percent" | "fixed";
	source: "Manual" | "Template";
	category: string;
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
	editPictures,
}: {
	adatlapok: AdatlapData[];
	templates: Template[];
	products: Product[];
	productAttributes: ProductAttributes[];
	editFelmeres?: BaseFelmeresData;
	editFelmeresItems?: FelmeresItem[];
	editData?: FelmeresQuestion[];
	startPage?: SectionName;
	isEdit?: boolean;
	editPictures?: FelmeresPictures[];
}) {
	const { setProgress } = useGlobalState();
	const searchParams = useSearchParams();
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
					description: "",
					subject: "",
			  }
	);
	const [items, setItems] = React.useState<FelmeresItem[]>(
		editFelmeresItems
			? editFelmeresItems.filter((item) => item.type === "Item" || item.type === "Other Material")
			: []
	);
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
						name: "Jóváírás (helyszíni felmérés díj)",
						value: -20000,
						type: "fixed",
						id: 3,
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
	const [pictures, setPictures] = React.useState<FelmeresPictures[]>(editPictures ?? []);
	const [openPageDialog, setOpenPageDialog] = React.useState(false);

	const createType = (
		sendOffer?: boolean
	): {
		CREATE_OFFER: boolean;
		FELMERES: "UPDATE" | "CREATE" | null;
		CANCEL_OLD_OFFER: boolean;
	} => {
		return {
			CREATE_OFFER: sendOffer ?? false,
			FELMERES: isEdit ? "UPDATE" : "CREATE",
			CANCEL_OLD_OFFER: (sendOffer && felmeres.status !== "DRAFT") ?? false,
		};
	};

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
					const data = await Promise.all(
						questionProducts.map(async (questionProduct) => {
							const data = await fetch(
								"https://pen.dataupload.xyz/questions/" + questionProduct.question
							);
							if (data.ok) {
								const question: Question = await data.json();
								setQuestions((prev) => [
									...prev.filter(
										(question) =>
											question.id !== questionProduct.question ||
											question.product !== item.product
									),
									{
										...question,
										product: item.product,
										is_created: true,
									},
								]);
								return question.created_from;
							}
						})
					);
					if (!data.includes("Form")) {
						setQuestions((prev) => [
							...prev,
							{
								id: Math.random() * 100000000000000000,
								question: "Leírás",
								type: "TEXT",
								options: [],
								connection: "Termék",
								product: item.product,
								mandatory: false,
								description: "",
								created_from: "Form",
								is_created: false,
							},
						]);
					}
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
	React.useEffect(() => {
		if (felmeres.adatlap_id && !editFelmeresItems) {
			const fetchAdatlapData = async () => {
				const data: AdatlapDetails = await fetchMiniCRM("Project", felmeres.adatlap_id.toString(), "GET");
				setOtherItems((prev) => [
					...prev.filter((item) => item.id !== 2),
					{
						name: "Kiszállási díj",
						value: data.FelmeresiDij,
						type: "fixed",
						id: 2,
					},
				]);
			};
			fetchAdatlapData();
		}
	}, [felmeres.adatlap_id]);
	const template = templates.find((template) => template.id === felmeres.template);

	const CreateFelmeres = async (sendOffer: boolean = true) => {
		const createType2 = createType(sendOffer);
		const start = performance.now();
		const percent = (num: number) => Math.floor((num / 3400) * 100);
		const updateStatus = (num: number, id?: number) => {
			toast({
				title: percent(num) === 100 ? "Felmérés létrehozva" : "Felmérés létrehozása",
				description:
					percent(num) === 100 ? (
						createType2.FELMERES === "UPDATE" ? (
							<div>Felmérés módosítva</div>
						) : (
							<Link
								href={"/" + id}
								className='flex flex-row gap-2 items-center justify-start cursor-pointer pt-2'>
								<CornerUpLeft className='w-4 h-4 text-gray-800' />
								<div className='font-bold text-xs text-gray-700'>Megnyitás</div>
							</Link>
						)
					) : (
						"Felmérés létrehozása folyamatban..."
					),
				duration: 5000,
				action: percent(num) === 100 ? <Checkmark width={50} height={50} /> : <div>{percent(num)}%</div>,
			});
			setProgress({ percent: percent(num) });
		};
		updateStatus(1);

		// Felmérés alapadatok mentése //
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
		const fetchFelmeres = async () => {
			if (createType2.FELMERES === "UPDATE") {
				const resp = await fetch("https://pen.dataupload.xyz/felmeresek/" + editFelmeres!.id + "/", {
					method: "PUT",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						...felmeres,
						status: createType2.CREATE_OFFER ? "IN_PROGRESS" : felmeres.status,
					}),
				});
				await fetch("/api/revalidate?tag=" + editFelmeres!.id);
				return resp;
			} else {
				const resp = await fetch("https://pen.dataupload.xyz/felmeresek/", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						...felmeres,
						created_at: formattedDate,
						status: sendOffer ? "IN_PROGRESS" : felmeres.status,
					}),
				});
				if (resp.ok) {
					await fetch("/api/revalidate?tag=felmeresek");
					return resp;
				}
			}
		};
		const res = await fetchFelmeres();
		updateStatus(57);
		const createFelmeres = performance.now();
		console.log("Felmérés alapadatok mentése: " + (createFelmeres - start) + "ms");
		// -- END -- //

		// Ha sikeresen ell lettek mentve a felmérés alapadatai
		if (!res || res.ok) {
			// Tételek mentése //
			const felmeresResponseData: BaseFelmeresData = !res ? editFelmeres : await res.json();
			await fetch("https://pen.dataupload.xyz/felmeres_items/", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(
					submitItems.map((item) => ({
						...item,
						adatlap: felmeresResponseData.id,
						netPrice: item.netPrice,
						// ez annyit jelent hogy ha null az id akkor létrehozza az adatbázisban egyébként frissíti a meglévő tételeket
						id: createType2.FELMERES === "UPDATE" ? item.id : null,
					}))
				),
			});
			updateStatus(196);
			const saveOfferItems = performance.now();
			console.log("Tételek mentése: " + (saveOfferItems - start) + "ms");
			// -- END -- //

			// Kérdések mentése //
			let status = 1;
			data.filter((question) => question.value).map(async (question) => {
				const originaQuestion = questions.find((q) => q.id === question.question);
				let question_id = question.question;
				if (originaQuestion?.created_from === "Form" && !originaQuestion.is_created) {
					const resp = await fetch("https://pen.dataupload.xyz/questions/", {
						method: "POST",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify({ ...originaQuestion, id: null }),
					});
					if (resp.ok) {
						question_id = (await resp.json()).id;
						await fetch("https://pen.dataupload.xyz/question_products/", {
							method: "POST",
							headers: {
								"Content-Type": "application/json",
							},
							body: JSON.stringify({
								question_id: question_id,
								product_id: originaQuestion.product,
							}),
						});
					}
				}
				const resQuestions = await fetch(
					"https://pen.dataupload.xyz/felmeres_questions/" + (question.id ? question.id + "/" : ""),
					{
						method: question.id ? "PUT" : "POST",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify({
							...question,
							adatlap: felmeresResponseData.id,
							value: Array.isArray(question.value) ? JSON.stringify(question.value) : question.value,
							question: question_id,
						}),
					}
				);
				if (!resQuestions.ok) {
					status = 0;
				}
			});
			updateStatus(203);
			const createQuestions = performance.now();
			console.log("Kérdések létrehozása: " + (createQuestions - start) + "ms");
			// -- END -- //

			// Képek mentése //
			pictures
				.filter((pic) => !pic.id)
				.map(
					async (pic) =>
						await fetch("https://pen.dataupload.xyz/felmeres-pictures/", {
							method: "POST",
							headers: {
								"Content-Type": "application/json",
							},
							body: JSON.stringify({ ...pic, felmeres: felmeresResponseData.id }),
						})
				);
			// -- END -- //

			// MiniCRM ajánlat létrehozása //
			if (createType2.CREATE_OFFER) {
				// XML string összeállítása
				await assembleOfferXML(
					"Elfogadásra vár",
					39636,
					adatlapok.find((adatlap) => adatlap.Id === felmeres.adatlap_id)
						? adatlapok.find((adatlap) => adatlap.Id === felmeres.adatlap_id)!.ContactId.toString()
						: "",
					items
						.filter((item) => item.type === "Other Material")
						.map((item) => item.netPrice)
						.reduce((a, b) => a + b, 0) > 0
						? [
								...submitItems
									.filter((item) => item.type !== "Other Material" && item.netPrice)
									.map((item) => ({
										...item,
										netPrice:
											item.valueType === "percent"
												? item.type === "Fee"
													? calculatePercentageValue(netTotal, otherItems, item.netPrice)
													: item.type === "Discount"
													? -((otherItemsNetTotal + netTotal) * (item.netPrice / 100))
													: item.netPrice
												: item.netPrice,
									})),
								{
									netPrice: items
										.filter((item) => item.type === "Other Material")
										.map(
											(item) =>
												item.netPrice * item.inputValues.reduce((a, b) => a + b.ammount, 0)
										)
										.reduce((a, b) => a + b, 0),
									name: "Egyéb szerelési segédanyagok",
									inputValues: [{ ammount: 1, id: 0, value: "" }],
								} as unknown as FelmeresItem,
						  ]
						: submitItems
								.filter((item) => item.type !== "Other Material" && item.netPrice)
								.map((item) => ({
									...item,
									netPrice:
										item.valueType === "percent"
											? item.type === "Fee"
												? calculatePercentageValue(netTotal, otherItems, item.netPrice)
												: item.type === "Discount"
												? -((otherItemsNetTotal + netTotal) * (item.netPrice / 100))
												: item.netPrice
											: item.netPrice,
								})),
					felmeres.adatlap_id.toString(),
					felmeres.subject,
					template?.name,
					felmeresResponseData.id,
					felmeres.description
				);
				updateStatus(2035);
				const createXmlString = performance.now();
				console.log("Ajánlat létrehozása: " + (createXmlString - start) + "ms");
				// -- END -- //

				// MiniCRM ajánlat létrehozása //
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
				// -- END -- //

				// Régi ajánlat stornózása
				if (createType2.CANCEL_OLD_OFFER) {
					const cancelOffer = async () => {
						const resp = await fetch("https://pen.dataupload.xyz/cancel_offer/", {
							method: "POST",
							headers: {
								"Content-Type": "application/json",
							},
							body: JSON.stringify({
								adatlap_id: felmeres.id.toString(),
							}),
						});
						if (!resp.ok) {
							toast({
								title: "Hiba",
								description: "Hiba akadt a régi adatlap sztornózása közben: " + resp.statusText,
								variant: "destructive",
								action: (
									<div className='flex flex-col gap-2'>
										<ToastAction
											altText='Try again'
											onClick={async () => {
												const retryResp = await cancelOffer();
												if (retryResp === "Error") {
													return;
												}
												updateStatus(3400);
												await fetch("/api/revalidate?tag=" + felmeres.id);
												router.push("/");
											}}>
											<IterationCw className='w-5 h-5' />
										</ToastAction>
										<ToastAction
											altText='skip'
											onClick={async () => {
												updateStatus(3400);
												await fetch("/api/revalidate?tag=" + felmeres.id);
												router.push("/");
											}}>
											Kihagyás
										</ToastAction>
									</div>
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
					await fetch("/api/revalidate?tag=" + felmeresResponseData.id);
					await fetch("/api/revalidate?path=/");
					router.push("/");
				}

				if (sendOffer) {
					// Felmérés ToDo lezárása
					const todo_criteria = (todo: ToDo) => {
						return todo["Type"] === 225 && todo["Status"] === "Open";
					};
					const todo = await list_to_dos(felmeres.adatlap_id.toString(), todo_criteria);
					if (todo.length) {
						await fetchMiniCRM("ToDo", todo[0].Id.toString(), "PUT", { Status: "Closed" });
					}
					const closeTodo = performance.now();
					console.log("ToDo lezárása: " + (closeTodo - start) + "ms");
					updateStatus(3400);
					await fetch("/api/revalidate?path=/" + felmeresResponseData.id);
					await fetch("/api/revalidate?tag=" + felmeresResponseData.id);
					router.push("/");
					// -- END -- //
				}
			}
			updateStatus(3400, felmeresResponseData.id);
			if (createType2.FELMERES === "UPDATE") {
				await fetch("/api/revalidate?path=/" + felmeresResponseData.id);
				await fetch("/api/revalidate?tag=" + felmeresResponseData.id);
				router.push("/" + felmeresResponseData.id);
			} else {
				await fetch("/api/revalidate?path=/");
				await fetch("/api/revalidate?tag=" + felmeresResponseData.id);
				router.push("/");
			}
		}
	};

	interface Field {
		product: string;
		question: string;
		value: string;
	}

	const submitItems = [
		...items,
		...otherItems.map((item) => ({
			id: editFelmeresItems
				? editFelmeresItems.find((item2) => item2.name === item.name)
					? editFelmeresItems.find((item2) => item2.name === item.name)!.id
					: null
				: null,
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
			id: editFelmeresItems
				? editFelmeresItems.find((item) => item.type === "Discount")
					? editFelmeresItems.find((item) => item.type === "Discount")!.id
					: null
				: null,
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

	const adatlap = adatlapok.find((adatlap) => adatlap.Id === felmeres.adatlap_id);

	const [currentPage, setCurrentPage] = React.useState<SectionName>(isEdit ? "Tételek" : "Alapadatok");
	class PageMapClass {
		sections: PageMap[];

		constructor(excludedPages: SectionName[] = []) {
			this.sections = (
				[
					{
						component: <Page1 felmeres={felmeres} setFelmeres={setFelmeres} adatlapok={adatlapok} />,
						title: "Alapadatok",
						id: "Alapadatok",
					},
					{
						component: (
							<Page2
								products={products}
								felmeres={felmeres}
								items={items}
								setItems={setItems}
								originalTemplates={templates}
								setFelmeres={setFelmeres}
								productAttributes={productAttributes}
								otherItems={otherItems}
								setOtherItems={setOtherItems}
								discount={discount}
								setDiscount={setDiscount}
								isEdit={isEdit}
							/>
						),
						title: "Tételek",
						id: "Tételek",
						description: "Válaszd ki a felméréshez szükséges termékeket és szolgáltatásokat.",
					},
					{
						component: <div></div>,
						id: "Kérdések",
						title: "Kérdések",
						subSections: Array.from(new Set(questions.map((question) => question.product)))
							.sort((a, b) => Number(a === undefined) - Number(b === undefined))
							.map((product) => {
								return {
									component: (
										<QuestionPage
											globalData={data}
											product={product ?? 0}
											adatlap_id={felmeres.adatlap_id}
											questions={questions.filter((question) => question.product === product)}
											setData={setData}
										/>
									),
									title: products.find((p) => p.id === product)?.sku ?? "Fix kérdések",
									id: product ?? ("Fix" as SectionName),
								};
							}),
						description: "Töltsd ki a felméréshez szükséges kérdéseket.",
					},
					{
						component: (
							<FelmeresPicturesComponent
								save={false}
								felmeresId={felmeres.id}
								pictures={pictures}
								setPictures={setPictures}
							/>
						),
						id: "Kép",
						title: "Képek",
						description: "Töltsd fel a felméréshez szükséges képeket.",
					},
				] as PageMap[]
			).filter((section) => !excludedPages.includes(section.id));
		}

		flat(shallow: boolean = false) {
			const data = this.sections.map((section) => [...(section.subSections ?? []), section]).flat();
			return shallow ? data.filter((section) => !section.subSections) : data;
		}

		changePageByIncrement(increment: number) {
			const flatArray = this.flat(true);
			const currentIndex = flatArray.findIndex((page) => page.id === currentPage);
			const newIndex = currentIndex + increment;
			if (newIndex >= 0 && newIndex < flatArray.length) {
				setCurrentPage(flatArray[newIndex].id);
				router.push("?page=" + newIndex);
			}
		}

		nextPage() {
			this.changePageByIncrement(1);
		}

		prevPage() {
			this.changePageByIncrement(-1);
		}

		isLast() {
			return this.getPageNum() === this.flat().length - 1;
		}

		isDisabled(page: SectionName = currentPage) {
			const isProductDisabled = (product: number) => {
				const relatedFields = data.filter((field) => field.product === product);
				const mandatoryQuestions = questions.filter(
					(question) => question.mandatory && question.connection === "Termék"
				);

				return relatedFields.every((field) => {
					const isQuestionMandatory = mandatoryQuestions.some((question) => {
						const productMatch = products.find((product) => product.id === question.product);
						return (productMatch?.id === product || true) && question.id === field.question;
					});

					return isQuestionMandatory ? field.value.toString() !== "" && field.value.toString().length : true;
				});
			};

			const uniqueProducts = Array.from(new Set(data.map((field) => field.product)));
			const productStatuses = uniqueProducts.reduce(
				(acc, product) => ({ ...acc, [product ?? ""]: !isProductDisabled(product ?? 0) }),
				{}
			);

			const isDisabled: { [key: string]: boolean } = {
				Alapadatok: !felmeres.adatlap_id,
				Tételek: false,
				...productStatuses,
			};

			return isDisabled[page];
		}

		getPageDetails(page: SectionName) {
			return this.flat().find((section) => section.id === page);
		}

		getCurrentPageDetails() {
			return this.getPageDetails(currentPage);
		}

		getPageNum(page: SectionName = currentPage) {
			return this.flat().findIndex((page2) => page2.id === page);
		}
	}

	const pageClass = new PageMapClass(isEdit ? ["Alapadatok"] : []);

	React.useEffect(() => {
		if (searchParams.get("page")) {
			setCurrentPage(pageClass.flat(true)[Number(searchParams.get("page") ?? 0)]?.id);
		}
	}, [questions]);

	return (
		<div className='w-full overflow-y-scroll h-[100dvh] pb-0 mb-0 lg:pb-10 lg:mb-10'>
			<div className='flex flex-row w-full flex-wrap lg:flex-nowrap justify-center mt-0 lg:mt-2'>
				<div
					className={`lg:mt-6 lg:px-10 px-0 w-full ${
						currentPage === "Tételek" ? "lg:w-full" : currentPage === "Alapadatok" ? "lg:w-1/4" : "lg:w-2/3"
					}`}>
					<Card className='lg:rounded-md rounded-none lg:border border-0'>
						<div className='sticky top-0 bg-white z-40'>
							<CardHeader className='flex flex-row items-center justify-between p-0 pr-2'>
								<div className='flex flex-col items-start pl-10 py-3'>
									<div className='flex flex-row gap-2 items-center'>
										<CardTitle>{adatlap?.Name ?? ""}</CardTitle>
										<Badge size='xs' color={statusMap[felmeres.status].color as "default"}>
											{statusMap[felmeres.status].name}
										</Badge>
									</div>
									<CardDescription>{pageClass.getCurrentPageDetails()?.title}</CardDescription>
								</div>
								<Dialog
									open={openPageDialog}
									defaultOpen
									onOpenChange={() => setOpenPageDialog((prev) => !prev)}>
									<DialogTrigger>
										<MenuSquare />
									</DialogTrigger>
									<DialogContent className='h-[100dvh] w-full p-0 flex flex-col gap-0'>
										<div>
											<DialogHeader className='flex flex-col items-start'>
												<DialogTitle>{adatlap?.Name ?? ""}</DialogTitle>
												<DialogDescription>
													{pageClass.getCurrentPageDetails()?.title}
												</DialogDescription>
											</DialogHeader>
											<Separator className='mb-4' />
										</div>
										<ul className='grid w-[400px] gap-3 md:w-[500px] md:grid-cols-2 lg:w-[600px] p-6 pt-0'>
											{pageClass.sections.map((section, index) => {
												const listItem = (
													<li className='row-span-3'>
														<div className='block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground'>
															<div className='text-sm font-medium leading-none'>
																{section.title}
															</div>
															<p className='line-clamp-2 text-sm leading-snug text-muted-foreground'>
																{section.description}
															</p>
														</div>
													</li>
												);
												if (section.subSections) {
													return (
														<Accordion
															key={section.id}
															type='single'
															collapsible
															className='w-full flex flex-row justify-start'
															defaultValue='item-1'>
															<AccordionItem className='border-b-0' value='item-1'>
																<AccordionTrigger className='hover:no-underline rounded-md text-left pb-1'>
																	{listItem}
																</AccordionTrigger>
																<AccordionContent className='pb-0'>
																	<div className='flex flex-row w-full px-3 gap-2 pt-2'>
																		<Separator
																			orientation='vertical'
																			className='w-[3px] text-gray-600'
																		/>
																		<div className='flex flex-col gap-2 py-2'>
																			{section.subSections!.map(
																				(section, index2) => (
																					<Link
																						key={section.id}
																						className={cn(
																							currentPage ===
																								section.title &&
																								"bg-gray-100 font-semibold",
																							"rounded-md px-2 py-1 ml-2"
																						)}
																						href={
																							"?page=" + (index + index2)
																						}
																						onClick={() => {
																							setCurrentPage(section.id);
																							setOpenPageDialog(false);
																						}}>
																						{section.title}
																					</Link>
																				)
																			)}
																		</div>
																	</div>
																</AccordionContent>
															</AccordionItem>
														</Accordion>
													);
												}
												return index <
													(pageClass.sections
														.flat()
														.findIndex((page) => page.id === startPage) ?? 0) ? null : (
													<Link
														onClick={() => {
															setOpenPageDialog(false);
															setCurrentPage(section.id);
														}}
														href={"?page=" + pageClass.getPageNum(section.id)}>
														{listItem}
													</Link>
												);
											})}
										</ul>
										<DialogFooter>
											<SubmitOptions />
										</DialogFooter>
									</DialogContent>
								</Dialog>
							</CardHeader>
							<Separator className='mb-4' />
						</div>
						<CardContent className={`${currentPage !== "Tételek" ? "p-8" : "lg:p-6 px-4 pt-0"} transform`}>
							{
								pageClass.sections
									.map((section) =>
										[...(section.subSections ?? []), section].find(
											(section) => section?.id === currentPage
										)
									)
									.filter((section) => section !== undefined)[0]?.component
							}
							<div className='flex flex-row justify-end gap-3 py-4'>
								{pageClass.getPageNum() === 0 ? null : (
									<Button
										variant='outline'
										onClick={() => {
											pageClass.prevPage();
										}}>
										Előző
									</Button>
								)}
								{pageClass.isLast() ? (
									<SubmitOptions />
								) : (
									<Button onClick={() => pageClass.nextPage()} disabled={pageClass.isDisabled()}>
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

	function SubmitOptions() {
		console.log(
			_.isEqual(
				editFelmeresItems
					?.map((item) => ({
						...item,
						id: 0,
						inputValues: item.inputValues.map((value) => value.ammount),
						sku: item.sku ?? "",
						source: "",
						adatlap: "",
					}))
					.sort((a, b) => a.sku.localeCompare(b.sku)),
				submitItems
					.map((item) => ({
						...item,
						id: 0,
						inputValues: item.inputValues.map((value) => value.ammount),
						source: "",
						sku: item.sku ?? "",
						adatlap: "",
					}))
					.sort((a, b) => a.sku.localeCompare(b.sku))
			)
		);
		return (
			<div className='flex flex-row px-4 items-center justify-center gap-3'>
				{!items
					.map((item) => item.inputValues.map((value) => value.ammount).every((value) => value > 0))
					.every((value) => value === true) ||
				!items.length ||
				!felmeres.subject ||
				(_.isEqual(
					editFelmeresItems
						?.map((item) => ({
							...item,
							id: 0,
							inputValues: item.inputValues.map((value) => value.ammount),
							sku: item.sku ?? "",
							source: "",
							adatlap: "",
						}))
						.sort((a, b) => a.sku.localeCompare(b.sku)),
					submitItems
						.map((item) => ({
							...item,
							id: 0,
							inputValues: item.inputValues.map((value) => value.ammount),
							source: "",
							sku: item.sku ?? "",
							adatlap: "",
						}))
						.sort((a, b) => a.sku.localeCompare(b.sku))
				) &&
					felmeres.status !== "DRAFT") ? null : isEdit && felmeres.status !== "DRAFT" ? (
					<AlertDialog>
						<AlertDialogTrigger asChild>
							<Button
								className='bg-green-500 hover:bg-green-500/90'
								color='green'
								disabled={pageClass.isDisabled()}>
								Beküldés
							</Button>
						</AlertDialogTrigger>
						<AlertDialogContent>
							<AlertDialogHeader>
								<AlertDialogTitle>Biztos vagy benne?</AlertDialogTitle>
								<AlertDialogDescription>
									Ez a művelet nem vonható vissza. Ez véglegesen sztornózni fogja az ajánlatot.
								</AlertDialogDescription>
							</AlertDialogHeader>
							<AlertDialogFooter>
								<AlertDialogCancel>Mégsem</AlertDialogCancel>
								<AlertDialogAction
									className='bg-red-800 hover:bg-red-800/90'
									onClick={() => CreateFelmeres()}>
									Folytatás
								</AlertDialogAction>
							</AlertDialogFooter>
						</AlertDialogContent>
					</AlertDialog>
				) : (
					<Button
						className='bg-green-500 hover:bg-green-500/90'
						color='green'
						onClick={() => CreateFelmeres()}
						disabled={pageClass.isDisabled()}>
						Beküldés
					</Button>
				)}
				{!_.isEqual(
					editFelmeresItems?.map((item) => ({
						...item,
						id: 0,
						inputValues: item.inputValues.map((value) => value.ammount),
						sku: item.sku ? item.sku : null,
						source: "",
						adatlap: null,
					})),
					submitItems.map((item) => ({
						...item,
						id: 0,
						inputValues: item.inputValues.map((value) => value.ammount),
						source: "",
						sku: item.sku ? item.sku : null,
						adatlap: null,
					}))
				) && felmeres.status !== "DRAFT" ? null : (
					<TooltipProvider>
						<Tooltip>
							<TooltipTrigger asChild>
								<Button onClick={() => CreateFelmeres(false)} disabled={pageClass.isDisabled()}>
									Mentés
								</Button>
							</TooltipTrigger>
							<TooltipContent>
								<p>Ez az opció nem küldi el az ajánlatot, még lehet változtatni rajta</p>
							</TooltipContent>
						</Tooltip>
					</TooltipProvider>
				)}
			</div>
		);
	}
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
					<TooltipProvider>
						<Tooltip>
							<TooltipTrigger asChild>
								<span className='font-bold text-lg ml-1'>
									<ExclamationCircleIcon className='w-4 h-4' />
								</span>
							</TooltipTrigger>
							<TooltipContent>
								<p>Kötelező</p>
							</TooltipContent>
						</Tooltip>
					</TooltipProvider>
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
	felmeres,
	setFelmeres,
}: {
	adatlapok: AdatlapData[];
	felmeres: BaseFelmeresData;
	setFelmeres: React.Dispatch<React.SetStateAction<BaseFelmeresData>>;
}) {
	const router = useRouter();
	const createQueryString = useCreateQueryString(useSearchParams());
	return (
		<div className='flex flex-col items-center gap-5'>
			<QuestionTemplate title='Adatlap'>
				<AutoComplete
					options={adatlapok
						.sort((a, b) => a.Name.localeCompare(b.Name))
						.map((adatlap) => ({
							label: adatlap.Name,
							value: adatlap.Id.toString(),
						}))}
					onSelect={(e) => {
						setFelmeres({
							...felmeres,
							adatlap_id: adatlapok.find((adatlap) => adatlap.Id === parseInt(e))
								? adatlapok.find((adatlap) => adatlap.Id === parseInt(e))!.Id
								: 0,
						});
						router.push("?" + createQueryString([{ name: "adatlap_id", value: e }]));
					}}
					value={
						adatlapok.find((adatlap) => adatlap.Id === felmeres.adatlap_id)
							? adatlapok.find((adatlap) => adatlap.Id === felmeres.adatlap_id)!.Name
							: ""
					}
				/>
			</QuestionTemplate>
		</div>
	);
}
