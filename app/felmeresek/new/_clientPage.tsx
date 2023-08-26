"use client";
import { Card, CardBody, Button, Typography } from "@material-tailwind/react";
import Heading from "@/app/_components/Heading";
import React from "react";
import { Felmeres } from "../page";
import { AdatlapData } from "./page";
import AutoComplete from "@/app/_components/AutoComplete";
import { Template } from "@/app/templates/page";
import { Product } from "@/app/products/page";
import { ProductAttributes } from "@/app/products/[id]/page";
import { isJSONParsable } from "@/app/questions/page";
import { MinusCircleIcon, PlusCircleIcon } from "@heroicons/react/20/solid";
import Counter from "@/app/_components/Counter";

export interface ProductTemplate {
	product: number;
	template: number;
}

export const hufFormatter = new Intl.NumberFormat("hu-HU", {
	style: "currency",
	currency: "HUF",
});

export default function Page({ adatlapok, templates }: { adatlapok: AdatlapData[]; templates: Template[] }) {
	const [data, setData] = React.useState<Felmeres[]>([]);
	const [adatlap, setAdatlap] = React.useState<{ id: number; name: string }>({ id: 0, name: "" });
	const [page, setPage] = React.useState(1);
	const [section, setSection] = React.useState("Alapadatok");
	return (
		<div className='w-full'>
			<div className='flex flex-row w-ful flex-wrap lg:flex-nowrap justify-center mt-2'>
				<div className='lg:mt-6 lg:px-10 w-full'>
					<Card className='shadow-none'>
						<CardBody className='bg-white p-8 lg:rounded-lg bg-transparent bg-opacity-20 lg:border transform'>
							<Heading title={section} variant='h3' />
							<PageChooser
								page={page}
								adatlap={adatlap}
								adatlapok={adatlapok}
								data={data}
								setAdatlap={setAdatlap}
								setData={setData}
								setSection={setSection}
								templates={templates}
							/>
							<div className='flex flex-row justify-end gap-3 border-t py-4'>
								<Button onClick={() => setPage(page + 1)}>Következő</Button>
								{page === 1 ? null : (
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
	setAdatlap,
	adatlap,
	data,
	setData,
	setSection,
	templates,
}: {
	page: number;
	adatlapok: AdatlapData[];
	setAdatlap: React.Dispatch<React.SetStateAction<{ id: number; name: string }>>;
	adatlap: { id: number; name: string };
	data: Felmeres[];
	setData: React.Dispatch<React.SetStateAction<Felmeres[]>>;
	setSection: React.Dispatch<React.SetStateAction<string>>;
	templates: Template[];
}) {
	interface PageMap {
		[key: number]: {
			component: JSX.Element;
			title: string;
		};
	}
	const pageMap: PageMap = {
		1: {
			component: (
				<Page1
					adatlap={adatlap}
					adatlapok={adatlapok}
					data={data}
					setAdatlap={setAdatlap}
					setData={setData}
					templates={templates}
				/>
			),
			title: "Alapadatok",
		},
		2: {
			component: <Page2 data={data} />,
			title: "Tételek",
		},
	};
	setSection(pageMap[page].title);
	return pageMap[page].component;
}

function QuestionTemplate({ children, title }: { children: React.ReactNode; title: string }) {
	return (
		<div className='px-4 py-6 flex flex-row sm:gap-4 sm:px-0'>
			<div className='text-base font-medium leading-6 text-gray-900 w-1/3'>{title}</div>
			<div className='flex justify-end w-full items-center'>
				<div className={`w-1/3`}>{children}</div>
			</div>
		</div>
	);
}

function Page1({
	adatlapok,
	setAdatlap,
	adatlap,
	data,
	setData,
	templates,
}: {
	adatlapok: AdatlapData[];
	setAdatlap: React.Dispatch<React.SetStateAction<{ id: number; name: string }>>;
	adatlap: { id: number; name: string };
	data: Felmeres[];
	setData: React.Dispatch<React.SetStateAction<Felmeres[]>>;
	templates: Template[];
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
						setAdatlap({
							id: parseInt(e),
							name: adatlapok.find((adatlap) => adatlap.Id === parseInt(e))
								? adatlapok.find((adatlap) => adatlap.Id === parseInt(e))!.Name
								: "",
						});
						setData([
							...data,
							{
								field: "Adatlap",
								value: e,
								adatlap_id: adatlap.id,
								section: "Alapadatok",
							} as unknown as Felmeres,
						]);
					}}
					value={adatlap.name}
				/>
			</QuestionTemplate>
			{data.filter((field) => field.field === "Adatlap").length > 0 ? (
				<QuestionTemplate title='Milyen rendszert tervezel?'>
					<AutoComplete
						options={["Helyi elszívós rendszer", "Központi ventillátoros", "Passzív rendszer"].map(
							(option) => ({
								label: option,
								value: option,
							})
						)}
						onChange={(e) =>
							setData([
								...data.filter((field) => field.field !== "Milyen rendszert tervezel?"),
								{
									field: "Milyen rendszert tervezel?",
									value: e,
									adatlap_id: adatlap.id,
									section: "Alapadatok",
								} as unknown as Felmeres,
							])
						}
						value={
							data.find((felmeres) => felmeres.field === "Milyen rendszert tervezel?")
								? data.find((felmeres) => felmeres.field === "Milyen rendszert tervezel?")!.value
								: ""
						}
					/>
				</QuestionTemplate>
			) : null}
			{data.filter((field) => field.field === "Milyen rendszert tervezel?").length > 0 ? (
				<QuestionTemplate title='Sablon'>
					<AutoComplete
						options={templates
							.filter(
								(template) =>
									template.type ===
									data.find(
										(data) =>
											data.field === "Milyen rendszert tervezel?" &&
											data.adatlap_id === adatlap.id
									)?.value
							)
							.map((template) => ({
								label: template.name,
								value: template.id.toString(),
							}))}
						onChange={(e) => {
							setData([
								...data.filter((field) => field.field !== "Sablon"),
								{
									field: "Sablon",
									value: e,
									adatlap_id: adatlap.id,
									section: "Alapadatok",
								} as unknown as Felmeres,
							]);
						}}
						value={
							templates.find(
								(template) =>
									template.id ===
									parseInt(data.find((felmeres) => felmeres.field === "Sablon")?.value || "")
							)?.name || ""
						}
					/>
				</QuestionTemplate>
			) : null}
		</>
	);
}

function Page2({ data }: { data: Felmeres[] }) {
	const [items, setItems] = React.useState<
		{
			name: string;
			place: boolean;
			place_options: string[];
			id: number;
			inputValues: { value: string; id: number; ammount: number }[];
			netPrice: number;
		}[]
	>([]);

	React.useEffect(() => {
		const fetchData = async () => {
			const templateId = parseInt(data.find((felmeres) => felmeres.field === "Sablon")?.value || "");
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
								...prevItems.filter((item) => item.id !== productTemplate.product),
								{
									id: productTemplate.product,
									name: productData.name,
									place: productAttributeData.place,
									place_options: isJSONParsable(
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
			<div className='max-w-[20px]'>
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
							.sort((a, b) => a.id - b.id)
							.map(({ name, place, place_options, inputValues, netPrice }, index) => {
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
												<div className='flex flex-row'>
													<td className={classes}>
														<Counter
															value={inputValue.ammount}
															onChange={(value) =>
																setItems([
																	...items.filter((i) => i.id !== items[index].id),
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
																						item.id !== items[index].id
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
																						item.id !== items[index].id
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
																							item.id !== items[index].id
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
