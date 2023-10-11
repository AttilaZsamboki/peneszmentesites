"use client";

import { Template } from "./page";
import React from "react";
import Input from "../_components/Input";
import Select from "../_components/Select";
import Textarea from "../_components/Textarea";
import AutoComplete from "../_components/AutoComplete";
import { Product } from "../products/page";
import Heading from "../_components/Heading";
import { XMarkIcon } from "@heroicons/react/20/solid";
import { Button } from "@/components/ui/button";
import BaseComponentV2 from "../_components/BaseComponentV2";
import CustomDialog from "../_components/CustomDialog";
import { useToast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { createTemplate, updateTemplate } from "@/lib/fetchers";

export default function Page({ templates, products }: { templates: Template[]; products: Product[] }) {
	const [template, setTemplate] = React.useState<Template>({ description: "", name: "", type: "", id: 0 });
	const [items, setItems] = React.useState<string[]>([]);
	const [upToDateTemplates, setUpToDateTemplates] = React.useState<any[]>(templates);
	const [isNew, setIsNew] = React.useState(false);
	const [openDialog, setOpenDialog] = React.useState(false);
	const { toast } = useToast();

	React.useEffect(() => {
		if (!isNew) {
			const fetchItems = async () => {
				const response: { product: number; template: number }[] = await fetch(
					`https://pen.dataupload.xyz/product_templates/${template.id}/`
				).then((res) => res.json());
				setItems(response.map((item: { product: number }) => item.product.toString()));
			};
			fetchItems();
		}
	}, [template]);

	const createTemplateLocal = async () => {
		const templateResponseData = await createTemplate(items, template);
		setUpToDateTemplates([
			...upToDateTemplates,
			{
				...templateResponseData,
				firstProduct: products.find((product) => product.id.toString() === items[0])?.sku,
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
		if (response.ok) {
			await fetch("/api/revalidate?tag=templates");
			setUpToDateTemplates((prev) => {
				const index = prev.findIndex((item) => item.id === template.id);
				const newArr = [...prev];
				newArr[index] = {
					...template,
					firstProduct: products.find((product) => product.id.toString() === items[0])?.sku,
					jsonProducts: JSON.stringify(items),
				};
				return newArr;
			});
		}
	};
	const onClickSetItems = (e: string) => {
		setItems((prevItems) => [...prevItems, e]);
	};
	const onClickDeleteItem = (item: string) => {
		setItems((prevItems) => prevItems.filter((i) => i !== item));
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
					{ field: "description", label: "Leírás", type: "select" },
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
}: {
	template: Template;
	setTemplate: React.Dispatch<React.SetStateAction<Template>>;
	products: Product[];
	items: string[];
	onClickAddItem: (e: string) => void;
	onClickDeleteItem: (e: string) => void;
}) {
	return (
		<div className='flex flex-col w-full gap-5 h-full overflow-y-scroll px-3'>
			<div>
				<div>Név</div>
				<Input value={template.name} onChange={(e) => setTemplate({ ...template, name: e.target.value })} />
			</div>
			<div>
				<div>Típus</div>
				<Select
					options={[
						"Helyi elszívós rendszer",
						"Központi ventillátoros",
						"Passzív rendszer",
						"Hővisszanyerős",
					].map((type) => ({
						label: type,
						value: type,
					}))}
					onChange={(e) => setTemplate({ ...template, type: e })}
					value={template.type}
				/>
			</div>
			<div>
				<div>Leírás</div>
				<Textarea value={template.description} onChange={(e) => setTemplate({ ...template, description: e })} />
			</div>
			<div>
				<div className='-mt-10'>
					<Heading title='Tételek' variant='h4' />
				</div>
				<div className='relative bottom-10'>
					<AutoComplete
						optionDisplayDirection='top'
						options={products
							.filter((product) => !items.map((item) => item).includes(product.id.toString()))
							.map((product) => ({
								label: product.sku + " - " + product.name,
								value: product.id.toString(),
							}))}
						onChange={onClickAddItem}
						value=''
					/>
				</div>
				<div className='flex flex-col gap-5'>
					{items.map((item) => (
						<div
							key={item}
							className='flex flex-row w-full items-center justify-between border-b pb-2 gap-3'>
							<div>
								{products.find((product) => product.id.toString() === item)?.sku} -{" "}
								{products.find((product) => product.id.toString() === item)?.name}
							</div>
							<Button variant='destructive' onClick={() => onClickDeleteItem(item)}>
								<XMarkIcon className='w-5 h-5 text-white' />
							</Button>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
