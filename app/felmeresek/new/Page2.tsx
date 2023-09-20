"use client";
import dynamic from "next/dynamic";
import { Typography } from "@material-tailwind/react";
import { Card } from "@/components/ui/card";
const Heading = dynamic(() => import("@/app/_components/Heading"));
import React from "react";
const AutoComplete = dynamic(() => import("@/app/_components/AutoComplete"));
import { Product } from "@/app/products/page";
import { isJSONParsable } from "../[id]/_clientPage";
import { CheckCircleIcon, MinusCircleIcon, PlusCircleIcon } from "@heroicons/react/20/solid";
import { PencilSquareIcon } from "@heroicons/react/24/outline";
import Counter from "@/app/_components/Counter";
import Input from "@/app/_components/Input";
import { ProductAttributes } from "@/app/products/_clientPage";
import Select from "@/app/_components/Select";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import {
	BaseFelmeresData,
	FelmeresItems,
	OtherFelmeresItems,
	ProductTemplate,
	hufFormatter,
	numberFormatter,
} from "./_clientPage";

export function Page2({
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
	const [isEditingItems, setIsEditingItems] = React.useState(false);
	const [isEditingOtherItems, setIsEditingOtherItems] = React.useState(false);

	const [itemsTableRef] = useAutoAnimate({
		easing: "ease-in-out",
		disrespectUserMotionPreference: false,
		duration: 300,
	});
	const [otherItemsTableRef] = useAutoAnimate();

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
										attributeId: productAttributeData ? productAttributeData.id : 0,
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
	const createNewPlaceOption = async (option: string, id: number) => {
		const resp = await fetch("https://pen.dataupload.xyz/product_attributes/" + id + "/", {
			method: "PATCH",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				place_options: JSON.stringify([...items.find((item) => item.attributeId === id)!.placeOptions, option])
					.replace("[", "{")
					.replace("]", "}"),
			}),
		});
		if (resp.ok) {
			setItems((prev) => [
				...prev.filter((item) => item.attributeId !== id),
				{
					...prev.find((item) => item.attributeId === id),
					placeOptions: [...prev.find((item) => item.attributeId === id)!.placeOptions, option],
				} as FelmeresItems,
			]);
			await fetch("/api/revalidate?tag=product-attributes");
		}
	};

	return (
		<div>
			<Card className='my-5'>
				<div>
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
								<th className='border-b border-blue-gray-100 bg-blue-gray-50 p-4'>
									<PencilSquareIcon
										className='w-5 h-5 cursor-pointer'
										onClick={() => setIsEditingItems(!isEditingItems)}
									/>
								</th>
							</tr>
						</thead>
						<tbody ref={itemsTableRef}>
							{items
								.sort((a, b) => a.productId - b.productId)
								.map(
									(
										{
											name,
											place,
											placeOptions: place_options,
											inputValues,
											netPrice,
											sku,
											attributeId,
										},
										index
									) => {
										const isLast = index === items.length - 1;
										const classes = isLast ? "p-4" : "p-4 border-b border-blue-gray-50";

										return (
											<tr key={name}>
												<td className={classes}>
													<Typography
														variant='small'
														color='blue-gray'
														className='font-normal max-w-[30rem]'>
														<span className='font-bold'>{sku}</span> - {name}
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
																					i.productId !==
																					items[index].productId
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
																		classes +
																		" flex flex-row w-full items-center gap-2"
																	}>
																	<div className='font-normal flex flex-col gap-2 max-w-[17rem]'>
																		<div className='flex-row flex items-center gap-2'>
																			<AutoComplete
																				options={place_options
																					.filter(
																						(option) =>
																							!inputValues
																								.map(
																									(value) =>
																										value.value
																								)
																								.includes(option)
																					)
																					.map((option) => ({
																						label: option,
																						value: option,
																					}))}
																				value={inputValue.value}
																				create={true}
																				resetOnCreate={false}
																				onChange={(e) => {
																					if (!place_options.includes(e)) {
																						createNewPlaceOption(
																							e,
																							attributeId
																						);
																					}
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
																									id:
																										Math.max(
																											...inputValues.map(
																												(
																													value
																												) =>
																													value.id
																											)
																										) + 1,
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
																									items[index]
																										.productId
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
													{isEditingItems ? (
														<MinusCircleIcon
															className='w-7 h-7 text-red-600 cursor-pointer'
															onClick={() =>
																setItems((prev) =>
																	prev.filter((item) => item.name !== name)
																)
															}
														/>
													) : null}
												</td>
											</tr>
										);
									}
								)}
							<tr>
								{!isEditingItems ? null : !isAddingNewItem ? (
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
														label: product.sku + " - " + product.name,
														value: product.id.toString(),
													}))}
												value={items.find((item) => item.productId === 0)?.name || ""}
												onChange={(value) => {
													setItems((prev) => [
														...prev.filter((item) => item.productId.toString() !== value),
														{
															...prev[prev.length - 1],
															adatlap: felmeres.adatlap_id,
															productId: parseInt(value),
															name: products.find(
																(product) => product.id === parseInt(value)
															)!.name,
															sku: products.find(
																(product) => product.id === parseInt(value)
															)!.sku,
															place: productAttributes.find(
																(attribute) => attribute.product === parseInt(value)
															)
																? productAttributes.find(
																		(attribute) =>
																			attribute.product === parseInt(value)
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
																(attribute) => attribute.product === parseInt(value)
															)
																? JSON.parse(
																		(
																			productAttributes.find(
																				(attribute) =>
																					attribute.product ===
																					parseInt(value)
																			)!.place_options as unknown as string
																		).replace(/'/g, '"')
																  )
																: [],
														},
													]);
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
			{/* other items */}
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
										<PencilSquareIcon
											className='w-5 h-5 cursor-pointer'
											onClick={() => setIsEditingOtherItems(!isEditingOtherItems)}
										/>
									</th>
								</tr>
							</thead>
							<tbody ref={otherItemsTableRef}>
								{otherItems
									.sort((a, b) => a.id - b.id)
									.map((item) => (
										<tr key={item.id}>
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
																	value: e.target.value
																		? parseInt(e.target.value.replace(/\D/g, ""))
																		: 0,
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
															? isNaN(item.value)
																? 0
																: item.value
															: ((netTotal +
																	otherItems
																		.filter(
																			(item) =>
																				item.type !== "percent" &&
																				!isNaN(item.value)
																		)
																		.reduce((a, b) => a + b.value, 0)) *
																	item.value) /
																	100
													)}
												</Typography>
											</td>
											<td className='p-4 border-b border-blue-gray-50 w-10'>
												{isEditingOtherItems ? (
													<MinusCircleIcon
														className='w-7 h-7 text-red-600 cursor-pointer'
														onClick={() =>
															setOtherItems((prev) =>
																prev.filter((prevItem) => prevItem.name !== item.name)
															)
														}
													/>
												) : null}
											</td>
										</tr>
									))}
								<tr>
									{!isEditingOtherItems ? null : !isAddingNewOtherItem ? (
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
																id: Math.max(...prev.map((item) => item.id)) + 1,
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
												otherItemsNetTotal * 1.27 +
													netTotal * 1.27 -
													(otherItemsNetTotal * 1.27 + (netTotal * 1.27 * discount) / 100)
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
