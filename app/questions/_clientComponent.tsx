"use client";
import { Checkbox, Option, Select } from "@material-tailwind/react";
import React from "react";
import { useSearchParams } from "next/navigation";

import AutoComplete from "../_components/AutoComplete";
import Input from "../_components/Input";
import BaseComponentV2 from "../_components/BaseComponentV2";
import MultipleChoiceCombobox from "../_components/MultipleChoiceList";
import Counter from "../_components/Counter";
import CustomDialog from "../_components/CustomDialog";
import Textarea from "../_components/Textarea";
import FormList from "../_components/FormList";

import { Product } from "../products/page";

import { Question, getFirstProduct } from "./page";

import { typeMap } from "../_utils/utils";

export default function ClientComponent({ data, products }: { data: any; products: Product[] }) {
	const [question, setQuestion] = React.useState<Question>({
		question: "",
		id: 0,
		type: "",
		options: "{}",
		connection: "",
		mandatory: false,
		description: "",
	});
	const [openDialog, setOpenDialog] = React.useState(false);
	const [allQuestions, setAllQuestions] = React.useState<any[]>(data);
	const [isNew, setIsNew] = React.useState(false);

	const createQuestion = async () => {
		const response = await fetch("https://pen.dataupload.xyz/questions/", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ ...question, id: undefined, product: undefined }),
		});
		if (response.ok) {
			const data = await response.json();
			setQuestion({
				question: "",
				id: 0,
				type: "",
				options: "{}",
				connection: "",
				products: [],
				mandatory: false,
				description: "",
			});
			setAllQuestions((prev) => [
				...prev,
				{
					...question,
					subtitle:
						question.connection === "Fix"
							? "Fix"
							: products.find(getFirstProduct(question))?.sku +
									" - " +
									(products.find(getFirstProduct(question))?.name.substring(0, 25) +
										((
											products.find(getFirstProduct(question))
												? products.find(getFirstProduct(question))!.name.length > 25
												: false
										)
											? "..."
											: "")) ||
							  "" ||
							  "",
					subtitle2: (typeMap as any)[question.type] || "Nincs típus",
					isMandatory: question.mandatory ? "Kötelező" : "Nem kötelező",
					id: data.id,
				},
			]);
			setOpenDialog(false);
			await fetch("/api/revalidate?tag=questions");
		}
	};

	const updateQuestion = async () => {
		const response = await fetch(`https://pen.dataupload.xyz/questions/${question.id}/`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(question),
		});
		if (response.ok) {
			const responseProduct = await fetch(
				`https://pen.dataupload.xyz/question_products/?question_id=${question.id}`,
				{
					method: "PUT",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(question.products),
				}
			);
			if (responseProduct.ok) {
				await fetch("/api/revalidate?tag=questions");
				setAllQuestions((prev) => {
					const index = prev.findIndex((item) => item.id === question.id);
					const newArr = [...prev];
					newArr[index] = {
						...question,
						subtitle:
							question.connection === "Fix"
								? "Fix"
								: products.find(getFirstProduct(question))?.sku +
										" - " +
										(products.find(getFirstProduct(question))?.name.substring(0, 25) +
											((
												products.find(getFirstProduct(question))
													? products.find(getFirstProduct(question))!.name.length > 25
													: false
											)
												? "..."
												: "")) ||
								  "" ||
								  "",
						subtitle2: (typeMap as any)[question.type] || "Nincs típus",
						isMandatory: question.mandatory ? "Kötelező" : "Nem kötelező",
					};
					return newArr;
				});
			}
		}
	};
	const deleteQuestion = async () => {
		const response = await fetch(`https://pen.dataupload.xyz/questions/${question.id}/`, {
			method: "DELETE",
		});
		if (response.ok) {
			await fetch("/api/revalidate?tag=questions");
			setAllQuestions((prev) => prev.filter((item) => item.id !== question.id));
			setOpenDialog(false);
		}
	};

	return (
		<>
			<BaseComponentV2
				title='Kérdések'
				createButtonTitle='Új kérdés'
				data={allQuestions}
				editType='dialog'
				itemContent={{
					id: "id",
					title: "question",
					subtitle2: "subtitle",
					subtitle: "subtitle2",
					subtitle3: "isMandatory",
				}}
				onEditItem={(item) => {
					setQuestion(item);
					setOpenDialog(true);
					setIsNew(false);
				}}
				onCreateNew={() => {
					setOpenDialog(true);
					setIsNew(true);
				}}
			/>
			<CustomDialog
				open={openDialog}
				disabledSubmit={
					question.question === "" ||
					question.type === "" ||
					question.connection === "" ||
					(!["TEXT", "FILE_UPLOAD"].includes(question.type) ? question.options === "{}" : false) ||
					(question.connection === "Termék" ? question.products?.length === 0 || !question.products : false)
				}
				handler={() => setOpenDialog(!openDialog)}
				title={!isNew ? question.question : "Új kérdés"}
				onDelete={!isNew ? deleteQuestion : undefined}
				onSave={!isNew ? updateQuestion : createQuestion}
				onCancel={() =>
					setQuestion({
						question: "",
						id: 0,
						type: "",
						options: "{}",
						connection: "",
						mandatory: false,
						description: "",
					})
				}>
				<QuestionForm question={question} setQuestion={setQuestion} products={products} />
			</CustomDialog>
		</>
	);
}

