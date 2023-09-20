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

	const createTemplate = async () => {
		const templateResponse = await fetch("https://pen.dataupload.xyz/templates/", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(template),
		});
		if (templateResponse.ok) {
			const templateResponseData = await templateResponse.json();
			await Promise.all(
				items.map(
					async (item) =>
						await fetch("https://pen.dataupload.xyz/product_templates/", {
							method: "POST",
							headers: {
								"Content-Type": "application/json",
							},
							body: JSON.stringify({ template_id: templateResponseData.id, product_id: parseInt(item) }),
						})
				)
			);
			setUpToDateTemplates([
				...upToDateTemplates,
				{
					...templateResponseData,
					truncatedDescription:
						templateResponseData.description.substring(0, 40) +
						(templateResponseData.description.length > 40 ? "..." : ""),
				},
			]);
			setItems([]);
			resetTemplate();
			await fetch("/api/revalidate?tag=templates");
		}
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
	const updateTemplate = async () => {
		const response = await fetch(`https://pen.dataupload.xyz/templates/${template.id}/`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(template),
		});

		await fetch(`https://pen.dataupload.xyz/product_templates/?template_id=${template.id}`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(items),
		});
		if (response.ok) {
			await fetch("/api/revalidate?tag=templates");
			setUpToDateTemplates((prev) => {
				const index = prev.findIndex((item) => item.id === template.id);
				const newArr = [...prev];
				newArr[index] = {
					...template,
					truncatedDescription:
						template.description.substring(0, 35) + (template.description.length > 35 ? "..." : ""),
				};
				return newArr;
			});
		}
	};

	return (
		<>
			<BaseComponentV2
				createButtonTitle='Új sablon'
				data={upToDateTemplates}
				editType='dialog'
				itemContent={{ title: "name", subtitle: "type", subtitle2: "truncatedDescription", id: "id" }}
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
				onSave={!isNew ? updateTemplate : createTemplate}
				onCancel={resetTemplate}>
				<Form
					items={items}
					products={products}
					setItems={setItems}
					setTemplate={setTemplate}
					template={template}
				/>
			</CustomDialog>
		</>
	);

	function resetTemplate(): void {
		return setTemplate({ description: "", name: "", type: "", id: 0 });
	}
}

function Form({
	template,
	setTemplate,
	products,
	items,
	setItems,
}: {
	template: Template;
	setTemplate: React.Dispatch<React.SetStateAction<Template>>;
	products: Product[];
	items: string[];
	setItems: React.Dispatch<React.SetStateAction<string[]>>;
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
						onChange={(e) => setItems([...items, e])}
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
							<Button
								variant='destructive'
								onClick={() => setItems([...items.filter((i) => i !== item)])}>
								<XMarkIcon className='w-5 h-5 text-white' />
							</Button>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
