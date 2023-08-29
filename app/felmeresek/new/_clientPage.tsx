"use client";
import { Card, CardBody, Button, Typography, input } from "@material-tailwind/react";
import Heading from "@/app/_components/Heading";
import React from "react";
import { FelmeresQuestions, ScaleOption } from "../page";
import { AdatlapData } from "./page";
import AutoComplete from "@/app/_components/AutoComplete";
import { Template } from "@/app/templates/page";
import { Product } from "@/app/products/page";
import { Question } from "@/app/questions/page";
import { isJSONParsable } from "../[id]/_clientPage";
import { MinusCircleIcon, PlusCircleIcon } from "@heroicons/react/20/solid";
import Counter from "@/app/_components/Counter";
import Input from "@/app/_components/Input";
import MultipleChoice from "@/app/_components/MultipleChoice";
import { GridOptions } from "../page";
import { Grid } from "@/app/_components/Grid";
import FileUpload from "@/app/_components/FileUpload";
import { useRouter } from "next/navigation";

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
}

export const hufFormatter = new Intl.NumberFormat("hu-HU", {
	style: "currency",
	currency: "HUF",
});

export default function Page({ adatlapok, templates }: { adatlapok: AdatlapData[]; templates: Template[] }) {
	const [page, setPage] = React.useState(1);
	const [section, setSection] = React.useState("Alapadatok");
	const [felmeres, setFelmeres] = React.useState<BaseFelmeresData>({ adatlap_id: 0, type: "", template: 0 });
	const [items, setItems] = React.useState<FelmeresItems[]>([]);
	const [numPages, setNumPages] = React.useState(0);
	const router = useRouter();
	const [data, setData] = React.useState<FelmeresQuestions[]>([]);

	const CreateFelmeres = async () => {
		const res = await fetch("http://pen.dataupload.xyz/felmeresek/", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(felmeres),
		});
		if (res.ok) {
			await fetch("http://pen.dataupload.xyz/felmeres_items/", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(items),
			});
			let status = 1;
			data.filter((question) => question.value).map(async (question) => {
				const resQuestions = await fetch("http://pen.dataupload.xyz/felmeres_questions/", {
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
				await fetch("/api/revalidate?tag=felmeresek");
				router.push("/felmeresek");
			}
		}
	};

	return (
		<div className='w-full'>
			<div className='flex flex-row w-ful flex-wrap lg:flex-nowrap justify-center mt-2'>
				<div className='lg:mt-6 lg:px-10 w-full'>
					<Card className='shadow-none'>
						<CardBody className='bg-white p-8 lg:rounded-lg bg-transparent bg-opacity-20 lg:border transform'>
							<Heading title={section} variant='h3' />
							<PageChooser
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
							/>
							<div className='flex flex-row justify-end gap-3 border-t py-4'>
								{numPages === page + 1 ? (
									<Button color='green' onClick={CreateFelmeres}>
										Beküldés
									</Button>
								) : (
									<Button
										onClick={() => {
											setPage(page + 1);
										}}>
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
	felmeres,
	setFelmeres,
	items,
	setItems,
	setData,
	setNumPages,
	globalData,
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
}) {
	interface PageMap {
		component: JSX.Element;
		title: string;
	}

	const [questions, setQuestions] = React.useState<Question[]>([]);

	React.useEffect(() => {
		const fetchQuestions = async () => {
			items.map(async (item) => {
				const res = await fetch("http://pen.dataupload.xyz/questions?product=" + item.productId);
				if (res.ok) {
					const data: Question[] = await res.json();
					setQuestions((prev) => [
						...prev.filter((question) => !data.map((q) => q.id).includes(question.id)),
						...data,
					]);
				}
			});
			const res = await fetch("http://pen.dataupload.xyz/questions?connection=Fix");
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

	const pageMap: PageMap[] = [
		{
			component: (
				<Page1 felmeres={felmeres} setFelmeres={setFelmeres} adatlapok={adatlapok} templates={templates} />
			),
			title: "Alapadatok",
		},
		{
			component: <Page2 felmeres={felmeres} items={items} setItems={setItems} />,
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

function QuestionTemplate({ children, title, type }: { children: React.ReactNode; title: string; type?: string }) {
	return (
		<div className='px-4 py-6 flex flex-row sm:gap-4 sm:px-0'>
			<div className='text-base font-medium leading-6 text-gray-900 w-1/3'>{title}</div>
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
}: {
	felmeres: BaseFelmeresData;
	items: FelmeresItems[];
	setItems: React.Dispatch<React.SetStateAction<FelmeresItems[]>>;
}) {
	React.useEffect(() => {
		const fetchData = async () => {
			const templateId = felmeres.template;
			const productTemplateRes = await fetch("http://pen.dataupload.xyz/product_templates/" + templateId);
			if (productTemplateRes.ok) {
				const productTemplates: ProductTemplate[] = await productTemplateRes.json();
				productTemplates.map(async (productTemplate) => {
					const productResp = await fetch("http://pen.dataupload.xyz/products/" + productTemplate.product);
					if (productResp.ok) {
						const productData: Product = await productResp.json();
						const productAttributeResp = await fetch(
							"http://pen.dataupload.xyz/product_attributes/" + productTemplate.product
						);
						if (productAttributeResp.ok) {
							const productAttributeData = await productAttributeResp.json().then((data) => data[0]);
							setItems((prevItems) => [
								...prevItems.filter((item) => item.productId !== productTemplate.product),
								{
									productId: productTemplate.product,
									name: productData.name,
									place: productAttributeData.place,
									placeOptions: isJSONParsable(
										productAttributeData.place_options.replace(/'/g, '"') as unknown as string
									)
										? JSON.parse(
												productAttributeData.place_options.replace(
													/'/g,
													'"'
												) as unknown as string
										  )
										: [],
									inputValues: [{ value: "", id: 0, ammount: 0 }],
									netPrice: productData.price_list_alapertelmezett_net_price_huf,
									adatlap: felmeres.adatlap_id,
								},
							]);
						}
					}
				});
			}
		};
		fetchData();
	}, []);

	const TABLE_HEAD = ["Név", "Darab + Hely", "Nettó egység", "Nettó összesen"];

	return (
		<Card className='my-5'>
			<div className=''>
				<table className='w-full min-w-max table-auto text-left max-w-20 overflow-x-scroll'>
					<thead>
						<tr>
							{TABLE_HEAD.map((head) => (
								<th key={head} className='border-b border-blue-gray-100 bg-blue-gray-50 p-4'>
									<Typography
										variant='small'
										color='blue-gray'
										className='font-normal leading-none opacity-70'>
										{head}
									</Typography>
								</th>
							))}
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
																		(i) => i.productId !== items[index].productId
																	),
																	{
																		...items[index],
																		inputValues: [
																			...inputValues.filter(
																				(value) => value.id !== inputValue.id
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
																							ammount: inputValue.ammount,
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
													) : null}
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
									</tr>
								);
							})}
					</tbody>
					<tfoot className='bg-gray'>
						<tr>
							<td className='border-b border-blue-gray-100 bg-blue-gray-50 p-4'>Össz:</td>
							<td className='border-b border-blue-gray-100 bg-blue-gray-50 p-4'></td>
							<td className='border-b border-blue-gray-100 bg-blue-gray-50 p-4'></td>
							<td className='border-b border-blue-gray-100 bg-blue-gray-50 p-4'>
								<Typography
									variant='small'
									color='blue-gray'
									className='font-normal leading-none opacity-70'>
									{hufFormatter.format(
										items
											.map(
												({ inputValues, netPrice }) =>
													netPrice * inputValues.reduce((a, b) => a + b.ammount, 0)
											)
											.reduce((a, b) => a + b, 0)
									)}
								</Typography>
							</td>
						</tr>
					</tfoot>
				</table>
			</div>
		</Card>
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
	console.log(globalData);
	return (
		<>
			{questions.map((question) => (
				<QuestionTemplate key={question.id} title={question.question} type={question.type}>
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
	const [randomId, setRandomId] = React.useState("");

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

	React.useEffect(() => {
		setRandomId(Math.floor(Math.random() * Date.now()).toString());
	}, []);

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
		const felmeres = globalData.find((felmeres) => felmeres.question === question.id);
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
				route={`/api/save-image?id=${randomId}`}
				onUpload={() =>
					setGlobalData((prev) =>
						prev.map((felmeres) =>
							felmeres.question === question.id
								? {
										adatlap_id: adatlap_id,
										id: 0,
										question: question.id,
										section: felmeres.section,
										value: "https://felmeres-note-images.s3.eu-central-1.amazonaws.com/" + randomId,
								  }
								: felmeres
						)
					)
				}
			/>
		);
	}
}
