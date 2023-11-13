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
import { ProductAttributes } from "@/app/products/_clientPage";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import {
	BaseFelmeresData,
	FelmeresItem,
	FelmeresMunkadíj,
	OtherFelmeresItem,
	ProductTemplate,
	QuestionTemplate,
	hufFormatter,
	numberFormatter,
} from "./_clientPage";
import { Template } from "../templates/page";
import DropdownMenu from "../_components/Menu";
import { Button } from "@/components/ui/button";
import { Banknote, Check, Plus, Save, SaveAll, Trash, Trash2 } from "lucide-react";
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
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { Munkadíj } from "../munkadij/page";
import { Input } from "@/components/ui/input";
import {} from "@radix-ui/react-alert-dialog";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

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
	munkadíjak,
	felmeresMunkadíjak,
	setFelmeresMunkadíjak,
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
	munkadíjak: Munkadíj[];
	felmeresMunkadíjak: FelmeresMunkadíj[];
	setFelmeresMunkadíjak?: React.Dispatch<React.SetStateAction<FelmeresMunkadíj[]>>;
}) {
	const [newOtherItem, setNewOtherItem] = React.useState<OtherFelmeresItem>();
	const [isEditingItems, setIsEditingItems] = React.useState(!readonly);
	const [isEditingOtherMaterials, setIsEditingOtherMaterials] = React.useState(true);
	const [isEditingOtherItems, setIsEditingOtherItems] = React.useState(!readonly);
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
									sort_number: prevItems.length
										? Math.max(...prevItems.map((item) => item.sort_number ?? 0)) + 1
										: 0,
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

	const TABLE_HEAD_ITEMS = ["SKU", "Darab + Hely", "Nettó egységár", "Nettó összesen"];
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

	const munkadíjNetTotal = felmeresMunkadíjak.map((fee) => fee.value * fee.ammount).reduce((a, b) => a + b, 0);
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
									sort_number: Math.max(...prev.map((item) => item.sort_number ?? 0)) + 1,
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
				{!readonly ? (
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
											inputWidth='300px'
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
										<div>
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
												await fetch("/api/revalidate?tag=templates");
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
				) : null}
				<Accordion type='multiple'>
					<AccordionItem value='Tételek'>
						<AccordionTrigger>Tételek</AccordionTrigger>
						<AccordionContent>
							<CustomItemTable
								products={products?.filter((item) => item.category !== "Egyéb szerelési anyag")}
								type='Item'
								headers={TABLE_HEAD_ITEMS}
								items={items.filter((item) => item.type === "Item")}
								setIsEditingItems={setIsEditingItems}
								setItems={setItems}
							/>
						</AccordionContent>
					</AccordionItem>
					<AccordionItem value='Munkadíjak'>
						<AccordionTrigger>Munkadíjak</AccordionTrigger>
						<AccordionContent>
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Típus</TableHead>
										<TableHead>Leírás</TableHead>
										<TableHead className='w-[60px] '>Darab</TableHead>
										<TableHead className='w-[100px] '>Nettó egységár</TableHead>
										<TableHead className='text-right'>Nettó összesen</TableHead>
										{readonly ? null : <TableHead className='w-[10px]'></TableHead>}
									</TableRow>
								</TableHeader>
								<TableBody>
									{felmeresMunkadíjak
										.sort((a, b) => (a.order_id ?? a.id!) - (b.order_id ?? a.id!))
										.map((fee) => {
											const munkadíj = munkadíjak.find(
												(munkadíj) => munkadíj.id === fee.munkadij
											)!;
											return (
												<TableRow key={fee.id}>
													<TableCell className='font-medium'>{munkadíj.type}</TableCell>
													<TableCell className='lg:w-1/3 w-[80px] truncate'>
														{munkadíj.description}
													</TableCell>
													<TableCell>
														{readonly ? (
															fee.ammount
														) : (
															<Input
																className='w-[60px]'
																onChange={(e) =>
																	setFelmeresMunkadíjak!((prev) => [
																		...prev.filter(
																			(f) => f.munkadij !== fee.munkadij
																		),
																		{ ...fee, ammount: parseInt(e.target.value) },
																	])
																}
															/>
														)}
													</TableCell>
													<TableCell>
														{readonly ? (
															hufFormatter.format(munkadíj.value)
														) : (
															<Input
																className='w-[100px]'
																value={fee.value}
																onChange={(e) =>
																	setFelmeresMunkadíjak!((prev) => [
																		...prev.filter(
																			(f) => f.munkadij !== fee.munkadij
																		),
																		{ ...fee, value: parseInt(e.target.value) },
																	])
																}
															/>
														)}
													</TableCell>
													<TableCell className='text-right'>
														{hufFormatter.format(fee.ammount * fee.value)}
													</TableCell>
													{readonly ? null : (
														<TableCell className='flex justify-end flex-row '>
															<Button
																onClick={() =>
																	setFelmeresMunkadíjak!((prev) =>
																		prev.filter((f) => f.id !== fee.id)
																	)
																}
																variant={"destructive"}
																size={"icon"}>
																<Trash2 />
															</Button>
														</TableCell>
													)}
												</TableRow>
											);
										})}
									<Separator />
									{!readonly ? (
										<TableRow>
											<TableCell colSpan={6}>
												<AutoComplete
													inputWidth={"300px"}
													width='300px'
													label='Hozzáad'
													options={munkadíjak
														.filter(
															(fee) =>
																!felmeresMunkadíjak
																	.map((mf) => mf.munkadij)
																	.includes(fee.id)
														)
														.map((fee) => ({
															label: fee.type,
															value: fee.id.toString(),
														}))}
													value=''
													onSelect={(value) =>
														setFelmeresMunkadíjak!((prev) => [
															...prev,
															{
																ammount: 0,
																munkadij: parseInt(value),
																order_id: felmeresMunkadíjak.length,
																value:
																	munkadíjak.find((md) => md.id === parseInt(value))
																		?.value ?? 0,
															},
														])
													}
												/>
											</TableCell>
										</TableRow>
									) : null}
								</TableBody>
								<TableFooter>
									<TableRow>
										<TableCell colSpan={4}>Össz:</TableCell>
										<TableCell className='text-right'>
											{hufFormatter.format(
												felmeresMunkadíjak
													.map((fee) => fee.value * fee.ammount)
													.reduce((a, b) => a + b, 0)
											)}
										</TableCell>
										<TableCell className='w-[10px]'></TableCell>
									</TableRow>
								</TableFooter>
							</Table>
						</AccordionContent>
					</AccordionItem>
					{/* fees */}
					<AccordionItem value='Díjak'>
						<AccordionTrigger>Díjak</AccordionTrigger>
						<AccordionContent>
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
																				value={
																					item.type === "percent" ||
																					item.value ===
																						("-" as unknown as number)
																						? item.value
																						: numberFormatter.format(
																								item.value
																						  )
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
																									prevItem.id ===
																									item.id
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
																								prevItem.name !==
																								item.name
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
												{!isEditingOtherItems ? null : (
													<>
														<td className='p-4 border-b border-blue-gray-50'>
															<div className='flex flex-row w-3/4 lg:w-full gap-4'>
																<Input
																	value={newOtherItem?.name || ""}
																	onChange={(e) => {
																		setNewOtherItem((prev) => ({
																			...(prev as OtherFelmeresItem),
																			name: e.target.value,
																		}));
																	}}
																/>
																<AutoComplete
																	inputWidth='300px'
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
																		{ value: "", label: "" },
																	]}
																	value={
																		newOtherItem && newOtherItem.type
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
															<Button
																size={"icon"}
																variant={"ghost"}
																disabled={!newOtherItem?.name || !newOtherItem?.type}
																onClick={() => {
																	if (!setOtherItems) return;
																	setOtherItems((prev) => [
																		...prev,
																		{
																			...(newOtherItem as OtherFelmeresItem),
																			id:
																				Math.max(
																					...prev.map((item) => item.id)
																				) + 1,
																			value: 0,
																		},
																	]);
																	setNewOtherItem(undefined);
																}}>
																<CheckCircleIcon className='w-7 h-7 text-green-600 cursor-pointer' />
															</Button>
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
						</AccordionContent>
					</AccordionItem>
					{/* other material */}
					<AccordionItem value='Egyéb szerelési anyag'>
						<AccordionTrigger>Szerelési segédanyagok</AccordionTrigger>
						<AccordionContent>
							<CustomItemTable
								products={products?.filter((item) => item.category === "Egyéb szerelési anyag")}
								type='Other Material'
								items={items.filter((item) => item.type === "Other Material")}
								setItems={setItems}
								headers={TABLE_HEAD_OTHER_MATERIAL}
								setIsEditingItems={setIsEditingOtherMaterials}
							/>
						</AccordionContent>
					</AccordionItem>
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
													Munkadíjak
												</Typography>
											</td>
											<td className='p-4 border-b border-blue-gray-50'>
												<Typography
													variant='small'
													color='blue-gray'
													className='font-normal max-w-[30rem]'>
													{hufFormatter.format(munkadíjNetTotal)}
												</Typography>
											</td>
											<td className='p-4 border-b border-blue-gray-50'>
												<Typography
													variant='small'
													color='blue-gray'
													className='font-normal max-w-[30rem]'>
													{hufFormatter.format(munkadíjNetTotal * 0.27)}
												</Typography>
											</td>
											<td className='p-4 border-b border-blue-gray-50'>
												<Typography
													variant='small'
													color='blue-gray'
													className='font-normal max-w-[30rem]'>
													{hufFormatter.format(munkadíjNetTotal * 1.27)}
												</Typography>
											</td>
										</tr>
										<tr>
											<td className='p-4 border-b border-blue-gray-50'>
												<Typography
													variant='small'
													color='blue-gray'
													className='font-normal max-w-[30rem]'>
													Díjak
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
													Szerelési segédanyagok
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
																	(otherItemsNetTotal * 1.27 +
																		netTotal() * 1.27 +
																		munkadíjNetTotal * 1.27) *
																		(discount / 100)
																)}
																)
															</Typography>
														</div>
													) : (
														<div className='font-extralight text-gray-500 flex flex-row items-center gap-2'>
															<div className='relative'>
																<Input
																	value={discount}
																	onChange={(e) => {
																		if (!setDiscount) return;
																		setDiscount(
																			parseInt(
																				e.target.value.replace(/\D/g, "")
																			) <= 100
																				? parseInt(
																						e.target.value.replace(
																							/\D/g,
																							""
																						)
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
																	(otherItemsNetTotal * 1.27 +
																		netTotal() * 1.27 +
																		munkadíjNetTotal * 1.27) *
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
													{hufFormatter.format(
														otherItemsNetTotal + netTotal() + munkadíjNetTotal
													)}
												</Typography>
											</td>
											<td className='border-b border-blue-gray-100 bg-blue-gray-50 p-4'>
												<Typography
													variant='small'
													color='blue-gray'
													className='font-normal leading-none opacity-70'>
													{hufFormatter.format(
														otherItemsNetTotal * 0.27 +
															netTotal() * 0.27 +
															munkadíjNetTotal * 0.27
													)}
												</Typography>
											</td>
											<td className='border-b border-blue-gray-100 bg-blue-gray-50 p-4'>
												<Typography
													variant='small'
													color='blue-gray'
													className='font-normal leading-none opacity-70'>
													{hufFormatter.format(
														otherItemsNetTotal * 1.27 +
															netTotal() * 1.27 +
															munkadíjNetTotal * 1.27 -
															((otherItemsNetTotal * 1.27 +
																netTotal() * 1.27 +
																munkadíjNetTotal * 1.27) *
																discount) /
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
				</Accordion>
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

	function CustomItemTable({
		headers,
		setIsEditingItems,
		items,
		setItems,
		type,
		products,
	}: {
		headers: string[];
		setIsEditingItems: React.Dispatch<React.SetStateAction<boolean>>;
		items: FelmeresItem[];
		setItems?: React.Dispatch<React.SetStateAction<FelmeresItem[]>>;
		products?: Product[];
		type: string;
	}) {
		const netTotal = items
			.map(({ inputValues, netPrice }) => netPrice * inputValues.reduce((a, b) => a + b.ammount, 0))
			.reduce((a, b) => a + b, 0);
		return (
			<Card className='my-5'>
				<div className='w-full overflow-x-auto rounded-md'>
					<table className='w-full min-w-max table-auto text-left max-w-20 overflow-x-scroll border-separate border-spacing-0'>
						<thead>
							<tr>
								{headers.map((head, index) => (
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
											onClick={() => setIsEditingItems((prev) => !prev)}
										/>
									</th>
								) : null}
							</tr>
						</thead>
						<tbody className=''>
							{items
								.sort((a, b) => (a.sort_number ?? 0) - (b.sort_number ?? 0))
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
											product,
										},
										index
									) => {
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
													<tr
														key={name}
														className={cn(index % 2 !== 0 ? "bg-gray-200/60" : "bg-white")}>
														<th
															className={cn(
																"table-cell sticky z-[1] left-0 border-r ",
																index % 2 !== 0 ? "bg-gray-100" : "bg-white"
															)}>
															<HoverCardTrigger asChild>
																<Button
																	variant='link'
																	className='text-black justify-start lg:px-4 px-3 active:text-black hover:text-black hover:no-underline active:no-underline'>
																	<div className='max-w-[150px] truncate'>{sku}</div>
																</Button>
															</HoverCardTrigger>
														</th>

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
																						: setItems((items) => [
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
																								inputWidth='300px'
																								value={inputValue.value}
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
																								if (!setItems) return;
																								setItems([
																									...items.filter(
																										(item) =>
																											item.product !==
																											product
																									),
																									{
																										...items.find(
																											(item) =>
																												item.product ===
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
																		inputValues.reduce((a, b) => a + b.ammount, 0)
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
																							(item) => item.name !== name
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
								{!isEditingItems ? null : (
									<>
										<td className='p-4 px-2 border-b border-blue-gray-50 border-r sticky left-0'>
											<AutoComplete
												label='Hozzáad'
												inputWidth={deviceSize !== "sm" ? "300px" : "100px"}
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
															id: 0,
															sort_number: prev.length
																? Math.max(
																		...prev.map((item) => item.sort_number ?? 0)
																  ) + 1
																: 0,
															adatlap: felmeres.adatlap_id,
															product: parseInt(value),
															name: product.name,
															sku: product.sku,
															place: productAttribute ? productAttribute!.place : true,
															inputValues: [
																{
																	value: "",
																	id: 0,
																	ammount: 0,
																},
															],
															netPrice: product.price_list_alapertelmezett_net_price_huf,
															source: "Manual",
															type: type as unknown as "Item",
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
								<td className='border-b border-blue-gray-100 bg-blue-gray-50 p-4'>
									<Typography
										variant='small'
										color='blue-gray'
										className='font-normal leading-none opacity-70'>
										{hufFormatter.format(netTotal)}
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
		);
	}
}
