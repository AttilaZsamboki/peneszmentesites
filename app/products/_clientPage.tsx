"use client";
import { hufFormatter } from "../[id]/_clientPage";
import BaseComponentV2 from "../_components/BaseComponentV2";
import { Checkbox } from "@/components/ui/checkbox";
import React from "react";
import { Product } from "./page";
import CustomDialog from "../_components/CustomDialog";
import FormList from "../_components/FormList";
import { Question } from "../questions/page";
import { typeMap } from "../_utils/utils";

export interface ProductAttributes {
	id?: number;
	product_id?: number;
	place: boolean;
	place_options: string[];
	product?: number;
}

export default function ClientPage({
	data,
	questions,
}: {
	data: { count: number; results: Product[] };
	questions: Question[];
}) {
	const [attributeData, setAttributeData] = React.useState<ProductAttributes>({
		id: 0,
		place_options: [],
		product: 0,
		place: false,
	});
	const [productData, setProductData] = React.useState<Product>({
		id: 0,
		name: "",
		sku: "",
		type: "",
		price_list_alapertelmezett_net_price_huf: 0,
	});
	const [open, setOpen] = React.useState(false);
	const [newQuestions, setNewQuestions] = React.useState<Question[]>([]);

	React.useEffect(() => {
		if (productData.id !== 0) {
			const fetchAttributes = async () => {
				const resp = await fetch(`https://pen.dataupload.xyz/product_attributes/${productData.id}`);
				if (resp.ok) {
					const data = await resp.json();
					if (data.length) {
						setAttributeData({
							...data[0],
							place_options: JSON.parse(
								(data[0].place_options as unknown as string).replace(/\\/g, "").replace(/'/g, '"')
							),
						});
					} else {
						setAttributeData({
							place_options: [],
							product: productData.id,
							place: false,
						});
					}
				}
			};
			fetchAttributes();
		}
	}, [productData]);

	const submitChanges = async () => {
		const payload = JSON.stringify({
			...attributeData,
			place_options: JSON.stringify(attributeData.place_options).replace("[", "{").replace("]", "}"),
		});
		if (!attributeData.id) {
			await fetch("https://pen.dataupload.xyz/product_attributes", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: payload,
			});
		} else {
			await fetch(`https://pen.dataupload.xyz/product_attributes/${attributeData.id}/`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: payload,
			});
		}
		await fetch(`https://pen.dataupload.xyz/question_products/?product=${attributeData.product}`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(newQuestions.map((question) => question.id)),
		});
		await fetch("/api/revalidate?tag=product-attributes");
	};

	return (
		<>
			<BaseComponentV2
				data={data.results.map((data) => ({
					...data,
					priceStr: hufFormatter.format(data.price_list_alapertelmezett_net_price_huf),
				}))}
				editType='dialog'
				itemContent={{
					id: "id",
					subtitle: "name",
					title: "sku",
					subtitle2: "priceStr",
					subtitle3: "type",
				}}
				filters={[
					{
						field: "sku",
						label: "SKU",
						type: "select",
					},
					{
						field: "name",
						label: "Név",
						type: "select",
					},
					{
						field: "type",
						label: "Típus",
						type: "select",
					},
				]}
				title='Termékek'
				onEditItem={(item) => {
					setOpen(true);
					setProductData(item);
					setAttributeData((prev) => ({ ...prev }));
				}}
				pagination={{
					numPages: Math.ceil(data.count / 10),
					active: true,
				}}
			/>
			<CustomDialog
				handler={() => setOpen(!open)}
				open={open}
				title={productData.sku + " - " + productData.name}
				onCancel={() => {
					setOpen(false);
					setProductData({
						id: 0,
						name: "",
						sku: "",
						type: "",
						price_list_alapertelmezett_net_price_huf: 0,
					});
				}}
				onSave={submitChanges}>
				<UpdateForm
					attributeData={attributeData}
					setAttributeData={setAttributeData}
					allQuestions={questions}
					questions={newQuestions}
					setQuestions={setNewQuestions}
				/>
			</CustomDialog>
		</>
	);
}
function UpdateForm({
	attributeData,
	setAttributeData,
	allQuestions,
	questions,
	setQuestions,
}: {
	attributeData: ProductAttributes;
	setAttributeData: React.Dispatch<React.SetStateAction<ProductAttributes>>;
	allQuestions: Question[];
	questions: Question[];
	setQuestions: React.Dispatch<React.SetStateAction<Question[]>>;
}) {
	React.useEffect(() => {
		const fetchQuestions = async () => {
			const resp = await fetch(`https://pen.dataupload.xyz/question_products?product=${attributeData.product}`);
			if (resp.ok) {
				const data: { question: string; product: string }[] = await resp.json();
				data.map(async (question) => {
					const resp2 = await fetch(`https://pen.dataupload.xyz/questions/${question.question}`);
					if (resp2.ok) {
						const data2 = await resp2.json();
						setQuestions((prev) => [...prev.filter((question) => question.id !== data2.id), data2]);
					}
				});
			}
		};
		fetchQuestions();

		return () => {
			setQuestions([]);
		};
	}, [attributeData]);

	return (
		<div className='-ml-2.5 flex flex-col h-full overflow-y-scroll py-5 px-3'>
			<div className='flex flex-row items-center space-x-2'>
				<Checkbox
					checked={attributeData ? attributeData.place : false}
					onCheckedChange={() =>
						setAttributeData((prev) => ({
							...prev,
							place: !prev.place,
						}))
					}
				/>
				<label>Hely</label>
			</div>
			{attributeData.place ? (
				<FormList
					title='Opciók'
					onAddNewItem={(value) => {
						setAttributeData((prev) => ({
							...prev,
							place_options: [...prev.place_options, value],
						}));
					}}
					items={attributeData.place_options}
					onDeleteItem={(item) =>
						setAttributeData((prev) => ({
							...prev,
							place_options: prev.place_options.filter((o) => o !== item),
						}))
					}
					create={true}
					emptyOption={false}
					showOptions={true}
				/>
			) : (
				<div></div>
			)}
			<FormList
				title='Kérdések'
				accordion={(item) => <Accordion item={item} questions={questions} />}
				itemHref={(item) =>
					`/questions?filter=${encodeURIComponent(item)}%20${
						questions.filter((question) => question.question === item)[0].id
					}`
				}
				onDeleteItem={(item) =>
					setQuestions((prev) => [...prev.filter((question) => question.question !== item)])
				}
				items={questions.map((question) => question.question)}
				options={allQuestions
					.filter((question) => !questions.map((question) => question.id).includes(question.id))
					.map((question) => ({ value: question.question, label: question.question }))}
				onAddNewItem={(value) => {
					const question = allQuestions.filter((question) => question.question === value)[0];
					setQuestions((prev) => [...prev, question]);
				}}
			/>
		</div>
	);
}

function Accordion({ item, questions }: { item: string; questions: Question[] }) {
	const question = questions.filter((question) => question.question === item)[0];
	return (
		<div className='flex flex-col'>
			{question.description ? (
				<div>
					<span className='font-bold'>Leírás</span>: {question.description}
				</div>
			) : (
				<></>
			)}
			<div>
				<span className='font-bold'>Típus</span>: {typeMap[question.type as keyof typeof typeMap]}
			</div>
			<div>
				<span className='font-bold'>Kötelező</span>: {question.mandatory ? "Igen" : "Nem"}
			</div>
		</div>
	);
}
