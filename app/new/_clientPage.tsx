"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import React, { use } from "react";
import { FelmeresQuestion } from "../page";
import { AdatlapData } from "./page";
import AutoComplete from "@/app/_components/AutoComplete";
import { Template } from "@/app/templates/page";
import { Product } from "@/app/products/page";
import { Question } from "@/app/questions/page";

import { ExclamationCircleIcon } from "@heroicons/react/20/solid";

import { useRouter } from "next/navigation";
import { ProductAttributes } from "@/app/products/_clientPage";
import { AdatlapDetails, ToDo, assembleOfferXML, fetchMiniCRM, list_to_dos } from "@/app/_utils/MiniCRM";
import { useSearchParams } from "next/navigation";
import { useGlobalState } from "@/app/_clientLayout";

import { Page2 } from "./Page2";
import { useToast } from "@/components/ui/use-toast";
import { Checkmark } from "@/components/check";
import { isJSONParsable } from "../[id]/_clientPage";
import _ from "lodash";
import { ToastAction } from "@/components/ui/toast";
import { CornerUpLeft, IterationCw } from "lucide-react";
import { QuestionPage } from "../../components/QuestionPage";
import { TooltipTrigger, Tooltip, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";
import Link from "next/link";
import { FelmeresStatus, useCreateQueryString } from "../_utils/utils";
import { calculatePercentageValue } from "@/lib/utils";
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
	status: FelmeresStatus;
	created_at: string;
	description: string;
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
	const [page, setPage] = React.useState(startPage ? startPage : parseInt(searchParams.get("page") ?? "0"));
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
					description: "",
			  }
	);
	const [items, setItems] = React.useState<FelmeresItem[]>(
		editFelmeresItems
			? editFelmeresItems.filter((item) => item.type === "Item" || item.type === "Other Material")
			: []
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
						name: "Jóváírás",
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
	const { toast } = useToast();
	const createQueryString = useCreateQueryString(searchParams);

	React.useEffect(() => {
		if (page < 2) {
			router.push("?" + createQueryString([{ name: "page", value: page.toString() }]));
		}
	}, [page]);
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

	const CreateFelmeres = async (sendOffer: boolean = true) => {
		const start = performance.now();
		const percent = (num: number) => Math.floor((num / 3400) * 100);
		const updateStatus = (num: number, id?: number) => {
			toast({
				title: percent(num) === 100 ? "Felmérés létrehozva" : "Felmérés létrehozása",
				description:
					percent(num) === 100 ? (
						createType === "DRAFT UPDATE" ? (
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

		let createType:
			| "CREATE"
			| "CREATE NEW OFFER"
			| "CANCEL AND CREATE NEW OFFER"
			| "DRAFT UPDATE"
			| "UPDATE"
			| "DRAFT UPDATE AND CREATE NEW OFFER" = "CREATE";
		// ha a beküldés gombra kattintasz
		if (sendOffer) {
			if (felmeres.status === "DRAFT") {
				// ha nem létezik még ajánlat
				if (isEdit) {
					createType = "DRAFT UPDATE AND CREATE NEW OFFER";
				} else {
					createType = "CREATE NEW OFFER";
				}
			} else {
				createType = "CANCEL AND CREATE NEW OFFER";
			}
			// ha a mentés gombra kattintasz és nem létezik még ajánlat
		} else if (felmeres.status === "DRAFT") {
			// ha létezik már felmérés
			if (isEdit) {
				createType = "DRAFT UPDATE";
			} else {
				// ha nem létezik még felmérés
				createType = "CREATE";
			}
		} else {
			// ha a mentés gombra kattintasz és létezik már ajánlat
			createType = "UPDATE";
		}

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
			if (
				createType === "DRAFT UPDATE" ||
				createType === "UPDATE" ||
				createType === "DRAFT UPDATE AND CREATE NEW OFFER"
			) {
				if (sendOffer) {
					const resp = await fetch("https://pen.dataupload.xyz/felmeresek/" + editFelmeres!.id + "/", {
						method: "PATCH",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify({
							status: "IN_PROGRESS",
						}),
					});
					await fetch("/api/revalidate?tag=" + editFelmeres!.id);
					return resp;
				}
			} else {
				return await fetch("https://pen.dataupload.xyz/felmeresek/", {
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
			if (createType !== "UPDATE") {
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
							id: createType === "DRAFT UPDATE" ? item.id : null,
						}))
					),
				});
			}
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

			// MiniCRM ajánlat létrehozása //
			if (
				// Nem failelt a kérdések mentése
				status === 1 &&
				sendOffer
			) {
				// XML string összeállítása
				const template = templates.find((template) => template.id === felmeres.template);
				await assembleOfferXML(
					"Elfogadásra vár",
					39636,
					adatlapok.find((adatlap) => adatlap.Id === felmeres.adatlap_id)
						? adatlapok.find((adatlap) => adatlap.Id === felmeres.adatlap_id)!.ContactId.toString()
						: "",
					[
						...submitItems
							.filter((item) => item.type !== "Other Material")
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
								.map((item) => item.netPrice * item.inputValues.reduce((a, b) => a + b.ammount, 0))
								.reduce((a, b) => a + b, 0),
							name: "Egyéb szerelési segédanyagok",
							inputValues: [{ ammount: 1, id: 0, value: "" }],
						} as unknown as FelmeresItem,
					],

					felmeres.adatlap_id.toString(),
					template?.description,
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
				if (createType === "CANCEL AND CREATE NEW OFFER") {
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
												router.push("/");
											}}>
											<IterationCw className='w-5 h-5' />
										</ToastAction>
										<ToastAction
											altText='skip'
											onClick={async () => {
												updateStatus(3400);
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
					await fetch("/api/revalidate?tag=" + felmeres.id);
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
					await fetch("/api/revalidate?path=/" + felmeres.id);
					router.push("/");
					// -- END -- //
				}
			}
			updateStatus(3400, felmeresResponseData.id);
			if (createType === "UPDATE" || createType === "DRAFT UPDATE") {
				await fetch("/api/revalidate?path=/" + felmeres.id);
				router.push("/" + felmeresResponseData.id);
			} else {
				await fetch("/api/revalidate?path=/");
				router.push("/");
			}
		}
	};

	const isDisabled = {
		Alapadatok: !felmeres.adatlap_id,
		Tételek:
			!items
				.map((item) => item.inputValues.map((value) => value.ammount).every((value) => value > 0))
				.every((value) => value === true) || !items.length,
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
						return field.value.toString() !== "" && field.value.toString().length;
					}),
			}))
		),
	};

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
						<Separator className='mb-4' />
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
									<div className='flex flex-row px-4 items-center justify-center gap-3'>
										{_.isEqual(
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
											<Button
												className='bg-green-500 hover:bg-green-500/90'
												color='green'
												onClick={() => CreateFelmeres()}
												disabled={isDisabled[section === "Fix kérdések" ? "Fix" : section]}>
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
														<Button
															onClick={() => CreateFelmeres(false)}
															disabled={
																isDisabled[section === "Fix kérdések" ? "Fix" : section]
															}>
															Mentés
														</Button>
													</TooltipTrigger>
													<TooltipContent>
														<p>
															Ez az opció nem küldi el az ajánlatot, még lehet változtatni
															rajta
														</p>
													</TooltipContent>
												</Tooltip>
											</TooltipProvider>
										)}
									</div>
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
			component: <Page1 felmeres={felmeres} setFelmeres={setFelmeres} adatlapok={adatlapok} />,
			title: "Alapadatok",
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
				/>
			),
			title: adatlapok.find((adatlap) => adatlap.Id === felmeres.adatlap_id)?.Name ?? "",
		},
		...Array.from(new Set(questions.map((question) => question.product)))
			.sort((a, b) => Number(a === undefined) - Number(b === undefined))
			.map((product) => {
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
	React.useEffect(() => {
		setSection(pageMap[page].title);
	}, [page]);

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
					options={adatlapok.map((adatlap) => ({
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
