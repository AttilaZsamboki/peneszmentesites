"use client";
import dynamic from "next/dynamic";
import { Typography } from "@material-tailwind/react";
import React from "react";
const AutoComplete = dynamic(() => import("@/app/_components/AutoComplete"));
import { Product } from "@/app/products/page";
import { isJSONParsable } from "../[id]/_clientPage";
import { MinusCircleIcon, PlusCircleIcon } from "@heroicons/react/20/solid";
import Counter from "@/app/_components/Counter";
import { ProductAttributes } from "@/app/products/_clientPage";
import {
	BaseFelmeresData,
	FelmeresItem,
	FelmeresMunkadíj,
	ItemType,
	OtherFelmeresItem,
	ProductTemplate,
	QuestionTemplate,
	hufFormatter,
	numberFormatter,
} from "./_clientPage";
import { Template } from "../templates/page";
import DropdownMenu from "../_components/Menu";
import { Button } from "@/components/ui/button";
import { Banknote, Check, Plus, Save, SaveAll, Trash2 } from "lucide-react";
import CustomDialog from "../_components/CustomDialog";
import { createTemplate, updateTemplate } from "../../lib/fetchers";
import { Form } from "../templates/_clientPage";
import { toast } from "@/components/ui/use-toast";
import { OpenCreatedToast } from "@/components/toasts";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { calculatePercentageValue, cn, useSettings } from "@/lib/utils";
import useBreakpointValue from "../_components/useBreakpoint";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Munkadíj } from "../munkadij/page";
import { Input } from "@/components/ui/input";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { MunkadíjForm } from "../munkadij/clientPage";
import { Checkbox } from "@/components/ui/checkbox";

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
	originalMunkadíjak,
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
	originalMunkadíjak: Munkadíj[];
	felmeresMunkadíjak: FelmeresMunkadíj[];
	setFelmeresMunkadíjak?: React.Dispatch<React.SetStateAction<FelmeresMunkadíj[]>>;
}) {
	const settings = useSettings();
	const [openAccordions, setOpenAccordions] = React.useState<(ItemType | "Munkadíj" | "Összesítés")[]>([]);
	const [newOtherItem, setNewOtherItem] = React.useState<OtherFelmeresItem>();
	const [isEditingOtherItems, setIsEditingOtherItems] = React.useState(!readonly);
	const [templates, setTemplates] = React.useState<Template[]>(originalTemplates ?? []);
	const [munkadíjak, setMunkadíjak] = React.useState<Munkadíj[]>(originalMunkadíjak);
	const [selectedTemplate, setSelectedTemplate] = React.useState<Template>(
		templates?.find((template) => template.id === felmeres.template) ?? {
			description: "",
			name: "",
			type: "",
			id: 0,
		}
	);
	const nullMunkadij: Munkadíj = {
		description: "",
		type: "",
		value: 0,
		id: 0,
		value_type: "hour",
		num_people: 0,
	};
	const [selectedMunkadíj, setSelectedMunkadíj] = React.useState<Munkadíj>(nullMunkadij);
	const [openTemplateDialog, setOpenTemplateDialog] = React.useState(false);
	const [openMunkadíjDialog, setOpenMunkadíjDialog] = React.useState(false);

	const deviceSize = useBreakpointValue();

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
					!openAccordions.includes(productTemplate.type)
						? setOpenAccordions((prev) => [...prev, productTemplate.type])
						: null;
					if (productTemplate.type === "Munkadíj") {
						setFelmeresMunkadíjak!((prev) => [
							...prev,
							{
								munkadij: productTemplate.product,
								amount: 0,
								order_id: prev.length ?? 0,
								value:
									(munkadíjak.find((md) => md.id === productTemplate.product)?.value ?? 0) *
									(munkadíjak.find((md) => md.id === productTemplate.product)?.value_type === "hour"
										? felmeres.hourly_wage
										: 1) *
									(munkadíjak.find((md) => md.id === productTemplate.product)?.num_people ?? 1),
								source: "Template",
							},
						]);
					}
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
									type: productData.category === "Egyéb szerelési anyag" ? "Other Material" : "Item",
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

	const munkadíjNetTotal = felmeresMunkadíjak.map((fee) => fee.value * fee.amount).reduce((a, b) => a + b, 0);
	const netTotal = (type?: "Other Material" | "Item") => {
		const baseTotal = items
			.filter((item) => (type ? item.type === type : true))
			.map(({ inputValues, netPrice }) => netPrice * inputValues.reduce((a, b) => a + b.ammount, 0))
			.reduce((a, b) => a + b, 0);
		if (!type) {
			return baseTotal + munkadíjNetTotal;
		}
		return baseTotal;
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
		const selectedTemplateData = templates!.find((template) => template.id === selectedTemplate.id);
		if (!selectedTemplateData || !setFelmeres || !setItems || !setFelmeresMunkadíjak) return;
		const newFelmeres = {
			...felmeres,
			template: selectedTemplateData.id,
		};
		setFelmeres(newFelmeres);
		setItems(filterPrevTemplate<FelmeresItem>());
		setFelmeresMunkadíjak(filterPrevTemplate<FelmeresMunkadíj>());
		await fetchTemplateItems(newFelmeres);

		function filterPrevTemplate<T extends { source?: string }>(): React.SetStateAction<T[]> {
			return (prev) => prev.filter((item) => item.source !== "Template");
		}
	};
	const saveTemplate = async () => {
		const response = await updateTemplate(selectedTemplate, templateProducts);
		if (response) {
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

	const templateProducts: ProductTemplate[] = [
		...items.map((item) => ({
			product: item.product,
			type: item.type,
			template: felmeres.template ?? 0,
		})),
		...felmeresMunkadíjak.map((fee) => ({
			product: fee.munkadij,
			type: "Munkadíj" as ItemType | "Munkadíj",
			template: felmeres.template ?? 0,
		})),
	];
	const handleOpenAccordion = (section: ItemType | "Munkadíj" | "Összesítés") => {
		if (!openAccordions.includes(section)) {
			setOpenAccordions((prev) => [...prev, section]);
		} else {
			setOpenAccordions((prev) => prev.filter((item) => item !== section));
		}
	};

	React.useEffect(() => {
		if (setFelmeres && settings && !felmeres.hourly_wage) {
			setFelmeres((prev) => ({ ...prev, hourly_wage: parseFloat(settings["Óradíj"] ?? "0") }));
		}
	}, [settings]);
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
						const jsonResp = await createTemplate(templateProducts, selectedTemplate);
						if (!jsonResp) {
							toast({
								title: "Sablon létrehozása sikertelen",
								description: "Kérlek próbáld újra később",
								variant: "destructive",
								duration: 2000,
							});
							return;
						}
						setFelmeres((prev) => ({ ...prev, template: jsonResp.id }));
						setSelectedTemplate((prev) => ({ ...prev, id: jsonResp.id }));
						setTemplates((prev) => [...prev, jsonResp]);
						toast({
							title: "Sablon sikeresen létrehozva",
							description: (
								<OpenCreatedToast
									path={"/templates"}
									query={{ id: jsonResp.id.toString() }}
									inNewTab={true}
								/>
							),
						});
					}}>
					<Form
						munkadíjak={munkadíjak}
						items={templateProducts}
						products={products ?? []}
						onClickAddItem={(e, type) => {
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
									type: type as ItemType,
									valueType: "fixed",
									source: "Template",
									category: "",
									sort_number: Math.max(...prev.map((item) => item.sort_number ?? 0)) + 1,
								},
							]);
						}}
						onClickDeleteItem={(e) => {
							if (!setItems) return;
							if (e.type === "Munkadíj") {
								setFelmeresMunkadíjak!((prev) => prev.filter((fee) => fee.munkadij !== e.product));
								return;
							}
							setItems((prev) => prev.filter((item) => item.product !== e.product));
						}}
						setTemplate={setSelectedTemplate}
						template={{ ...selectedTemplate, id: 0, type: felmeres.type }}
					/>
				</CustomDialog>
			) : null}
			{openMunkadíjDialog ? (
				<CustomDialog
					open={openMunkadíjDialog}
					handler={() => {
						setOpenMunkadíjDialog((prev) => !prev);
					}}
					title='Új munkadíj'
					disabledSubmit={!selectedMunkadíj?.value || !selectedMunkadíj?.type}
					onSave={async () => {
						const jsonResp: Munkadíj = await fetch("https://pen.dataupload.xyz/munkadij/", {
							method: "POST",
							headers: {
								"Content-Type": "application/json",
							},
							body: JSON.stringify(selectedMunkadíj),
						}).then((res) => res.json());
						if (!jsonResp) {
							toast({
								title: "Munkadíj létrehozása sikertelen",
								description: "Kérlek próbáld újra később",
								variant: "destructive",
								duration: 2000,
							});
							return;
						}
						setSelectedMunkadíj(nullMunkadij);
						setFelmeresMunkadíjak!((prev) => [
							...prev,
							{
								amount: 0,
								munkadij: jsonResp.id,
								order_id: prev.length ?? 0,
								value:
									jsonResp.value_type === "fix"
										? jsonResp.value
										: jsonResp.value * (settings ? parseFloat(settings["Óradíj"] ?? "1") : 1),
								source: "Manual",
							},
						]);
						setMunkadíjak((prev) => [...prev, jsonResp]);
						toast({
							title: "Munkadíj sikeresen létrehozva",
							description: (
								<OpenCreatedToast
									path={"/munkadij"}
									query={{ idStr: jsonResp.id.toString() }}
									inNewTab={true}
								/>
							),
						});
					}}>
					<MunkadíjForm munkadíj={selectedMunkadíj} setMunkadíj={setSelectedMunkadíj} />
				</CustomDialog>
			) : null}
			<div id='Tételek'>
				{!readonly ? (
					<div className='flex flex-row justify-between w-full items-start flex-wrap gap-3'>
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
										value={selectedTemplate.type}
										onSelect={(e) => {
											setFelmeres ? setFelmeres({ ...felmeres, type: e }) : null;
											setSelectedTemplate({
												description: "",
												name: "",
												type: e,
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
												if (!e) {
													setSelectedTemplate({
														description: "",
														name: "",
														type: "",
														id: 0,
													});
													return;
												}
												if (templates) {
													const selectedTemplateTemp = templates.find(
														(template) => template.id.toString() === e
													);
													if (selectedTemplateTemp) {
														setSelectedTemplate(selectedTemplateTemp);
														if (setFelmeres) {
															setFelmeres((prev) => ({
																...prev,
																subject: selectedTemplateTemp.description,
															}));
														}
													}
												}
											}}
											value={selectedTemplate.name}
										/>
										<div>
											{readonly ? null : felmeres.template !== selectedTemplate.id &&
											  selectedTemplate.id ? (
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
						<div className='flex flex-col lg:flex-row items-start justify-center lg:items-center gap-2'>
							<Label htmlFor='detailed-offer'>Tételes ajánlat</Label>

							<Checkbox
								onClick={() =>
									setFelmeres
										? setFelmeres((prev) => ({ ...prev, detailed_offer: !prev.detailed_offer }))
										: null
								}
								id='detailed-offer'
								className='order-last lg:order-first'
							/>
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
											} else {
												console.log(resp.status);
												toast({
													title: "Leírás frissítése sikertelen",
													description: "Kérlek próbáld újra később",
													variant: "destructive",
													duration: 2000,
												});
											}
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
				<Accordion value={openAccordions} type='multiple'>
					<AccordionItem value='Item'>
						<AccordionTrigger onClick={() => handleOpenAccordion("Item")} className='relative'>
							<div>Tételek</div>
							<div className='absolute right-4 text-xs font-medium text-gray-700 mr-2'>
								{hufFormatter.format(netTotal("Item"))}
							</div>
						</AccordionTrigger>
						<AccordionContent>
							<CustomItemTable
								globalSpace
								products={products?.filter((item) => item.category !== "Egyéb szerelési anyag")}
								type='Item'
								headers={TABLE_HEAD_ITEMS}
								items={items.filter((item) => item.type === "Item")}
								setItems={setItems}
							/>
						</AccordionContent>
					</AccordionItem>
					<AccordionItem value='Munkadíj'>
						<AccordionTrigger onClick={() => handleOpenAccordion("Munkadíj")} className='relative'>
							<div>Munkadíjak</div>
							<div className='absolute right-4 flex flex-col gap-1 items-end justify-center text-xs font-medium text-gray-700 mr-2'>
								<span>{hufFormatter.format(munkadíjNetTotal)}</span>
								<span className='text-xs font-bold'>
									(
									{felmeresMunkadíjak
										.map((fmd) => {
											const md = munkadíjak.find((md) => md.id === fmd.munkadij);
											if (md) {
												if (md.value_type === "hour") {
													return (fmd.value / felmeres.hourly_wage) * fmd.amount;
												}
											}
											return 0;
										})
										.reduce((a, b) => a + b, 0)}{" "}
									óra)
								</span>
							</div>
						</AccordionTrigger>
						<AccordionContent>
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Típus</TableHead>
										<TableHead className='w-[60px] '>Darab</TableHead>
										<TableHead className='w-[100px] '>Nettó egységár</TableHead>
										<TableHead className='text-right'>Nettó összesen</TableHead>
										{readonly ? null : <TableHead className='w-[10px]'></TableHead>}
									</TableRow>
								</TableHeader>
								<TableBody>
									{felmeresMunkadíjak
										.sort((a, b) => a.order_id! - b.order_id!)
										.map((fee) => {
											const munkadíj = munkadíjak.find(
												(munkadíj) => munkadíj.id === fee.munkadij
											)!;
											return (
												<>
													<HoverCard key={fee.id}>
														<HoverCardContent className='w-80 z-[99999]'>
															<div className='flex justify-between space-x-4'>
																<div className='space-y-1'>
																	<h4 className='text-sm font-semibold'>
																		{munkadíj.type}
																	</h4>
																	<p className='text-sm'>{munkadíj.description}</p>
																	<div className='flex items-center pt-2'>
																		<Banknote className='mr-2 h-4 w-4 opacity-70' />{" "}
																		<span className='text-xs text-muted-foreground'>
																			{hufFormatter.format(
																				munkadíj.value_type === "fix"
																					? munkadíj.value
																					: munkadíj.value *
																							felmeres.hourly_wage *
																							munkadíj.num_people
																			)}
																		</span>
																	</div>
																</div>
															</div>
														</HoverCardContent>
														<TableRow>
															<TableCell className='font-medium'>
																<HoverCardTrigger asChild>
																	<Button
																		variant='link'
																		className='text-black justify-start lg:px-4 px-3 active:text-black hover:text-black hover:no-underline active:no-underline'>
																		<div className='lg:max-w-[150px] max-w-[80px] truncate'>
																			{munkadíj.type}
																		</div>
																	</Button>
																</HoverCardTrigger>
															</TableCell>

															<TableCell>
																{readonly ? (
																	fee.amount
																) : (
																	<Counter
																		maxWidth='max-w-[10rem]'
																		value={fee.amount}
																		onChange={(e) =>
																			setFelmeresMunkadíjak!((prev) => [
																				...prev.filter(
																					(f) => f.munkadij !== fee.munkadij
																				),
																				{
																					...fee,
																					amount: e ?? 0,
																				},
																			])
																		}
																	/>
																)}
															</TableCell>
															<TableCell>
																{readonly ? (
																	hufFormatter.format(fee.value)
																) : (
																	<div className='flex flex-row justify-start items-center gap-2'>
																		<Input
																			className='w-[100px]'
																			value={
																				munkadíj.value_type === "fix"
																					? numberFormatter.format(fee.value)
																					: fee.hour ??
																					  fee.value / felmeres.hourly_wage
																			}
																			onChange={(e) => {
																				setFelmeresMunkadíjak!((prev) => [
																					...prev.filter(
																						(f) =>
																							f.munkadij !== fee.munkadij
																					),
																					{
																						...fee,
																						value:
																							(e.target
																								.value as unknown as number) *
																							felmeres.hourly_wage,
																						hour: e.target.value,
																					},
																				]);
																			}}
																		/>
																		<p className='prose prose-slate'>
																			{munkadíj.value_type === "fix"
																				? "Ft"
																				: "óra"}
																		</p>
																	</div>
																)}
															</TableCell>
															<TableCell className='text-right'>
																{hufFormatter.format(fee.amount * fee.value)}
															</TableCell>
															{readonly ? null : (
																<TableCell className='flex justify-end flex-row '>
																	<Button
																		onClick={() =>
																			setFelmeresMunkadíjak!((prev) =>
																				prev.filter(
																					(f) => f.munkadij !== fee.munkadij
																				)
																			)
																		}
																		variant={"destructive"}
																		size={"icon"}>
																		<Trash2 />
																	</Button>
																</TableCell>
															)}
														</TableRow>
													</HoverCard>
												</>
											);
										})}
									{!readonly ? (
										<TableRow>
											<TableCell colSpan={5}>
												<AutoComplete
													inputWidth={"300px"}
													width='300px'
													label='Hozzáad'
													create
													onCreate={(value) => {
														setOpenMunkadíjDialog(true);
														setSelectedMunkadíj((prev) => ({ ...prev, type: value }));
													}}
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
																amount: 0,
																munkadij: parseInt(value),
																order_id: prev.length ?? 0,
																value:
																	(munkadíjak.find((md) => md.id === parseInt(value))
																		?.value ?? 0) *
																	(munkadíjak.find((md) => md.id === parseInt(value))
																		?.value_type === "hour"
																		? felmeres.hourly_wage
																		: 1) *
																	(munkadíjak.find((md) => md.id === parseInt(value))
																		?.num_people ?? 1),
															},
														])
													}
												/>
											</TableCell>
										</TableRow>
									) : null}
								</TableBody>
							</Table>
						</AccordionContent>
					</AccordionItem>
					{/* fees */}
					<AccordionItem value='Fee'>
						<AccordionTrigger onClick={() => handleOpenAccordion("Fee")} className='relative'>
							<div>Díjak</div>
							<div className='absolute right-4 text-xs font-medium text-gray-700 mr-2'>
								{hufFormatter.format(otherItemsNetTotal)}
							</div>
						</AccordionTrigger>
						<AccordionContent>
							<Table>
								<TableHeader>
									<TableRow>
										{TABLE_HEAD_OTHER.map((head, index) => (
											<TableHead
												key={head}
												className={index === TABLE_HEAD_OTHER.length - 1 ? "text-right" : ""}>
												{head}
											</TableHead>
										))}
										{!readonly ? <TableHead className='w-[10px]'></TableHead> : null}
									</TableRow>
								</TableHeader>
								<TableBody>
									{otherItems
										.sort((a, b) => a.id - b.id)
										.map((item) => (
											<TableRow key={item.id}>
												<TableCell className='font-medium'>{item.name}</TableCell>
												<TableCell>
													{readonly && item.type === "fixed" ? null : (
														<div className='relative'>
															{readonly ? (
																item.type === "percent" ? (
																	<div>
																		{item.value}{" "}
																		<span className='font-extralight text-gray-500'>
																			%
																		</span>
																	</div>
																) : (
																	numberFormatter.format(item.value)
																)
															) : (
																<>
																	<Input
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
												</TableCell>
												<TableCell className='text-right'>
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
												</TableCell>
												{!readonly ? (
													<TableCell>
														{isEditingOtherItems ? (
															<Button
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
																variant={"destructive"}
																size={"icon"}>
																<Trash2 />
															</Button>
														) : null}
													</TableCell>
												) : null}
											</TableRow>
										))}
									<TableRow>
										{!isEditingOtherItems ? null : (
											<>
												<TableCell>
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
												</TableCell>
												<TableCell></TableCell>
												<TableCell></TableCell>
												<TableCell className='p-4 border-b border-blue-gray-50'>
													<Button
														size={"icon"}
														className='bg-green-600 hover:bg-green-600/80 cursor-pointer'
														disabled={!newOtherItem?.name || !newOtherItem?.type}
														onClick={() => {
															if (!setOtherItems) return;
															setOtherItems((prev) => [
																...prev,
																{
																	...(newOtherItem as OtherFelmeresItem),
																	id: prev.length
																		? Math.max(...prev.map((item) => item.id)) + 1
																		: 0,
																	value: 0,
																},
															]);
															setNewOtherItem(undefined);
														}}>
														<Plus />
													</Button>
												</TableCell>
											</>
										)}
									</TableRow>
								</TableBody>
							</Table>
						</AccordionContent>
					</AccordionItem>
					{/* other material */}
					<AccordionItem value='Other Material'>
						<AccordionTrigger onClick={() => handleOpenAccordion("Other Material")} className='relative'>
							<div>Szerelési segédanyag</div>
							<div className='absolute right-4 text-xs font-medium text-gray-700 mr-2'>
								{hufFormatter.format(netTotal("Other Material"))}
							</div>
						</AccordionTrigger>
						<AccordionContent>
							<CustomItemTable
								globalSpace={false}
								products={products?.filter((product) => product.category === "Egyéb szerelési anyag")}
								type='Other Material'
								items={items.filter((item) => item.type === "Other Material")}
								setItems={setItems}
								headers={TABLE_HEAD_OTHER_MATERIAL}
							/>
						</AccordionContent>
					</AccordionItem>
					<AccordionItem value='Összesítés'>
						<AccordionTrigger onClick={() => handleOpenAccordion("Összesítés")} className='relative'>
							<div>Összesítés</div>
							<div className='absolute right-4 text-xs font-medium text-gray-700 mr-2'>
								{hufFormatter.format(otherItemsNetTotal + netTotal())}
							</div>
						</AccordionTrigger>
						<AccordionContent>
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Név</TableHead>
										<TableHead>Nettó</TableHead>
										<TableHead>ÁFA</TableHead>
										<TableHead className='w-[200px] text-right'>Bruttó</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									<TableRow>
										<TableCell>Tételek</TableCell>
										<TableCell>{hufFormatter.format(netTotal("Item"))}</TableCell>
										<TableCell>{hufFormatter.format(netTotal("Item") * 0.27)}</TableCell>
										<TableCell className='text-right'>
											{hufFormatter.format(netTotal("Item") * 1.27)}
										</TableCell>
									</TableRow>
									<TableRow>
										<TableCell>Munkadíjak</TableCell>
										<TableCell>{hufFormatter.format(munkadíjNetTotal)}</TableCell>
										<TableCell>{hufFormatter.format(munkadíjNetTotal * 0.27)}</TableCell>
										<TableCell className='text-right'>
											{hufFormatter.format(munkadíjNetTotal * 1.27)}
										</TableCell>
									</TableRow>
									<TableRow>
										<TableCell>Díjak</TableCell>
										<TableCell>{hufFormatter.format(otherItemsNetTotal)}</TableCell>
										<TableCell>{hufFormatter.format(otherItemsNetTotal * 0.27)}</TableCell>

										<TableCell className='text-right'>
											{hufFormatter.format(otherItemsNetTotal * 1.27)}
										</TableCell>
									</TableRow>
									<TableRow>
										<TableCell>Szerelési segédanyagok</TableCell>
										<TableCell>{hufFormatter.format(netTotal("Other Material"))}</TableCell>
										<TableCell>{hufFormatter.format(netTotal("Other Material") * 0.27)}</TableCell>

										<TableCell className='text-right'>
											{hufFormatter.format(netTotal("Other Material") * 1.27)}
										</TableCell>
									</TableRow>
									<TableRow>
										<TableCell colSpan={3}>Kedvezmény</TableCell>

										<TableCell>
											<div>
												{readonly ? (
													<div className='font-extralight text-gray-500 flex flex-row items-center justify-end gap-2'>
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
													<div className='font-extralight text-gray-500 flex flex-row items-center gap-2 w-[200px]'>
														<div className='relative'>
															<Input
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
										</TableCell>
									</TableRow>
								</TableBody>
								<TableFooter className='bg-secondary text-gray-700'>
									<TableRow>
										<TableCell>Össz:</TableCell>
										<TableCell>{hufFormatter.format(otherItemsNetTotal + netTotal())}</TableCell>
										<TableCell>
											{hufFormatter.format(otherItemsNetTotal * 0.27 + netTotal() * 0.27)}
										</TableCell>
										<TableCell className='text-right'>
											{hufFormatter.format(
												otherItemsNetTotal * 1.27 +
													netTotal() * 1.27 -
													((otherItemsNetTotal * 1.27 + netTotal() * 1.27) * discount) / 100
											)}
										</TableCell>
									</TableRow>
								</TableFooter>
							</Table>
						</AccordionContent>
					</AccordionItem>
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
		items,
		setItems,
		type,
		products,
		globalSpace = true,
	}: {
		headers: string[];
		items: FelmeresItem[];
		setItems?: React.Dispatch<React.SetStateAction<FelmeresItem[]>>;
		products?: Product[];
		type: string;
		globalSpace: boolean;
	}) {
		return (
			<Table>
				<TableHeader>
					<TableRow>
						{headers.map((head, index) => (
							<TableHead
								key={head}
								className={cn(
									index === 0
										? "sticky left-0 z-10  bg-white"
										: index === headers.length - 1
										? "text-right"
										: ""
								)}>
								{head}
							</TableHead>
						))}
						{!readonly ? <TableHead className='w-[10px]'></TableHead> : null}
					</TableRow>
				</TableHeader>
				<TableBody>
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
								return (
									<>
										<HoverCard key={index}>
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
											<TableRow>
												<TableCell className='sticky z-[1] table-cell left-0 bg-white'>
													<HoverCardTrigger asChild>
														<Button
															variant='link'
															className='text-black justify-start lg:px-4 px-3 active:text-black hover:text-black hover:no-underline active:no-underline'>
															<div className='lg:max-w-[150px] max-w-[80px] truncate'>
																{sku}
															</div>
														</Button>
													</HoverCardTrigger>
												</TableCell>

												{inputValues
													.sort((a, b) => a.id - b.id)
													.map((inputValue) => (
														<div key={inputValue.id} className='flex flex-row items-center'>
															<TableCell key={inputValue.id}>
																{readonly ? (
																	<Typography
																		variant='small'
																		color='blue-gray'
																		className='font-normal w-80 flex flex-row gap-4 '>
																		<span className='break-keep '>
																			{inputValue.ammount} darab
																		</span>
																		{place && globalSpace ? (
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
																							(i) => i.product !== product
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
																				  ])
																		}
																	/>
																)}
															</TableCell>
															{place && globalSpace ? (
																<TableCell className='flex flex-row w-full items-center gap-2'>
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
																							if (!setItems) return;
																							setItems((prev) => [
																								...prev.filter(
																									(item) =>
																										item.product !==
																										product
																								),
																								{
																									...prev.find(
																										(item) =>
																											item.product ===
																											product
																									)!,
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
																							!setItems
																								? null
																								: setItems((prev) => [
																										...prev.filter(
																											(item) =>
																												item.product !==
																												product
																										),
																										{
																											...prev.find(
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
																			{!readonly && inputValues.length > 1 ? (
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
																										(value) =>
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
																</TableCell>
															) : (
																<TableCell className=' w-full'></TableCell>
															)}
														</div>
													))}
												<TableCell>{hufFormatter.format(netPrice)}</TableCell>
												<TableCell className='text-right'>
													{hufFormatter.format(
														netPrice * inputValues.reduce((a, b) => a + b.ammount, 0)
													)}
												</TableCell>
												{!readonly ? (
													<TableCell>
														<Button
															onClick={() =>
																!setItems
																	? null
																	: setItems((prev) =>
																			prev.filter((item) => item.name !== name)
																	  )
															}
															variant={"destructive"}
															size={"icon"}>
															<Trash2 />
														</Button>
													</TableCell>
												) : null}
											</TableRow>
										</HoverCard>
									</>
								);
							}
						)}
					<TableRow>
						{readonly ? null : (
							<>
								<TableRow>
									<TableCell className='sticky left-0'>
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
																		.includes(product.id) &&
																	!productAttributes?.find(
																		(attribute) => attribute.product === product.id
																	)?.archived
															)
															.sort((a, b) => a.sku?.localeCompare(b.sku))
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
															? Math.max(...prev.map((item) => item.sort_number ?? 0)) + 1
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
														attributeId: productAttribute ? productAttribute!.id ?? 0 : 0,
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
									</TableCell>
								</TableRow>
								<TableRow></TableRow>
								<TableRow></TableRow>
								<TableRow></TableRow>
								<TableRow></TableRow>
							</>
						)}
					</TableRow>
				</TableBody>
			</Table>
		);
	}
}
