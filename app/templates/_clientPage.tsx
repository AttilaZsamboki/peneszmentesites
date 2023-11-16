"use client";

import { Template } from "./page";
import React from "react";
import Input from "../_components/Input";
import AutoComplete from "../_components/AutoComplete";
import { Product } from "../products/page";
import { XMarkIcon } from "@heroicons/react/20/solid";
import { Button } from "@/components/ui/button";
import BaseComponentV2 from "../_components/BaseComponentV2";
import CustomDialog from "../_components/CustomDialog";
import { useToast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { createTemplate, updateTemplate } from "@/lib/fetchers";
import useBreakpointValue from "../_components/useBreakpoint";
import { Textarea } from "@/components/ui/textarea";
import { Munkadíj } from "../munkadij/page";
import { SelectGroup, SelectTrigger, Select, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ItemType, ProductTemplate } from "../new/_clientPage";
import { Trash2 } from "lucide-react";

export default function Page({
	templates,
	products,
	munkadíjak,
}: {
	templates: Template[];
	products: Product[];
	munkadíjak: Munkadíj[];
}) {
	const [template, setTemplate] = React.useState<Template>({ description: "", name: "", type: "", id: 0 });
	const [items, setItems] = React.useState<ProductTemplate[]>([]);
	const [upToDateTemplates, setUpToDateTemplates] = React.useState<any[]>(templates);
	const [isNew, setIsNew] = React.useState(false);
	const [openDialog, setOpenDialog] = React.useState(false);
	const { toast } = useToast();

	React.useEffect(() => {
		if (!isNew) {
			const fetchItems = async () => {
				const response: ProductTemplate[] = await fetch(
					`https://pen.dataupload.xyz/product_templates/${template.id}/`
				).then((res) => res.json());
				setItems(response);
			};
			fetchItems();
		}
	}, [template.id, isNew]);

	const createTemplateLocal = async () => {
		const templateResponseData = await createTemplate(items, template);
		setUpToDateTemplates([
			...upToDateTemplates,
			{
				...templateResponseData,
				firstProduct: products.find((product) => product.id === items[0].product)?.sku,
				jsonProducts: JSON.stringify(items),
			},
		]);
		setItems([]);
		resetTemplate();
	};
	const deleteTemplate = async () => {
		const response = await fetch(`https://pen.dataupload.xyz/templates/${template.id}/`, {
			method: "DELETE",
		});
		if (response.ok) {
			setUpToDateTemplates((prev) => prev.filter((oldTemplates) => oldTemplates.id !== template.id));
			resetTemplate();
			await fetch("/api/revalidate?tag=templates");
		}
	};
	const updateTemplateLocal = async () => {
		const response = await updateTemplate(template, items);
		if (response) {
			await fetch("/api/revalidate?tag=templates");
			setUpToDateTemplates((prev) => {
				const index = prev.findIndex((item) => item.id === template.id);
				const newArr = [...prev];
				newArr[index] = {
					...template,
					firstProduct: products.find((product) => product.id === items[0].product)?.sku,
					jsonProducts: JSON.stringify(items),
				};
				return newArr;
			});
		}
	};
	const onClickSetItems = (e: string, type: ItemType | "Munkadíj") => {
		setItems((prevItems) => [
			...prevItems,
			{ type: type, product: parseInt(e), template: template.id ?? undefined },
		]);
	};
	const onClickDeleteItem = (item: ProductTemplate) => {
		setItems((prevItems) => prevItems.filter((i) => i.product !== item.product));
	};

	return (
		<>
			<BaseComponentV2
				createButtonTitle='Új sablon'
				data={upToDateTemplates}
				editType='dialog'
				itemContent={{
					id: "id",
					title: "name",
					subtitle: "type",
					subtitle2: "description",
					subtitle3: "firstProduct",
				}}
				filters={[
					{ field: "name", label: "Név", type: "select" },
					{ field: "type", label: "Típus", type: "select" },
					{ field: "description", label: "Tárgy", type: "select" },
					{ field: "jsonProducts", label: "Termék", type: "text" },
					{ field: "id", label: "Azonosító", type: "select" },
				]}
				title='Sablonok'
				onCreateNew={() => {
					setOpenDialog(true);
					setIsNew(true);
				}}
				onEditItem={(item) => {
					setTemplate(item);
					setOpenDialog(true);
					setIsNew(false);
				}}
			/>
			<CustomDialog
				open={openDialog}
				handler={() => {
					setOpenDialog(!openDialog);
					resetTemplate();
				}}
				title={!isNew ? template.name : "Új sablon"}
				onDelete={
					!isNew
						? () => {
								setOpenDialog(false);
								toast({
									title: "Biztos törölni akarod a sablont?",
									variant: "destructive",
									action: (
										<ToastAction onClick={deleteTemplate} altText='delete'>
											Igen
										</ToastAction>
									),
								});
						  }
						: undefined
				}
				disabledSubmit={!template.name || !template.type || !template.description || !items.length}
				onSave={!isNew ? updateTemplateLocal : createTemplateLocal}
				onCancel={resetTemplate}>
				<Form
					items={items}
					munkadíjak={munkadíjak}
					products={products}
					onClickAddItem={onClickSetItems}
					setTemplate={setTemplate}
					template={template}
					onClickDeleteItem={onClickDeleteItem}
				/>
			</CustomDialog>
		</>
	);

	function resetTemplate(): void {
		return setTemplate({ description: "", name: "", type: "", id: 0 });
	}
}

export function Form({
	template,
	setTemplate,
	products,
	items,
	onClickAddItem,
	onClickDeleteItem,
	munkadíjak,
}: {
	template: Template;
	setTemplate: React.Dispatch<React.SetStateAction<Template>>;
	products: Product[];
	items: ProductTemplate[];
	onClickAddItem: (e: string, type: ItemType | "Munkadíj") => void;
	onClickDeleteItem: (e: ProductTemplate) => void;
	munkadíjak: Munkadíj[];
}) {
	const deviceSize = useBreakpointValue();
	const isChosen = (products: any[], type: string) => {
		const tItems = items
			.filter((item) => item.type === type && item.template?.toString() === template.id.toString())
			.map((item) => item.product.toString());
		return products.filter((product) => !tItems.includes(product.id.toString()));
	};

	const itemTypes: { label: string; value: ItemType | "Munkadíj"; options: { value: string; label: string }[] }[] = [
		{
			label: "Termék",
			value: "Item",
			options: isChosen(products, "Item")
				.filter((product) => product.category !== "Egyéb szerelési anyag")
				.sort((a, b) => a.sku.localeCompare(b.sku))
				.map((product) => ({
					label: product.sku.trim() + " - " + product.name,
					value: product.id.toString(),
				})),
		},
		{
			label: "Munkadíj",
			value: "Munkadíj",
			options: isChosen(munkadíjak, "Munkadíj").map((munkadíj) => ({
				label: munkadíj.type,
				value: munkadíj.id.toString(),
			})),
		},
		{
			label: "Szerelési segédanyag",
			value: "Other Material",
			options: isChosen(products, "Other Material")
				.filter((product) => product.category === "Egyéb szerelési anyag")
				.sort((a, b) => a.sku.localeCompare(b.sku))
				.map((product) => ({
					label: product.sku.trim() + " - " + product.name,
					value: product.id.toString(),
				})),
		},
	];
	return (
		<div className='flex flex-col w-full gap-5 h-full overflow-y-scroll pr-3 pl-1'>
			<div className='flex flex-col gap-2'>
				<div>Név</div>
				<Input
					value={template.name}
					onChange={(e) => setTemplate((prev) => ({ ...prev, name: e.target.value }))}
				/>
			</div>
			<div className='flex flex-col gap-2'>
				<div>Típus</div>
				<Select onValueChange={(e) => setTemplate((prev) => ({ ...prev, type: e }))} value={template.type}>
					<SelectTrigger>
						<SelectValue placeholder='Válassz egy típust' />
					</SelectTrigger>
					<SelectContent>
						<SelectGroup>
							{[
								"Helyi elszívós rendszer",
								"Központi ventillátoros",
								"Passzív rendszer",
								"Hővisszanyerős",
							].map((type) => (
								<SelectItem value={type} key={type}>
									{type}
								</SelectItem>
							))}
						</SelectGroup>
					</SelectContent>
				</Select>
			</div>
			<div className='flex flex-col gap-2'>
				<div>Tárgy</div>
				<Textarea
					value={template.description}
					onChange={(e) => setTemplate((prev) => ({ ...prev, description: e.target.value }))}
				/>
			</div>
			<Accordion type='multiple' defaultValue={["Item", "Munkadíj", "Other Material"]}>
				{itemTypes.map((itemType) => (
					<AccordionItem key={itemType.value} value={itemType.value}>
						<AccordionTrigger>{itemType.label}</AccordionTrigger>
						<AccordionContent>
							<div>
								<AutoComplete
									inputWidth={deviceSize === "sm" ? "300px" : "600px"}
									options={itemType.options}
									onSelect={(e) => onClickAddItem(e, itemType.value)}
									value=''
								/>
							</div>
							<div className='flex flex-col gap-5 py-4 px-3'>
								{items
									.filter((item) => item.type === itemType.value)
									.map((item) => (
										<div
											key={item.product}
											className='flex flex-row w-full items-center justify-between gap-3'>
											<div className='w-11/12'>
												<Item itemType={itemType.value} item={item} />
											</div>
											<Button
												size='icon'
												className='w-1/12'
												variant='destructive'
												onClick={() => onClickDeleteItem(item)}>
												<Trash2 />
											</Button>
										</div>
									))}
							</div>
						</AccordionContent>
					</AccordionItem>
				))}
			</Accordion>
		</div>
	);
	function Item({ itemType, item }: { itemType: ItemType | "Munkadíj"; item: ProductTemplate }) {
		if (itemType === "Munkadíj") {
			const munkadíj = munkadíjak.find((munkadíj) => munkadíj.id === parseInt(item.product.toString()));
			return (
				<div>
					<span className='font-medium'>{munkadíj?.type}</span>
					{munkadíj?.description ? " - " + munkadíj!.description : ""}
				</div>
			);
		}
		return (
			<>
				<span className='font-medium'>{products.find((product) => product.id === item.product)?.sku}</span> -{" "}
				{products.find((product) => product.id === item.product)?.name}
			</>
		);
	}
}
