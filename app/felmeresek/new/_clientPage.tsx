"use client";
import { Card, CardBody, Button, Typography, Tooltip, CardHeader } from "@material-tailwind/react";
import Heading from "@/app/_components/Heading";
import React from "react";
import { FelmeresQuestions, ScaleOption } from "../page";
import { AdatlapData } from "./page";
import AutoComplete from "@/app/_components/AutoComplete";
import { Template } from "@/app/templates/page";
import { Product } from "@/app/products/page";
import { Question } from "@/app/questions/page";
import { isJSONParsable } from "../[id]/_clientPage";
import { CheckCircleIcon, InformationCircleIcon, MinusCircleIcon, PlusCircleIcon } from "@heroicons/react/20/solid";
import Counter from "@/app/_components/Counter";
import Input from "@/app/_components/Input";
import MultipleChoice from "@/app/_components/MultipleChoice";
import { GridOptions } from "../page";
import { Grid } from "@/app/_components/Grid";
import FileUpload from "@/app/_components/FileUpload";
import { useRouter } from "next/navigation";
import { ProductAttributes } from "@/app/products/[id]/page";
import { ToDo, assembleOfferXML, fetchMiniCRM, list_to_dos } from "@/app/_utils/MiniCRM";
import { useSearchParams } from "next/navigation";
import Select from "@/app/_components/Select";

export interface ProductTemplate {
	product: number;
	template: number;
}

export interface BaseFelmeresData {
	adatlap_id: number;
	type: string;
	template: number;
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
}

export const hufFormatter = new Intl.NumberFormat("hu-HU", {
	style: "currency",
	currency: "HUF",
});

export const numberFormatter = new Intl.NumberFormat("hu-HU", {
	style: "decimal",
});

interface OtherFelmeresItems {
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
	const searchParams = useSearchParams();

