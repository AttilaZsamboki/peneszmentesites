"use client";

import { ColDef } from "ag-grid-community";
import BaseComponent from "../_components/BaseComponent";
import { Template } from "./page";
import React from "react";
import Input from "../_components/Input";
import Select from "../_components/Select";
import Textarea from "../_components/Textarea";
import AutoComplete from "../_components/AutoComplete";
import { Product } from "../products/page";
import Heading from "../_components/Heading";
import { XMarkIcon } from "@heroicons/react/20/solid";
import { Button } from "@material-tailwind/react";

export default function Page({ templates, products }: { templates: Template[]; products: Product[] }) {
	const columnDefs: ColDef[] = [
		{ field: "name", headerName: "Név" },
		{ field: "type", headerName: "Típus" },
		{ field: "description", headerName: "Leírás" },
	];
	const [selectedRow, setSelectedRow] = React.useState<any>(0);
	const [template, setTemplate] = React.useState<Template>({ description: "", name: "", type: "", id: 0 });
	const [items, setItems] = React.useState<string[]>([]);
	const [upToDateTemplates, setUpToDateTemplates] = React.useState<Template[]>(templates);

	React.useEffect(() => {
		if (selectedRow) {
			setTemplate({ ...selectedRow[0], type: selectedRow[0].type as string });
			const fetchItems = async () => {
				const response: { product: number; template: number }[] = await fetch(
					`http://pen.dataupload.xyz/product_templates/${selectedRow[0].id}`
				).then((res) => res.json());
				setItems(response.map((item: { product: number }) => item.product.toString()));
			};
			fetchItems();
		}
	}, [selectedRow]);

	const createTemplate = async () => {
		const templateResponse = await fetch("http://pen.dataupload.xyz/templates/", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(template),
		}).then((res) => res.json());
		items.map(
			async (item) =>
				await fetch("http://pen.dataupload.xyz/product_templates/", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ template_id: templateResponse.id, product_id: parseInt(item) }),
				})
		);
		setUpToDateTemplates([...upToDateTemplates, templateResponse]);
	};
	const deleteTemplate = async () => {
		const response = await fetch(`http://pen.dataupload.xyz/templates/${selectedRow[0].id}/`, {
			method: "DELETE",
		});
		if (response.ok) {
			setUpToDateTemplates(templates.filter((template) => template.id !== selectedRow[0].id));
			setSelectedRow(0);
		}
	};
	return (
		<BaseComponent
			title='Sablonok'
			columnDefs={columnDefs}
			onDelete={deleteTemplate}
			selectedRow={selectedRow}
			data={upToDateTemplates}
			filterType='template'
			setSelectedRow={setSelectedRow}
			onCreate={createTemplate}
			onCancelCreate={() => {
				setTemplate({ description: "", name: "", type: "", id: 0 });
				setItems([]);
			}}
			createForm={
				<CreateForm
					template={template}
					setTemplate={setTemplate}
					products={products}
					items={items}
					setItems={setItems}
				/>
			}
			updateForm={
				<CreateForm
					template={template}
					setTemplate={setTemplate}
					products={products}
					items={items}
					setItems={setItems}
				/>
			}
		/>
	);
}

function CreateForm({
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
		<div className='max-h-[500px]'>
			<div className='flex flex-col w-full gap-5 overflow-y-scroll px-3'>
				<div>
					<div>Név</div>
					<Input value={template.name} onChange={(e) => setTemplate({ ...template, name: e.target.value })} />
				</div>
				<div>
					<div>Típus</div>
					<Select
						options={["Helyi elszívós rendszer", "Központi ventillátoros", "Passzív rendszer"]}
						onChange={(e) => setTemplate({ ...template, type: e })}
						value={template.type}
					/>
				</div>
				<div>
					<div>Leírás</div>
					<Textarea
						value={template.description}
						onChange={(e) => setTemplate({ ...template, description: e })}
					/>
				</div>
				<div>
					<div className='-mt-10'>
						<Heading title='Tételek' variant='h4' />
					</div>
					<div className='relative bottom-10'>
						<AutoComplete
							options={products.map((product) => ({ label: product.name, value: product.id.toString() }))}
							onChange={(e) => setItems([...items, e])}
							value=''
						/>
					</div>
					<div className='flex flex-col gap-5'>
						{items.map((item) => (
							<div key={item} className='flex flex-row w-full items-center justify-between border-b pb-2'>
								<div>{products.find((product) => product.id.toString() === item)?.name}</div>
								<Button
									size='sm'
									color='red'
									onClick={() => setItems([...items.filter((i) => i !== item)])}>
									<XMarkIcon className='w-5 h-5 text-white' />
								</Button>
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}
