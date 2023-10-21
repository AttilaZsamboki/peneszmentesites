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
import { useAutoAnimate } from "@formkit/auto-animate/react";
import {
	BaseFelmeresData,
	FelmeresItem,
	OtherFelmeresItem,
	ProductTemplate,
	QuestionTemplate,
	hufFormatter,
	numberFormatter,
} from "./_clientPage";
import { Template } from "../templates/page";
import DropdownMenu from "../_components/Menu";
import { Button } from "@/components/ui/button";
import { Banknote, Check, Plus, Save, SaveAll } from "lucide-react";
import CustomDialog from "../_components/CustomDialog";
import { createTemplate, updateTemplate } from "../../lib/fetchers";
import { Form } from "../templates/_clientPage";
import { toast } from "@/components/ui/use-toast";
import { OpenCreatedToast } from "@/components/toasts";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { calculatePercentageValue, cn } from "@/lib/utils";
import useBreakpointValue from "../_components/useBreakpoint";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";

export function Page2({
	felmeres,
	setFelmeres,
	originalTemplates,
	items,
	setItems,
	products,
	productAttributes,
	otherItems,
	setOtherItems,
	discount,
	setDiscount,
	readonly,
}: {
	felmeres: BaseFelmeresData;
	setFelmeres?: React.Dispatch<React.SetStateAction<BaseFelmeresData>>;
	originalTemplates?: Template[];
	items: FelmeresItem[];
	setItems?: React.Dispatch<React.SetStateAction<FelmeresItem[]>>;
	products?: Product[];
	productAttributes?: ProductAttributes[];
	otherItems: OtherFelmeresItem[];
	setOtherItems?: React.Dispatch<React.SetStateAction<OtherFelmeresItem[]>>;
	discount: number;
	setDiscount?: React.Dispatch<React.SetStateAction<number>>;
	readonly?: boolean;
}) {
	const [isAddingNewItem, setIsAddingNewItem] = React.useState(false);
	const [isAddingNewOtherMaterial, setIsAddingNewOtherMaterial] = React.useState(false);
	const [isAddingNewOtherItem, setIsAddingNewOtherItem] = React.useState(false);
	const [newOtherItem, setNewOtherItem] = React.useState<OtherFelmeresItem>();
	const [isEditingItems, setIsEditingItems] = React.useState(false);
	const [isEditingOtherMaterials, setIsEditingOtherMaterials] = React.useState(false);
	const [isEditingOtherItems, setIsEditingOtherItems] = React.useState(false);
	const [templates, setTemplates] = React.useState<Template[]>(originalTemplates ?? []);
	const [selectedTemplate, setSelectedTemplate] = React.useState<Template>(
		templates?.find((template) => template.id === felmeres.template) ?? {
			description: "",
			name: "",
			type: "",
			id: 0,
		}
	);
	const [openTemplateDialog, setOpenTemplateDialog] = React.useState(false);

	const deviceSize = useBreakpointValue();

	const [otherItemsTableRef] = useAutoAnimate();
	const [otherMaterialTableRef] = useAutoAnimate();

	const fetchTemplateItems = async (felmeres: BaseFelmeresData) => {
		if (!setItems) return;
		const templateId = felmeres.template;
		const productTemplateRes = await fetch("https://pen.dataupload.xyz/product_templates/" + templateId);
		if (productTemplateRes.ok) {
			const productTemplates: ProductTemplate[] = await productTemplateRes.json();
			productTemplates
				.filter(
					(productTemplate) =>
						!items
							.filter(
								(item) =>
									item.inputValues.map((value) => value.ammount).reduce((a, b) => a + b, 0) !== 0
							)
							.map((item) => item.product)
							.includes(productTemplate.product)
				)
				.map(async (productTemplate) => {
					const productResp = await fetch("https://pen.dataupload.xyz/products/" + productTemplate.product);
					if (productResp.ok) {
						const productData: Product = await productResp.json();
						const productAttributeResp = await fetch(
							"https://pen.dataupload.xyz/product_attributes/" + productTemplate.product
						);
						if (productAttributeResp.ok) {
							const productAttributeData = await productAttributeResp.json().then((data) => data[0]);
							setItems((prevItems) => [
								...prevItems,
								{
									id: prevItems.length ? Math.max(...prevItems.map((item) => item.id ?? 0)) + 1 : 0,
									product: productTemplate.product,
									name: productData.name,
									place: productAttributeData ? productAttributeData.place : true,
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
									type: "Item",
									valueType: "fixed",
									source: "Template",
									category: productData.category ?? "",
								},
							]);
						}
					}
				});
		}
	};

	const TABLE_HEAD_ITEMS =
		deviceSize === "sm"
			? ["SKU", "Darab + Hely", "Nettó egységár", "Nettó összesen"]
			: ["SKU", "Név", "Darab + Hely", "Nettó egységár", "Nettó összesen"];
	const TABLE_HEAD_OTHER = ["Név", "Nettó egységár", "Nettó összesen"];
	const TABLE_HEAD_OTHER_MATERIAL = ["Név", "Darab", "Nettó egységár", "Nettó összesen"];

	const netTotal = (type?: "Other Material" | "Item") => {
		return items
			.filter((item) => (type ? item.type === type : true))
			.map(({ inputValues, netPrice }) => netPrice * inputValues.reduce((a, b) => a + b.ammount, 0))
			.reduce((a, b) => a + b, 0);
	};
	const otherItemsNetTotal = otherItems
		.filter((item) => !isNaN(item.value))
		.map((item) =>
			item.type === "fixed"
				? item.value
				: (netTotal() +
						otherItems
							.filter((item) => item.type !== "percent" && !isNaN(item.value))
							.reduce((a, b) => a + b.value, 0)) *
				  (item.value / 100)
		)
		.reduce((a, b) => a + b, 0);
	const createNewPlaceOption = async (option: string, id: number, productId: number) => {
		if (!option || !setItems) return;
		if (id) {
			const resp = await fetch("https://pen.dataupload.xyz/product_attributes/" + id + "/", {
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					place_options: JSON.stringify([
						...items.find((item) => item.attributeId === id)!.placeOptions,
						option,
					])
						.replace("[", "{")
						.replace("]", "}"),
				}),
			});
			if (resp.ok) {
				setItems((prev) => {
					return [
						...prev.filter((item) => item.attributeId !== id),
						{
							...prev.find((item) => item.attributeId === id),
							placeOptions: [...prev.find((item) => item.attributeId === id)!.placeOptions, option],
						} as FelmeresItem,
					];
				});
			}
		} else {
			const resp = await fetch("https://pen.dataupload.xyz/product_attributes", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					product: items.find((item) => item.product === productId)!.product,
					place: true,
					place_options: JSON.stringify([option]).replace("[", "{").replace("]", "}"),
				}),
			});
			if (resp.ok) {
				const data = await resp.json();
				setItems((prev) => [
					...prev.filter((item) => item.product !== productId),
					{
						...prev.find((item) => item.product === productId),
						attributeId: data.id,
						placeOptions: [...prev.find((item) => item.product === productId)!.placeOptions, option],
					} as FelmeresItem,
				]);
			}
		}
	};
	const onSelectTemplate = async () => {
		const newFelmeres = {
			...felmeres,
			template: templates!.find((template) => template.id === selectedTemplate.id)!
				? templates!.find((template) => template.id === selectedTemplate.id)!.id
				: 0,
		};
		setFelmeres ? setFelmeres(newFelmeres) : null;
		if (!setItems) return;
		setItems((prev) => prev.filter((item) => item.source !== "Template"));
		await fetchTemplateItems(newFelmeres);
	};
	const saveTemplate = async () => {
		const response = await updateTemplate(
			selectedTemplate,
			items.map((item) => item.product.toString())
		);
		if (response.ok) {
			toast({
				title: "Sablon sikeresen frissítve",
				action: <Check className='w-5 h-5 text-green-700' />,
				duration: 1000,
			});
			return;
		}
		toast({
			title: "Sablon frissítése sikertelen",
			description: "Kérlek próbáld újra később",
			variant: "destructive",
			duration: 2000,
		});
	};

	return (
		<>
			{openTemplateDialog ? (
				<CustomDialog
					open={openTemplateDialog}
					handler={() => {
						setOpenTemplateDialog(!openTemplateDialog);
					}}
					title='Új sablon'
					disabledSubmit={
						!selectedTemplate.name ||
						!selectedTemplate.type ||
						!selectedTemplate.description ||
						!items.length
					}
					onSave={async () => {
						if (!setFelmeres) return;
						const jsonResp = await createTemplate(
							items.map((item) => (item.product ?? 0).toString()),
							selectedTemplate
						);
						setFelmeres((prev) => ({ ...prev, template: jsonResp.id }));
						setSelectedTemplate((prev) => ({ ...prev, id: jsonResp.id }));
						setTemplates((prev) => [...prev, jsonResp]);
						toast({
							title: "Sablon sikeresen létrehozva",
							description: (
								<OpenCreatedToast path={"/templates"} query={{ id: jsonResp.id }} inNewTab={true} />
							),
						});
					}}>
					<Form
						items={items.map((item) => (item.product ?? 0).toString())}
						products={products ?? []}
						onClickAddItem={(e) => {
							if (!setItems) return;
							setItems((prev) => [
								...prev,
								{
									product: parseInt(e),
									name: products!.find((product) => product.id.toString() === e)!.name,
									place: false,
									placeOptions: [],
									inputValues: [{ value: "", id: 0, ammount: 0 }],
									netPrice: products!.find((product) => product.id.toString() === e)!
										.price_list_alapertelmezett_net_price_huf,
									adatlap: felmeres.adatlap_id,
									sku: products!.find((product) => product.id.toString() === e)!.sku,
									attributeId: 0,
									type: "Item",
									valueType: "fixed",
									source: "Template",
									category: "",
									id: Math.max(...prev.map((item) => item.id ?? 0)) + 1,
								},
							]);
						}}
						onClickDeleteItem={(e) => {
							if (!setItems) return;
							setItems((prev) => prev.filter((item) => item.product.toString() !== e));
						}}
						setTemplate={setSelectedTemplate}
						template={{ ...selectedTemplate, id: 0 }}
					/>
				</CustomDialog>
			) : null}
			<div id='Tételek'>
				<Heading title='Tételek' variant='h5' marginY='lg:my-4' border={false} />
				<div className='flex flex-row justify-between w-full items-start flex-wrap'>
					<div className='flex flex-row gap-4 items-center'>
						<div className='flex flex-row items-center gap-2 flex-wrap'>
							<QuestionTemplate title='Milyen rendszert tervezel?'>
								<AutoComplete
									disabled={readonly}
									options={[
										"Helyi elszívós rendszer",
										"Központi ventillátoros",
										"Passzív rendszer",
										"Hővisszanyerős",
									].map((option) => ({
										label: option,
										value: option,
									}))}
									value={felmeres.type}
									onSelect={(e) => {
										setFelmeres ? setFelmeres({ ...felmeres, type: e, template: 0 }) : null;
										setSelectedTemplate({
											description: "",
											name: "",
											type: "",
											id: 0,
										});
									}}
								/>
							</QuestionTemplate>
							<QuestionTemplate title='Sablon'>
								<div className='flex flex-row items-center gap-2'>
									<AutoComplete
										disabled={readonly}
										width='300px'
										options={templates!
											.filter((template) => template.type === felmeres.type)
											.map((template) => ({
												label: template.name,
												value: template.id.toString(),
											}))}
										onSelect={(e) => {
											if (templates) {
												if (templates.find((template) => template.id.toString() === e)) {
													setSelectedTemplate(
														templates.find((template) => template.id.toString() === e)!
													);
													setFelmeres
														? setFelmeres((prev) => ({
																...prev,
																subject: templates.find(
																	(template) => template.id.toString() === e
																)!.description,
														  }))
														: null;
												}
											}
										}}
										value={selectedTemplate.name}
									/>
									<div className='mt-0 lg:mt-3'>
										{readonly ? null : felmeres.template !== selectedTemplate.id ? (
											<Button size='icon' variant='outline' onClick={onSelectTemplate}>
												<Plus className='w-4 h-4 text-gray-700' />
											</Button>
										) : (
											<DropdownMenu
												dropdownMenuItems={
													felmeres.template
														? [
																{
																	value: "Mentés",
																	onClick: saveTemplate,
																	icon: <Save className='w-5 h-5 mr-2' />,
																	shortcut: "ctrl+shift+s",
																},
																{
																	value: "Mentés másként",
																	onClick: () => setOpenTemplateDialog(true),
																	icon: <SaveAll className='w-5 h-5 mr-2' />,
																	shortcut: "f4",
																},
														  ]
														: [
																{
																	value: "Mentés mint új sablon",
																	onClick: () => setOpenTemplateDialog(true),
																	icon: <SaveAll className='w-5 h-5 mr-2' />,
																	shortcut: "f4",
																},
														  ]
												}
											/>
										)}
									</div>
								</div>
							</QuestionTemplate>
						</div>
					</div>

					<div className='grid w-full lg:w-1/3 gap-1.5'>
						<Label htmlFor='subject'>Tárgy</Label>

						<Textarea
							id='subject'
							onBlur={() => {
								if (selectedTemplate.id) {
									setTimeout(async () => {
										if (selectedTemplate.description === felmeres.subject) return;
										const resp = await fetch(
											"https://pen.dataupload.xyz/templates/" + selectedTemplate.id + "/",
											{
												method: "PATCH",
												headers: {
													"Content-Type": "application/json",
												},
												body: JSON.stringify({
													description: felmeres.subject,
												}),
											}
										);
										if (resp.ok) {
											toast({
												title: "Leírás sikeresen frissítve",
												action: <Check className='w-5 h-5 text-green-700' />,
												duration: 1000,
											});
											setSelectedTemplate((prev) => ({
												...prev,
												description: felmeres.subject,
											}));
											return;
										}
										toast({
											title: "Leírás frissítése sikertelen",
											description: "Kérlek próbáld újra később",
											variant: "destructive",
											duration: 2000,
										});
									}, 500);
								}
							}}
							disabled={readonly}
							value={felmeres.subject}
							onChange={(e) => {
								setFelmeres
									? setFelmeres((prev) => ({ ...prev, subject: e.target.value ?? "" }))
									: null;
							}}
						/>
						<p className='text-sm text-muted-foreground'>Az ajánlat tárgya.</p>
					</div>
				</div>
				<Card className='my-5'>
					<div className='w-full overflow-x-auto rounded-md'>
						<table className='w-full min-w-max table-auto text-left max-w-20 overflow-x-scroll border-separate border-spacing-0'>
							<thead>
								<tr>
									{TABLE_HEAD_ITEMS.map((head, index) => (
										<th
											key={head}
											className={cn(
												index === 0 ? "sticky left-0 z-10 border-r" : "",
												"border-b border-blue-gray-100 bg-blue-gray-50 p-4 "
											)}>
											<Typography
												variant='small'
												color='blue-gray'
												className={"font-normal leading-none opacity-70"}>
												{head}
											</Typography>
										</th>
									))}
									{!readonly ? (
										<th className='border-b border-blue-gray-100 bg-blue-gray-50 p-4'>
											<PencilSquareIcon
												className='w-5 h-5 cursor-pointer'
												onClick={() => setIsEditingItems(!isEditingItems)}
											/>
										</th>
									) : null}
								</tr>
							</thead>
							<tbody className=''>
								{items
									.filter((item) => item.type === "Item")
									.sort((a, b) => (a.id ?? 0) - (b.id ?? 0))
									.map(
										({
											name,
											place,
											placeOptions: place_options,
											inputValues,
											netPrice,
											sku,
											attributeId,
											product,
										}) => {
											const classes = "p-4 ";

											return (
												<>
													<HoverCard>
														<HoverCardContent className='w-80 z-[99999]'>
															<div className='flex justify-between space-x-4'>
																<div className='space-y-1'>
																	<h4 className='text-sm font-semibold'>{sku}</h4>
																	<p className='text-sm'>{name}</p>
																	<div className='flex items-center pt-2'>
																		<Banknote className='mr-2 h-4 w-4 opacity-70' />{" "}
																		<span className='text-xs text-muted-foreground'>
																			{hufFormatter.format(netPrice)}
																		</span>
																	</div>
																</div>
															</div>
														</HoverCardContent>
														<tr key={name} className='border-b border-blue-gray-50'>
															<th
																className={cn(
																	"table-cell bg-white sticky z-[1] left-0 border-r",
																	classes
																)}>
																<HoverCardTrigger asChild>
																	<Button
																		variant='link'
																		className='text-black active:text-black hover:text-black hover:no-underline active:no-underline'>
																		{sku}
																	</Button>
																</HoverCardTrigger>
															</th>
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
																	<div
																		key={inputValue.id}
																		className='flex flex-row items-center'>
																		<td className={classes}>
																			{readonly ? (
																				<Typography
																					variant='small'
																					color='blue-gray'
																					className='font-normal w-80 flex flex-row gap-4 '>
																					<span className='break-keep '>
																						{inputValue.ammount} darab
																					</span>
																					{place ? (
																						<>
																							-
																							<span className='w-2/3'>
																								{inputValue.value}
																							</span>
																						</>
																					) : null}
																				</Typography>
																			) : (
																				<Counter
																					maxWidth='max-w-[10rem]'
																					value={inputValue.ammount}
																					onChange={(value) =>
																						!setItems
																							? null
																							: setItems([
																									...items.filter(
																										(i) =>
																											i.product !==
																											product
																									),
																									{
																										...items.find(
																											(i) =>
																												i.product ===
																												product
																										)!,
																										inputValues: [
																											...inputValues.filter(
																												(
																													value
																												) =>
																													value.id !==
																													inputValue.id
																											),
																											{
																												...inputValue,
																												ammount:
																													value,
																											},
																										],
																									},
																							  ])
																					}
																				/>
																			)}
																		</td>
																		{place ? (
																			<td
																				className={
																					classes +
																					" flex flex-row w-full items-center gap-2"
																				}>
																				<div className='font-normal flex flex-col gap-2 max-w-[17rem]'>
																					<div className='flex-row flex items-center gap-2'>
																						{readonly ? null : (
																							<>
																								<AutoComplete
																									options={place_options.map(
																										(option) => ({
																											label: option,
																											value: option,
																										})
																									)}
																									width='300px'
																									value={
																										inputValue.value
																									}
																									create={true}
																									onSelect={(e) => {
																										if (
																											!place_options.includes(
																												e
																											)
																										) {
																											createNewPlaceOption(
																												e,
																												attributeId,
																												product
																											);
																										}
																										if (!setItems)
																											return;
																										setItems([
																											...items.filter(
																												(
																													item
																												) =>
																													item.product !==
																													product
																											),
																											{
																												...items.find(
																													(
																														item
																													) =>
																														item.product ===
																														product
																												)!,
																												inputValues:
																													[
																														...inputValues.filter(
																															(
																																value
																															) =>
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
																										!setItems
																											? null
																											: setItems([
																													...items.filter(
																														(
																															item
																														) =>
																															item.product !==
																															product
																													),
																													{
																														...items.find(
																															(
																																item
																															) =>
																																item.product ===
																																product
																														)!,
																														inputValues:
																															[
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
																																		) +
																																		1,
																																	ammount: 0,
																																},
																															],
																													},
																											  ])
																									}
																								/>
																							</>
																						)}
																						{!readonly &&
																						inputValues.length > 1 ? (
																							<MinusCircleIcon
																								className='w-7 h-7 cursor-pointer'
																								onClick={() => {
																									if (!setItems)
																										return;
																									setItems([
																										...items.filter(
																											(item) =>
																												item.product !==
																												product
																										),
																										{
																											...items.find(
																												(
																													item
																												) =>
																													item.product ===
																													product
																											)!,
																											inputValues:
																												[
																													...inputValues.filter(
																														(
																															value
																														) =>
																															value.id !==
																															inputValue.id
																													),
																												],
																										},
																									]);
																								}}
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
																		netPrice *
																			inputValues.reduce(
																				(a, b) => a + b.ammount,
																				0
																			)
																	)}
																</Typography>
															</td>
															{!readonly ? (
																<td className={classes}>
																	{isEditingItems ? (
																		<MinusCircleIcon
																			className='w-7 h-7 text-red-600 cursor-pointer'
																			onClick={() =>
																				!setItems
																					? null
																					: setItems((prev) =>
																							prev.filter(
																								(item) =>
																									item.name !== name
																							)
																					  )
																			}
																		/>
																	) : null}
																</td>
															) : null}
														</tr>
													</HoverCard>
												</>
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
											<td className='p-4 border-b border-blue-gray-50 border-r sticky left-0'>
												<AutoComplete
													width={deviceSize !== "sm" ? "300px" : "200px"}
													options={
														!products
															? []
															: products
																	.filter(
																		(product) =>
																			!items
																				.map((item) => item.product)
																				.includes(product.id)
																	)
																	.sort((a, b) => a.sku.localeCompare(b.sku))
																	.map((product) => ({
																		label: product.sku + " - " + product.name,
																		value: product.id.toString(),
																	}))
													}
													value={items.find((item) => item.product === 0)?.name || ""}
													onSelect={(value) => {
														if (!setItems || !products || !productAttributes) return;
														const product = products.find(
															(product) => product.id === parseInt(value)
														)!;
														const productAttribute = productAttributes.find(
															(attribute) => attribute.product === parseInt(value)
														);
														if (!product) return;
														setItems((prev) => [
															...prev.filter((item) => item.product.toString() !== value),
															{
																...prev[prev.length - 1],
																id: prev.length
																	? Math.max(...prev.map((item) => item.id ?? 0)) + 1
																	: 0,
																adatlap: felmeres.adatlap_id,
																product: parseInt(value),
																name: product.name,
																sku: product.sku,
																place: productAttribute
																	? productAttribute!.place
																	: true,
																inputValues: [
																	{
																		value: "",
																		id: 0,
																		ammount: 0,
																	},
																],
																netPrice:
																	product.price_list_alapertelmezett_net_price_huf,
																source: "Manual",
																type: "Item",
																attributeId: productAttribute
																	? productAttribute!.id ?? 0
																	: 0,
																placeOptions: productAttribute
																	? JSON.parse(
																			(
																				productAttribute!
																					.place_options as unknown as string
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
									<td
										className='border-b border-r sticky left-0 border-blue-gray-100 bg-blue-gray-50 p-4 z-10'
										style={{ borderTopWidth: 0 }}>
										<Typography
											variant='small'
											color='blue-gray'
											className='font-normal leading-none opacity-70 z-[1]'>
											Össz:
										</Typography>
									</td>
									<td className='border-b border-blue-gray-100 bg-blue-gray-50 p-4'></td>
									<td className='border-b border-blue-gray-100 bg-blue-gray-50 p-4'></td>
									<td className='border-b border-blue-gray-100 bg-blue-gray-50 p-4'></td>
									<td className='border-b border-blue-gray-100 bg-blue-gray-50 p-4'>
										<Typography
											variant='small'
											color='blue-gray'
											className='font-normal leading-none opacity-70'>
											{hufFormatter.format(netTotal("Item"))}
										</Typography>
									</td>
									{readonly ? null : (
										<td className='border-b border-blue-gray-100 bg-blue-gray-50 p-4'></td>
									)}
								</tr>
							</tfoot>
						</table>
					</div>
				</Card>
				{/* other items */}
				<div className='mt-8'>
					<Heading title='Díjak' variant='h5' marginY='lg:my-4' border={false} />
					<Card>
						<div className='w-full lg:overflow-hidden overflow-x-scroll rounded-md'>
							<table className='w-full min-w-max table-auto text-left max-w-20 overflow-x-scroll'>
								<thead>
									<tr>
										{TABLE_HEAD_OTHER.map((head) => (
											<th
												key={head}
												className='border-b border-blue-gray-100 bg-blue-gray-50 p-4'>
												<Typography
													variant='small'
													color='blue-gray'
													className='font-normal leading-none opacity-70'>
													{head}
												</Typography>
											</th>
										))}
										{!readonly ? (
											<th className='border-b border-blue-gray-100 bg-blue-gray-50 p-4'>
												<PencilSquareIcon
													className='w-5 h-5 cursor-pointer'
													onClick={() => setIsEditingOtherItems(!isEditingOtherItems)}
												/>
											</th>
										) : null}
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
													{readonly && item.type === "fixed" ? null : (
														<div className='relative'>
															{readonly ? (
																<Typography
																	variant='small'
																	color='blue-gray'
																	className='font-normal max-w-[30rem]'>
																	{item.type === "percent" ? (
																		<div>
																			{item.value}{" "}
																			<span className='font-extralight text-gray-500'>
																				%
																			</span>
																		</div>
																	) : (
																		numberFormatter.format(item.value)
																	)}
																</Typography>
															) : (
																<>
																	<Input
																		variant='simple'
																		value={
																			item.type === "percent" ||
																			item.value === ("-" as unknown as number)
																				? item.value
																				: numberFormatter.format(item.value)
																		}
																		onChange={(e) => {
																			if (!setOtherItems) return;
																			setOtherItems((prev) => [
																				...prev.filter(
																					(prevItem) =>
																						item.id !== prevItem.id
																				),
																				{
																					...prev.find(
																						(prevItem) =>
																							prevItem.id === item.id
																					)!,
																					value: e.target.value
																						? e.target.value === "-"
																							? ("-" as unknown as number)
																							: parseInt(
																									e.target.value.replace(
																										/[^\d-]/g,
																										""
																									)
																							  )
																						: 0,
																				},
																			]);
																		}}
																	/>
																	<Typography
																		variant='small'
																		className={`font-extralight text-gray-500 absolute top-2
																		} right-2 max-w-[30rem]`}>
																		{item.type === "percent" ? "%" : "Ft"}
																	</Typography>
																</>
															)}
														</div>
													)}
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
																: calculatePercentageValue(
																		netTotal(),
																		otherItems,
																		item.value
																  )
														)}
													</Typography>
												</td>
												{!readonly ? (
													<td className='p-4 border-b border-blue-gray-50 w-10'>
														{isEditingOtherItems ? (
															<MinusCircleIcon
																className='w-7 h-7 text-red-600 cursor-pointer'
																onClick={() =>
																	!setOtherItems
																		? null
																		: setOtherItems((prev) =>
																				prev.filter(
																					(prevItem) =>
																						prevItem.name !== item.name
																				)
																		  )
																}
															/>
														) : null}
													</td>
												) : null}
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
																	...(prev as OtherFelmeresItem),
																	name: e.target.value,
																}));
															}}
														/>
														<AutoComplete
															width='300px'
															label='Típus'
															onSelect={(value) => {
																setNewOtherItem((prev) => ({
																	...(prev as OtherFelmeresItem),
																	type: value as "fixed" | "percent",
																}));
															}}
															options={[
																{ value: "fixed", label: "Összeg" },
																{ value: "percent", label: "Százalék" },
															]}
															value={
																newOtherItem
																	? newOtherItem.type === "fixed"
																		? "Összeg"
																		: "Százalék"
																	: ""
															}
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
															if (!setOtherItems) return;
															setOtherItems((prev) => [
																...prev,
																{
																	...(newOtherItem as OtherFelmeresItem),
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
										{readonly ? null : (
											<td className='border-b border-blue-gray-100 bg-blue-gray-50 p-4'></td>
										)}
									</tr>
								</tfoot>
							</table>
						</div>
					</Card>
				</div>
				{/* other material */}
				<div className='mt-8'>
					<Heading title='Szerelési segédanyagok' variant='h5' marginY='lg:my-4' border={false} />
					<Card className='my-5'>
						<div className='w-full lg:overflow-hidden overflow-x-scroll rounded-md'>
							<table className='w-full min-w-max table-auto text-left max-w-20 overflow-x-scroll'>
								<thead>
									<tr>
										{TABLE_HEAD_OTHER_MATERIAL.map((head) => (
											<th
												key={head}
												className='border-b border-blue-gray-100 bg-blue-gray-50 p-4'>
												<Typography
													variant='small'
													color='blue-gray'
													className='font-normal leading-none opacity-70'>
													{head}
												</Typography>
											</th>
										))}
										{!readonly ? (
											<th className='border-b border-blue-gray-100 bg-blue-gray-50 p-4'>
												<PencilSquareIcon
													className='w-5 h-5 cursor-pointer'
													onClick={() => setIsEditingOtherMaterials(!isEditingOtherMaterials)}
												/>
											</th>
										) : null}
									</tr>
								</thead>
								<tbody ref={otherMaterialTableRef}>
									{items
										.filter((item) => item.type === "Other Material")
										.sort((a, b) => a.product - b.product)
										.map(({ name, inputValues, netPrice, sku, product }) => {
											const classes = "p-4";

											return (
												<tr key={name} className='border-b border-blue-gray-50'>
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
															<div
																key={inputValue.id}
																className='flex flex-row items-center'>
																<td className={classes}>
																	{readonly ? (
																		<Typography
																			variant='small'
																			color='blue-gray'
																			className='font-normal w-80 flex flex-row gap-4 '>
																			<span className='break-keep '>
																				{inputValue.ammount} darab
																			</span>
																		</Typography>
																	) : (
																		<Counter
																			maxWidth='max-w-[10rem]'
																			value={inputValue.ammount}
																			onChange={(value) => {
																				!setItems
																					? null
																					: setItems([
																							...items.filter(
																								(i) =>
																									i.product !==
																									product
																							),
																							{
																								...items.find(
																									(i) =>
																										i.product ===
																										product
																								)!,
																								inputValues: [
																									...inputValues.filter(
																										(value) =>
																											value.id !==
																											inputValue.id
																									),
																									{
																										...inputValue,
																										ammount: value,
																									},
																								],
																							},
																					  ]);
																			}}
																		/>
																	)}
																</td>
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
																netPrice *
																	inputValues.reduce((a, b) => a + b.ammount, 0)
															)}
														</Typography>
													</td>
													{!readonly ? (
														<td className={classes}>
															{isEditingOtherMaterials ? (
																<MinusCircleIcon
																	className='w-7 h-7 text-red-600 cursor-pointer'
																	onClick={() =>
																		!setItems
																			? null
																			: setItems((prev) =>
																					prev.filter(
																						(item) => item.name !== name
																					)
																			  )
																	}
																/>
															) : null}
														</td>
													) : null}
												</tr>
											);
										})}
									<tr>
										{!isEditingOtherMaterials ? null : !isAddingNewOtherMaterial ? (
											<>
												<td></td>
												<td></td>
												<td></td>
												<td></td>
												<td className='p-4 border-b border-blue-gray-50'>
													<PlusCircleIcon
														className='w-7 h-7 text-green-600 cursor-pointer'
														onClick={() => {
															setIsAddingNewOtherMaterial(true);
														}}
													/>
												</td>
											</>
										) : (
											<>
												<td className='p-4 border-b border-blue-gray-50'>
													<AutoComplete
														side='bottom'
														width='300px'
														options={
															!products
																? []
																: products
																		.filter(
																			(product) =>
																				!items

																					.map((item) => item.product)
																					.includes(product.id)
																		)
																		.filter(
																			(item) =>
																				item.category ===
																				"Egyéb szerelési anyag"
																		)
																		.map((product) => ({
																			label: product.sku + " - " + product.name,
																			value: product.id.toString(),
																		}))
														}
														value={items.find((item) => item.product === 0)?.name || ""}
														onSelect={(value) => {
															if (!setItems || !products || !productAttributes) return;
															const product = products.find(
																(product) => product.id === parseInt(value)
															)!;
															const productAttribute = productAttributes.find(
																(attribute) => attribute.product === parseInt(value)
															);
															if (!product) return;
															setItems((prev) => [
																...prev.filter(
																	(item) => item.product.toString() !== value
																),
																{
																	...prev[prev.length - 1],
																	adatlap: felmeres.adatlap_id,
																	product: parseInt(value),
																	name: product.name,
																	sku: product.sku,
																	place: productAttribute
																		? productAttribute!.place
																		: true,
																	inputValues: [
																		{
																			value: "",
																			id: 0,
																			ammount: 0,
																		},
																	],
																	netPrice:
																		product.price_list_alapertelmezett_net_price_huf,
																	source: "Manual",
																	type: "Other Material",
																	attributeId: productAttribute
																		? productAttribute!.id ?? 0
																		: 0,
																	placeOptions: productAttribute
																		? JSON.parse(
																				(
																					productAttribute!
																						.place_options as unknown as string
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
														onClick={() => setIsAddingNewOtherMaterial(false)}
													/>
												</td>
											</>
										)}
									</tr>
								</tbody>
								<tfoot className='bg-gray'>
									<tr>
										<td
											className='border-b border-blue-gray-100 bg-blue-gray-50 p-4'
											style={{ borderTopWidth: 0 }}>
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
												{hufFormatter.format(netTotal("Other Material"))}
											</Typography>
										</td>
										{readonly ? null : (
											<td className='border-b border-blue-gray-100 bg-blue-gray-50 p-4'></td>
										)}
									</tr>
								</tfoot>
							</table>
						</div>
					</Card>
				</div>
				<div className='mt-8'>
					<Heading title='Összesítés' variant='h5' marginY='lg:my-4' border={false} />
					<Card>
						<div className='w-full lg:overflow-hidden overflow-x-scroll rounded-md'>
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
												{hufFormatter.format(netTotal("Item"))}
											</Typography>
										</td>
										<td className='p-4 border-b border-blue-gray-50'>
											<Typography
												variant='small'
												color='blue-gray'
												className='font-normal max-w-[30rem]'>
												{hufFormatter.format(netTotal("Item") * 0.27)}
											</Typography>
										</td>
										<td className='p-4 border-b border-blue-gray-50'>
											<Typography
												variant='small'
												color='blue-gray'
												className='font-normal max-w-[30rem]'>
												{hufFormatter.format(netTotal("Item") * 1.27)}
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
												Egyéb szerelési segédanyagok
											</Typography>
										</td>
										<td className='p-4 border-b border-blue-gray-50'>
											<Typography
												variant='small'
												color='blue-gray'
												className='font-normal max-w-[30rem]'>
												{hufFormatter.format(netTotal("Other Material"))}
											</Typography>
										</td>
										<td className='p-4 border-b border-blue-gray-50'>
											<Typography
												variant='small'
												color='blue-gray'
												className='font-normal max-w-[30rem]'>
												{hufFormatter.format(netTotal("Other Material") * 0.27)}
											</Typography>
										</td>
										<td className='p-4 border-b border-blue-gray-50'>
											<Typography
												variant='small'
												color='blue-gray'
												className='font-normal max-w-[30rem]'>
												{hufFormatter.format(netTotal("Other Material") * 1.27)}
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
										<td className='p-4 border-b pr-8 border-blue-gray-50 w-60'>
											<div className=''>
												{readonly ? (
													<div className='font-extralight text-gray-500 flex flex-row items-center gap-2'>
														<Typography
															variant='small'
															color='blue-gray'
															className='font-normal max-w-[30rem]'>
															{discount}
															<span>%</span>
														</Typography>
														<Typography
															variant='small'
															className={`font-extralight text-gray-500 `}>
															(
															{hufFormatter.format(
																(otherItemsNetTotal * 1.27 + netTotal() * 1.27) *
																	(discount / 100)
															)}
															)
														</Typography>
													</div>
												) : (
													<div className='font-extralight text-gray-500 flex flex-row items-center gap-2'>
														<div className='relative'>
															<Input
																variant='simple'
																value={discount}
																onChange={(e) => {
																	if (!setDiscount) return;
																	setDiscount(
																		parseInt(e.target.value.replace(/\D/g, "")) <=
																			100
																			? parseInt(
																					e.target.value.replace(/\D/g, "")
																			  )
																			: 0
																	);
																}}
															/>
															<Typography
																variant='small'
																className={`font-extralight text-gray-500 absolute right-2 top-2 `}>
																%
															</Typography>
														</div>

														<Typography
															variant='small'
															className={`font-extralight text-gray-500 `}>
															(
															{hufFormatter.format(
																(otherItemsNetTotal * 1.27 + netTotal() * 1.27) *
																	(discount / 100)
															)}
															)
														</Typography>
													</div>
												)}
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
												{hufFormatter.format(otherItemsNetTotal + netTotal())}
											</Typography>
										</td>
										<td className='border-b border-blue-gray-100 bg-blue-gray-50 p-4'>
											<Typography
												variant='small'
												color='blue-gray'
												className='font-normal leading-none opacity-70'>
												{hufFormatter.format(otherItemsNetTotal * 0.27 + netTotal() * 0.27)}
											</Typography>
										</td>
										<td className='border-b border-blue-gray-100 bg-blue-gray-50 p-4'>
											<Typography
												variant='small'
												color='blue-gray'
												className='font-normal leading-none opacity-70'>
												{hufFormatter.format(
													otherItemsNetTotal * 1.27 +
														netTotal() * 1.27 -
														((otherItemsNetTotal * 1.27 + netTotal() * 1.27) * discount) /
															100
												)}
											</Typography>
										</td>
									</tr>
								</tfoot>
							</table>
						</div>
					</Card>
				</div>
				<div className='mt-8'>
					<Label htmlFor='description'>Megjegyzés</Label>
					<Textarea
						id='description'
						onChange={(e) =>
							setFelmeres ? setFelmeres((prev) => ({ ...prev, description: e.target.value })) : null
						}
						disabled={readonly}
						value={felmeres.description || ""}
					/>
					<p className='text-sm text-muted-foreground'>A szöveg rákerül az ajánlatra</p>
				</div>
			</div>
		</>
	);
}