function QuestionForm({
	question,
	setQuestion,
	products,
}: {
	question: Question;
	setQuestion: React.Dispatch<React.SetStateAction<Question>>;
	products: Product[];
}) {
	const productItems = question.products ? question.products.map((id) => products.find((p) => p.id === id)) : [];
	const items = productItems ? productItems.map((item) => (item ? item.sku + " - " + item.name : "")) : [];

	return (
		<div className='flex flex-col w-full gap-5'>
			<Input
				value={question.question}
				label='Kérdés'
				onChange={(e) => setQuestion((prev) => ({ ...prev, question: e.target.value }))}
			/>
			<Select
				color='gray'
				label='Kapcsolat'
				onChange={(e) => setQuestion((prev) => ({ ...prev, connection: e ?? "" }))}
				value={question.connection}>
				<Option value='Termék'>Termék</Option>
				<Option value='Fix'>Fix</Option>
			</Select>
			<div>
				<div className='text-sm'>Típus</div>
				<AutoComplete
					onChange={(e) => {
						setQuestion((prev) => ({ ...prev, type: e || "" }));
					}}
					options={Object.keys(typeMap).map((key) => ({ value: key, label: (typeMap as any)[key] }))}
					value={(typeMap as any)[question.type]}
				/>
			</div>
			<OptionChooser options={question.options} setQuestion={setQuestion} type={question.type} />
			<Checkbox
				checked={question.mandatory}
				onChange={() => setQuestion((prev) => ({ ...prev, mandatory: !prev.mandatory }))}
				crossOrigin=''
				label='Kötelező'
			/>
			<div>
				<div className='text-sm mb-1'>Leírás</div>
				<Textarea
					value={question.description}
					onChange={(e) => setQuestion((prev) => ({ ...prev, description: e }))}
				/>
			</div>
			{question.connection === "Termék" ? (
				<FormList
					title='Termékek'
					items={items}
					onAddNewItem={(value) => {
						const product = products.find((product) => product.id.toString() === value);
						if (product) {
							setQuestion((prev) => ({
								...prev,
								products: [...(question.products ? question.products : []), product.id],
							}));
						}
					}}
					onDeleteItem={(item) => {
						const product = products
							.map((product) => ({
								value: product.id.toString(),
								label: product.sku + " - " + product.name,
							}))
							.find((product) => product.label === item)?.value;
						setQuestion((prev) => ({
							...prev,
							products: [
								...(product
									? prev.products
										? prev.products!.filter((prod) => prod !== parseInt(product))
										: []
									: []),
							] as number[],
						}));
					}}
					options={products
						.filter((product) => !question.products?.includes(product.id))
						.map((product) => ({
							value: product.id.toString(),
							label: product.sku + " - " + product.name,
						}))}
					value=''
				/>
			) : null}
		</div>
	);
}

function OptionChooser({
	options,
	setQuestion,
	type,
}: {
	options: any;
	setQuestion: React.Dispatch<React.SetStateAction<Question>>;
	type: string;
}) {
	if (type === "TEXT" || type === "FILE_UPLOAD") {
		return;
	} else if (type === "LIST" || type === "MULTIPLE_CHOICE") {
		return (
			<div className='flex flex-col gap-2'>
				<div className='text-sm'>Opciók</div>
				<MultipleChoiceCombobox
					options={[]}
					onChange={(e) => setQuestion((prev) => ({ ...prev, options: e }))}
					value={options}
				/>
			</div>
		);
	} else if (type === "GRID" || type === "CHECKBOX_GRID") {
		return (
			<div className='flex flex-col gap-2'>
				<div className='text-sm'>Oszlopok</div>
				<MultipleChoiceCombobox
					options={[]}
					value={options.columns}
					onChange={(e) =>
						setQuestion((prev) => ({ ...prev, options: { columns: e, rows: prev.options.rows } }))
					}
				/>
				<div className='text-sm'>Sorok</div>
				<MultipleChoiceCombobox
					options={[]}
					value={options.rows}
					onChange={(e) =>
						setQuestion((prev) => ({ ...prev, options: { rows: e, columns: prev.options.columns } }))
					}
				/>
			</div>
		);
	} else if (type === "SCALE") {
		return (
			<div className='flex flex-col gap-2 '>
				<Counter
					onChange={(value) =>
						setQuestion((prev) => ({
							...prev,
							options: { min: value, max: prev.options.max },
						}))
					}
					value={options.min || 0}
					label='Minimum'
				/>
				<Counter
					onChange={(value) =>
						setQuestion((prev) => ({
							...prev,
							options: { max: value, min: prev.options.min },
						}))
					}
					value={options.max || 0}
					label='Maximum'
				/>
			</div>
		);
	}
}