	const [page, setPage] = React.useState(0);
	const [section, setSection] = React.useState("Alapadatok");
	const [felmeres, setFelmeres] = React.useState<BaseFelmeresData>({
		adatlap_id: searchParams.get("adatlap_id") ? parseInt(searchParams.get("adatlap_id")!) : 0,
		type: "",
		template: 0,
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

	React.useEffect(() => {
		const fetchQuestions = async () => {
			items.map(async (item) => {
				const res = await fetch("https://pen.dataupload.xyz/questions?product=" + item.productId);
				if (res.ok) {
					const data: Question[] = await res.json();
					setQuestions((prev) => [
						...prev.filter((question) => !data.map((q) => q.id).includes(question.id)),
						...data,
					]);
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
		const res = await fetch("https://pen.dataupload.xyz/felmeresek/", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(felmeres),
		});
		if (res.ok) {
			await fetch("https://pen.dataupload.xyz/felmeres_items/", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(submitItems),
			});
			let status = 1;
			data.filter((question) => question.value).map(async (question) => {
				const resQuestions = await fetch("https://pen.dataupload.xyz/felmeres_questions/", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						...question,
						adatlap: question.adatlap_id,
						value: Array.isArray(question.value) ? JSON.stringify(question.value) : question.value,
					}),
				});
				if (!resQuestions.ok) {
					status = 0;
				}
			});
			if (status === 1) {
				await assembleOfferXML(
					"Elfogadásra vár",
					39636,
					adatlapok.find((adatlap) => adatlap.Id === felmeres.adatlap_id)
						? adatlapok.find((adatlap) => adatlap.Id === felmeres.adatlap_id)!.ContactId.toString()
						: "",
					submitItems,
					felmeres.adatlap_id.toString()
				);
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
				const todo_criteria = (todo: ToDo) => {
					return todo["Type"] === 225 && todo["Status"] === "Open";
				};

				const todo = await list_to_dos(felmeres.adatlap_id.toString(), todo_criteria);
				if (todo.length) {
					await fetchMiniCRM("ToDo", todo[0].Id.toString(), "PUT", { Status: "Closed" });
				}

				await fetch("/api/revalidate?tag=felmeresek");
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
		!data
			.filter((field) =>
				questions
					.filter((question) => question.mandatory)
					.map((question) => question.id)
					.includes(field.question)
			)
			.map((field) => field.value)
			.every((value) => value !== "") || !data.length,
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

	return (
		<div className='w-full'>
			<div className='flex flex-row w-ful flex-wrap lg:flex-nowrap justify-center mt-2'>
				<div className='lg:mt-6 lg:px-10 w-full'>
					<Card className='shadow-none'>
						<CardBody className='bg-white p-8 lg:rounded-lg bg-transparent bg-opacity-20 lg:border transform'>
							<Heading title={section} variant='h3' />
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
								{numPages === page + 1 ? (
									<Button color='green' onClick={CreateFelmeres} disabled={isDisabled[numPages - 1]}>
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
								{page === 0 ? null : (
									<Button variant='outlined' onClick={() => setPage(page - 1)}>
										Előző
									</Button>
								)}
							</div>
						</CardBody>
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
			title: items.find((item) => item.productId === product)?.name || "Fix kérdések",
		})),
	];
	React.useEffect(() => {
		setNumPages(pageMap.length);
	}, [pageMap.length]);

	setSection(pageMap[page].title);
	return pageMap[page].component;
}

function QuestionTemplate({
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
							<InformationCircleIcon className='w-4 h-4' />
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
						options={["Helyi elszívós rendszer", "Központi ventillátoros", "Passzív rendszer"].map(
							(option) => ({
								label: option,
								value: option,
							})
						)}
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

function Page2({
	felmeres,
	items,
	setItems,
	products,
	productAttributes,
	otherItems,
	setOtherItems,
	discount,
	setDiscount,
}: {
	felmeres: BaseFelmeresData;
	items: FelmeresItems[];
	setItems: React.Dispatch<React.SetStateAction<FelmeresItems[]>>;
	products: Product[];
	productAttributes: ProductAttributes[];
	otherItems: OtherFelmeresItems[];
	setOtherItems: React.Dispatch<React.SetStateAction<OtherFelmeresItems[]>>;
	discount: number;
	setDiscount: React.Dispatch<React.SetStateAction<number>>;
}) {
	const [isAddingNewItem, setIsAddingNewItem] = React.useState(false);
	const [isAddingNewOtherItem, setIsAddingNewOtherItem] = React.useState(false);
	const [newOtherItem, setNewOtherItem] = React.useState<OtherFelmeresItems>();

	React.useEffect(() => {
		if (items.length === 0) {
			const fetchData = async () => {
				const templateId = felmeres.template;
				const productTemplateRes = await fetch("https://pen.dataupload.xyz/product_templates/" + templateId);
				if (productTemplateRes.ok) {
					const productTemplates: ProductTemplate[] = await productTemplateRes.json();
					productTemplates.map(async (productTemplate) => {
						const productResp = await fetch(
							"https://pen.dataupload.xyz/products/" + productTemplate.product
						);
						if (productResp.ok) {
							const productData: Product = await productResp.json();
							const productAttributeResp = await fetch(
								"https://pen.dataupload.xyz/product_attributes/" + productTemplate.product
							);
							if (productAttributeResp.ok) {
								const productAttributeData = await productAttributeResp.json().then((data) => data[0]);
								setItems((prevItems) => [
									...prevItems.filter((item) => item.productId !== productTemplate.product),
									{
										productId: productTemplate.product,
										name: productData.name,
										place: productAttributeData ? productAttributeData.place : false,
										placeOptions: productAttributeData
											? isJSONParsable(
													productAttributeData.place_options.replace(
														/'/g,
														'"'
													) as unknown as string
											  )
												? JSON.parse(
														productAttributeData.place_options.replace(
															/'/g,
															'"'
														) as unknown as string
												  )
												: []
											: [],
										inputValues: [{ value: "", id: 0, ammount: 0 }],
										netPrice: productData.price_list_alapertelmezett_net_price_huf,
										adatlap: felmeres.adatlap_id,
										sku: productData.sku,
									},
								]);
							}
						}
					});
				}
			};
			fetchData();
		}
	}, []);

	const TABLE_HEAD_ITEMS = ["Név", "Darab + Hely", "Nettó egység", "Nettó összesen"];
	const TABLE_HEAD_OTHER = ["Név", "Nettó egységár", "Nettó összesen"];

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

	return (
		<div>
			<Card className='my-5'>
				<div className=''>
					<table className='w-full min-w-max table-auto text-left max-w-20 overflow-x-scroll'>
						<thead>
							<tr>
								{TABLE_HEAD_ITEMS.map((head) => (
									<th key={head} className='border-b border-blue-gray-100 bg-blue-gray-50 p-4'>
										<Typography
											variant='small'
											color='blue-gray'
											className='font-normal leading-none opacity-70'>
											{head}
										</Typography>
									</th>
								))}
								<th className='border-b border-blue-gray-100 bg-blue-gray-50 p-4'></th>
							</tr>
						</thead>
						<tbody>
							{items
								.sort((a, b) => a.productId - b.productId)
								.map(({ name, place, placeOptions: place_options, inputValues, netPrice }, index) => {
									const isLast = index === items.length - 1;
									const classes = isLast ? "p-4" : "p-4 border-b border-blue-gray-50";

									return (
										<tr key={name}>
											<td className={classes}>
												<Typography
													variant='small'
													color='blue-gray'
													className='font-normal max-w-[30rem]'>
													{name}
												</Typography>
											</td>
											{inputValues
												.sort((a, b) => a.id - b.id)
												.map((inputValue) => (
													<div key={inputValue.id} className='flex flex-row'>
														<td className={classes}>
															<Counter
																maxWidth='max-w-[10rem]'
																value={inputValue.ammount}
																onChange={(value) =>
																	setItems([
																		...items.filter(
																			(i) =>
																				i.productId !== items[index].productId
																		),
																		{
																			...items[index],
																			inputValues: [
																				...inputValues.filter(
																					(value) =>
																						value.id !== inputValue.id
																				),
																				{ ...inputValue, ammount: value },
																			],
																		},
																	])
																}
															/>
														</td>
														{place ? (
															<td
																className={
																	classes + " flex flex-row w-full items-center gap-2"
																}>
																<div className='font-normal flex flex-col gap-2 max-w-[17rem]'>
																	<div className='flex-row flex items-center gap-2'>
																		<AutoComplete
																			options={place_options
																				.filter(
																					(option) =>
																						!inputValues
																							.map((value) => value.value)
																							.includes(option)
																				)
																				.map((option) => ({
																					label: option,
																					value: option,
																				}))}
																			value={inputValue.value}
																			onChange={(e) => {
																				setItems([
																					...items.filter(
																						(item) =>
																							item.productId !==
																							items[index].productId
																					),
																					{
																						...items[index],
																						inputValues: [
																							...inputValues.filter(
																								(value) =>
																									value.id !==
																									inputValue.id
																							),
																							{
																								value: e,
																								id: inputValue.id,
																								ammount:
																									inputValue.ammount,
																							},
																						],
																					},
																				]);
																			}}
																		/>
																		<PlusCircleIcon
																			className='w-7 h-7 cursor-pointer'
																			onClick={() =>
																				setItems([
																					...items.filter(
																						(item) =>
																							item.productId !==
																							items[index].productId
																					),
																					{
																						...items[index],
																						inputValues: [
																							...inputValues,
																							{
																								value: "",
																								id: inputValues.length,
																								ammount: 0,
																							},
																						],
																					},
																				])
																			}
																		/>
																		{inputValues.length > 1 ? (
																			<MinusCircleIcon
																				className='w-7 h-7 cursor-pointer'
																				onClick={() =>
																					setItems([
																						...items.filter(
																							(item) =>
																								item.productId !==
																								items[index].productId
																						),
																						{
																							...items[index],
																							inputValues: [
																								...inputValues.filter(
																									(value) =>
																										value.id !==
																										inputValue.id
																								),
																							],
																						},
																					])
																				}
																			/>
																		) : null}
																	</div>
																</div>
															</td>
														) : (
															<td className={classes + " w-full"}></td>
														)}
													</div>
												))}
											<td className={classes}>
												<Typography
													variant='small'
													color='blue-gray'
													className='font-normal max-w-[30rem]'>
													{hufFormatter.format(netPrice)}
												</Typography>
											</td>
											<td className={classes}>
												<Typography
													variant='small'
													color='blue-gray'
													className='font-normal max-w-[30rem]'>
													{hufFormatter.format(
														netPrice * inputValues.reduce((a, b) => a + b.ammount, 0)
													)}
												</Typography>
											</td>
											<td className={classes}>
												<MinusCircleIcon
													className='w-7 h-7 text-red-600 cursor-pointer'
													onClick={() =>
														setItems((prev) => prev.filter((item) => item.name !== name))
													}
												/>
											</td>
										</tr>
									);
								})}
							<tr>
								{!isAddingNewItem ? (
									<>
										<td></td>
										<td></td>
										<td></td>
										<td></td>
										<td className='p-4 border-b border-blue-gray-50'>
											<PlusCircleIcon
												className='w-7 h-7 text-green-600 cursor-pointer'
												onClick={() => {
													setIsAddingNewItem(true);
												}}
											/>
										</td>
									</>
								) : (
									<>
										<td className='p-4 border-b border-blue-gray-50'>
											<AutoComplete
												options={products
													.filter(
														(product) =>
															!items.map((item) => item.productId).includes(product.id)
													)
													.map((product) => ({
														label: product.name,
														value: product.id.toString(),
													}))}
												value={items.find((item) => item.productId === 0)?.name || ""}
												onChange={(value) => {
													setItems((prev) =>
														prev.length
															? [
																	...prev.filter(
																		(item) => item.productId.toString() !== value
																	),
																	{
																		...prev[prev.length - 1],
																		productId: parseInt(value),
																		name: products.find(
																			(product) => product.id === parseInt(value)
																		)!.name,
																		place: productAttributes.find(
																			(attribute) =>
																				attribute.product === parseInt(value)
																		)
																			? productAttributes.find(
																					(attribute) =>
																						attribute.product ===
																						parseInt(value)
																			  )!.place
																			: false,
																		inputValues: [
																			{
																				value: "",
																				id: 0,
																				ammount: 0,
																			},
																		],
																		netPrice: products.find(
																			(product) => product.id === parseInt(value)
																		)!.price_list_alapertelmezett_net_price_huf,
																		placeOptions: productAttributes.find(
																			(attribute) =>
																				attribute.product === parseInt(value)
																		)
																			? JSON.parse(
																					(
																						productAttributes.find(
																							(attribute) =>
																								attribute.product ===
																								parseInt(value)
																						)!
																							.place_options as unknown as string
																					).replace(/'/g, '"')
																			  )
																			: [],
																	},
															  ]
															: [...prev]
													);
												}}
											/>
										</td>
										<td className='p-4 border-b border-blue-gray-50'></td>
										<td className='p-4 border-b border-blue-gray-50'></td>
										<td className='p-4 border-b border-blue-gray-50'></td>
										<td className='p-4 border-b border-blue-gray-50'>
											<CheckCircleIcon
												className='w-7 h-7 text-green-600 cursor-pointer'
												onClick={() => setIsAddingNewItem(false)}
											/>
										</td>
									</>
								)}
							</tr>
						</tbody>
						<tfoot className='bg-gray'>
							<tr>
								<td className='border-b border-blue-gray-100 bg-blue-gray-50 p-4'>
									<Typography
										variant='small'
										color='blue-gray'
										className='font-normal leading-none opacity-70'>
										Össz:
									</Typography>
								</td>
								<td className='border-b border-blue-gray-100 bg-blue-gray-50 p-4'></td>
								<td className='border-b border-blue-gray-100 bg-blue-gray-50 p-4'></td>
								<td className='border-b border-blue-gray-100 bg-blue-gray-50 p-4'>
									<Typography
										variant='small'
										color='blue-gray'
										className='font-normal leading-none opacity-70'>
										{hufFormatter.format(netTotal)}
									</Typography>
								</td>
								<td className='border-b border-blue-gray-100 bg-blue-gray-50 p-4'></td>
							</tr>
						</tfoot>
					</table>
				</div>
			</Card>
			<div className='mt-8'>
				<Heading title='Egyéb' variant='h5' marginY='lg:my-4' border={false} />
				<Card>
					<div className=''>
						<table className='w-full min-w-max table-auto text-left max-w-20 overflow-x-scroll'>
							<thead>
								<tr>
									{TABLE_HEAD_OTHER.map((head) => (
										<th key={head} className='border-b border-blue-gray-100 bg-blue-gray-50 p-4'>
											<Typography
												variant='small'
												color='blue-gray'
												className='font-normal leading-none opacity-70'>
												{head}
											</Typography>
										</th>
									))}
									<th className='border-b border-blue-gray-100 bg-blue-gray-50 p-4'>
										<Typography
											variant='small'
											color='blue-gray'
											className='font-normal leading-none opacity-70 w-10'></Typography>
									</th>
								</tr>
							</thead>
							<tbody>
								{otherItems
									.sort((a, b) => a.id - b.id)
									.map((item) => (
										<tr>
											<td className='p-4 border-b border-blue-gray-50'>
												<Typography
													variant='small'
													color='blue-gray'
													className='font-normal max-w-[30rem]'>
													{item.name}
												</Typography>
											</td>
											<td className='mr-5 p-4 pr-8 border-b border-blue-gray-50 w-40'>
												<div className='relative'>
													<Input
														variant='simple'
														value={
															item.type === "percent"
																? item.value
																: numberFormatter.format(item.value)
														}
														onChange={(e) => {
															setOtherItems((prev) => [
																...prev.filter((prevItem) => item.id !== prevItem.id),
																{
																	...prev.find(
																		(prevItem) => prevItem.id === item.id
																	)!,
																	value: parseInt(e.target.value.replace(/\D/g, "")),
																},
															]);
														}}
													/>
													<Typography
														variant='small'
														className='font-extralight text-gray-500 absolute top-2 right-2 max-w-[30rem]'>
														{item.type === "percent" ? "%" : "Ft"}
													</Typography>
												</div>
											</td>
											<td className='p-4 border-b border-blue-gray-50 w-40'>
												<Typography
													variant='small'
													color='blue-gray'
													className='font-normal max-w-[30rem]'>
													{hufFormatter.format(
														item.type === "fixed"
															? item.value
															: ((netTotal +
																	otherItems
																		.filter((item) => item.type !== "percent")
																		.reduce((a, b) => a + b.value, 0)) *
																	item.value) /
																	100
													)}
												</Typography>
											</td>
											<td className='p-4 border-b border-blue-gray-50 w-10'></td>
										</tr>
									))}
								<tr>
									{!isAddingNewOtherItem ? (
										<>
											<td></td>
											<td></td>
											<td></td>
											<td className='p-4 border-b border-blue-gray-50'>
												<PlusCircleIcon
													className='w-7 h-7 text-green-600 cursor-pointer'
													onClick={() => {
														setIsAddingNewOtherItem(true);
													}}
												/>
											</td>
										</>
									) : (
										<>
											<td className='p-4 border-b border-blue-gray-50'>
												<div className='flex flex-row w-full gap-4'>
													<Input
														variant='simple'
														label='Név'
														value={newOtherItem?.name || ""}
														onChange={(e) => {
															setNewOtherItem((prev) => ({
																...(prev as OtherFelmeresItems),
																name: e.target.value,
															}));
														}}
													/>
													<Select
														label='Típus'
														variant='simple'
														onChange={(value) =>
															setNewOtherItem((prev) => ({
																...(prev as OtherFelmeresItems),
																type: value as "fixed" | "percent",
															}))
														}
														options={[
															{ value: "fixed", label: "Összeg" },
															{ value: "percent", label: "Százalék" },
														]}
														value={newOtherItem?.type || ""}
													/>
												</div>
											</td>
											<td></td>
											<td></td>
											<td className='p-4 border-b border-blue-gray-50'>
												<CheckCircleIcon
													className='w-7 h-7 text-green-600 cursor-pointer'
													onClick={() => {
														setIsAddingNewOtherItem(false);
														setOtherItems((prev) => [
															...prev,
															{
																...(newOtherItem as OtherFelmeresItems),
																id: prev.length,
																value: 0,
															},
														]);
														setNewOtherItem(undefined);
													}}
												/>
											</td>
										</>
									)}
								</tr>
							</tbody>
							<tfoot className='bg-gray'>
								<tr>
									<td className='border-b border-blue-gray-100 bg-blue-gray-50 p-4'>
										<Typography
											variant='small'
											color='blue-gray'
											className='font-normal leading-none opacity-70'>
											Össz:
										</Typography>
									</td>
									<td className='border-b border-blue-gray-100 bg-blue-gray-50 p-4'></td>
									<td className='border-b border-blue-gray-100 bg-blue-gray-50 p-4'>
										<Typography
											variant='small'
											color='blue-gray'
											className='font-normal leading-none opacity-70'>
											{hufFormatter.format(otherItemsNetTotal)}
										</Typography>
									</td>
									<td className='border-b border-blue-gray-100 bg-blue-gray-50 p-4'></td>
								</tr>
							</tfoot>
						</table>
					</div>
				</Card>
			</div>
			<div className='mt-8'>
				<Heading title='Összesítés' variant='h5' marginY='lg:my-4' border={false} />
				<Card>
					<div className=''>
						<table className='w-full min-w-max table-auto text-left max-w-20 overflow-x-scroll'>
							<thead>
								<tr>
									<th className='border-b border-blue-gray-100 bg-blue-gray-50 p-4'>
										<Typography
											variant='small'
											color='blue-gray'
											className='font-normal leading-none opacity-70'>
											Név
										</Typography>
									</th>
									<th className='border-b border-blue-gray-100 bg-blue-gray-50 p-4'>
										<Typography
											variant='small'
											color='blue-gray'
											className='font-normal leading-none opacity-70'>
											Nettó
										</Typography>
									</th>
									<th className='border-b border-blue-gray-100 bg-blue-gray-50 p-4'>
										<Typography
											variant='small'
											color='blue-gray'
											className='font-normal leading-none opacity-70'>
											ÁFA
										</Typography>
									</th>
									<th className='border-b border-blue-gray-100 bg-blue-gray-50 p-4'>
										<Typography
											variant='small'
											color='blue-gray'
											className='font-normal leading-none opacity-70'>
											Bruttó
										</Typography>
									</th>
								</tr>
							</thead>
							<tbody>
								<tr>
									<td className='p-4 border-b border-blue-gray-50'>
										<Typography
											variant='small'
											color='blue-gray'
											className='font-normal max-w-[30rem]'>
											Tételek
										</Typography>
									</td>
									<td className='p-4 border-b border-blue-gray-50'>
										<Typography
											variant='small'
											color='blue-gray'
											className='font-normal max-w-[30rem]'>
											{hufFormatter.format(netTotal)}
										</Typography>
									</td>
									<td className='p-4 border-b border-blue-gray-50'>
										<Typography
											variant='small'
											color='blue-gray'
											className='font-normal max-w-[30rem]'>
											{hufFormatter.format(netTotal * 0.27)}
										</Typography>
									</td>
									<td className='p-4 border-b border-blue-gray-50'>
										<Typography
											variant='small'
											color='blue-gray'
											className='font-normal max-w-[30rem]'>
											{hufFormatter.format(netTotal * 1.27)}
										</Typography>
									</td>
								</tr>
								<tr>
									<td className='p-4 border-b border-blue-gray-50'>
										<Typography
											variant='small'
											color='blue-gray'
											className='font-normal max-w-[30rem]'>
											Egyéb
										</Typography>
									</td>
									<td className='p-4 border-b border-blue-gray-50'>
										<Typography
											variant='small'
											color='blue-gray'
											className='font-normal max-w-[30rem]'>
											{hufFormatter.format(otherItemsNetTotal)}
										</Typography>
									</td>
									<td className='p-4 border-b border-blue-gray-50'>
										<Typography
											variant='small'
											color='blue-gray'
											className='font-normal max-w-[30rem]'>
											{hufFormatter.format(otherItemsNetTotal * 0.27)}
										</Typography>
									</td>
									<td className='p-4 border-b border-blue-gray-50'>
										<Typography
											variant='small'
											color='blue-gray'
											className='font-normal max-w-[30rem]'>
											{hufFormatter.format(otherItemsNetTotal * 1.27)}
										</Typography>
									</td>
								</tr>
								<tr>
									<td className='p-4 border-b border-blue-gray-50'>
										<Typography
											variant='small'
											color='blue-gray'
											className='font-normal max-w-[30rem]'>
											Kedvezmény
										</Typography>
									</td>
									<td></td>
									<td></td>
									<td className='p-4 border-b pr-8 border-blue-gray-50 w-40'>
										<div className='relative'>
											<Input
												variant='simple'
												value={discount}
												onChange={(e) => {
													setDiscount(
														parseInt(e.target.value.replace(/\D/g, "")) <= 100
															? parseInt(e.target.value.replace(/\D/g, ""))
															: 0
													);
												}}
											/>
											<Typography
												variant='small'
												className='font-extralight text-gray-500 absolute top-2 right-2 max-w-[30rem]'>
												%
											</Typography>
										</div>
									</td>
								</tr>
							</tbody>
							<tfoot className='bg-gray'>
								<tr>
									<td className='border-b border-blue-gray-100 bg-blue-gray-50 p-4'>
										<Typography
											variant='small'
											color='blue-gray'
											className='font-normal leading-none opacity-70'>
											Össz:
										</Typography>
									</td>
									<td className='border-b border-blue-gray-100 bg-blue-gray-50 p-4'>
										<Typography
											variant='small'
											color='blue-gray'
											className='font-normal leading-none opacity-70'>
											{hufFormatter.format(otherItemsNetTotal + netTotal)}
										</Typography>
									</td>
									<td className='border-b border-blue-gray-100 bg-blue-gray-50 p-4'>
										<Typography
											variant='small'
											color='blue-gray'
											className='font-normal leading-none opacity-70'>
											{hufFormatter.format(otherItemsNetTotal * 0.27 + netTotal * 0.27)}
										</Typography>
									</td>
									<td className='border-b border-blue-gray-100 bg-blue-gray-50 p-4'>
										<Typography
											variant='small'
											color='blue-gray'
											className='font-normal leading-none opacity-70'>
											{hufFormatter.format(
												(otherItemsNetTotal * 1.27 + netTotal * 1.27) / (1 + discount / 100)
											)}
										</Typography>
									</td>
								</tr>
							</tfoot>
						</table>
					</div>
				</Card>
			</div>
		</div>
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
		setGlobalData((prev) => [
			...prev.filter((felmeres) => felmeres.question !== question.id),
			{
				adatlap_id: adatlap_id,
				id: 0,
				value: "",
				question: question.id,
				section: product ? product : "Fix",
			},
		]);
	}, [adatlap_id, product, question.id, setGlobalData]);

	const setterSingle = (value: string) => {
		setGlobalData((prev) =>
			prev.map((felmeres) => (felmeres.question === question.id ? { ...felmeres, value: value } : felmeres))
		);
	};

	const setterMultipleUnordered = (value: string) => {
		let values = [""];
		const felmeres = globalData.find((felmeres) => felmeres.question === question.id);
		if (felmeres?.value.includes(value) && values.length) {
			values = (felmeres.value as unknown as string[]).filter((v) => v !== value);
		} else {
			values = [...(felmeres?.value as unknown as string[]), value];
		}
		setGlobalData((prev) =>
			prev.map((felmeres) =>
				felmeres.question === question.id ? { ...felmeres, value: values as unknown as string } : felmeres
			)
		);
	};

	const setterSingleOrdered = (value: { column: string; row: number }) => {
		setGlobalData((prev) =>
			prev.map((felmeres) =>
				felmeres.question === question.id
					? {
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
					  }
					: felmeres
			)
		);
	};

	const setterMultipleOrdered = (value: { column: string; row: number }) => {
		setGlobalData((prev) =>
			prev.map((felmeres) =>
				felmeres.question === question.id
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
		const felmeres = globalData.find((felmeres) => felmeres.question === question.id);
		return (
			<Input onChange={(e) => setterSingle(e.target.value)} value={felmeres?.value as string} variant='simple' />
		);
	} else if (question.type === "LIST") {
		const felmeres = globalData.find((felmeres) => felmeres.question === question.id);
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
		const felmeres = globalData.find((felmeres) => felmeres.question === question.id);
		return (
			<MultipleChoice
				options={(question.options as string[]).map((option) => option)}
				value={felmeres?.value as string}
				onChange={question.type === "CHECKBOX" ? setterMultipleUnordered : setterSingle}
				radio={question.type === "MULTIPLE_CHOICE"}
			/>
		);
	} else if (question.type === "GRID" || question.type === "CHECKBOX_GRID") {
		const felmeres = globalData.find((felmeres) => felmeres.question === question.id);
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
		const felmeres = globalData.find((felmeres) => felmeres.question === question.id);
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
							felmeres.question === question.id
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
