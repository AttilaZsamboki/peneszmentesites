"use client";
import { Checkbox } from "@/components/ui/checkbox";
import React from "react";

import AutoComplete from "../_components/AutoComplete";
import Input from "../_components/Input";
import BaseComponentV2 from "../_components/BaseComponentV2";
import MultipleChoiceCombobox from "../_components/MultipleChoiceList";
import Counter from "../_components/Counter";
import CustomDialog from "../_components/CustomDialog";
import FormList from "../_components/FormList";

import { Product } from "../products/page";

import { Question } from "./page";

import { typeMap } from "../_utils/utils";
import { getFirstProduct } from "../_utils/utils";
import FormField from "../_components/FormField";
import { useToast } from "@/components/ui/use-toast";
import { Textarea } from "@/components/ui/textarea";

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
	const { toast } = useToast();

	const createQuestion = async () => {
		const response = await fetch("https://pen.dataupload.xyz/questions/", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ ...question, id: undefined, products: undefined }),
		});
		if (response.ok) {
			const data = await response.json();
			question.products
				? await Promise.all(
						question.products.map(
							async (product) =>
								await fetch("https://pen.dataupload.xyz/question_products/", {
									method: "POST",
									headers: {
										"Content-Type": "application/json",
									},
									body: JSON.stringify({
										question_id: data.id,
										product_id: product,
									}),
								})
						)
				  )
				: null;
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
					Termék:
						question.connection === "Fix"
							? "Fix"
							: products.find(getFirstProduct(question))?.sku +
							  " - " +
							  products.find(getFirstProduct(question))?.name,
					Típus: (typeMap as any)[question.type] || "Nincs típus",
					Kötelező: question.mandatory ? "Kötelező" : "Nem kötelező",
					id: data.id,
					product: null,
				},
			]);
			await fetch("/api/revalidate?tag=questions");
			setOpenDialog(false);
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
			let responseProduct: Response;
			if (question.connection === "Fix" && question.products) {
				responseProduct = await fetch(`https://pen.dataupload.xyz/question_products/${question.id}/`, {
					method: "DELETE",
				});
			} else {
				responseProduct = await fetch(
					`https://pen.dataupload.xyz/question_products/?question_id=${question.id}`,
					{
						method: "PUT",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify(question.products),
					}
				);
			}
			if (responseProduct.ok) {
				await fetch("/api/revalidate?tag=questions");
				setAllQuestions((prev) => {
					const index = prev.findIndex((item) => item.id === question.id);
					const newArr = [...prev];
					newArr[index] = {
						...question,
						Termék:
							question.connection === "Fix"
								? "Fix"
								: products.find(getFirstProduct(question))?.sku +
								  " - " +
								  products.find(getFirstProduct(question))?.name,
						Típus: (typeMap as any)[question.type] || "Nincs típus",
						Kötelező: question.mandatory ? "Kötelező" : "Nem kötelező",
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
		} else {
			const body = await response.text();
			const bodyAsString = JSON.stringify(body); // Parse the JSON response into a string

			if (bodyAsString.includes("pen_felmeres_questions_pen_questions_id_fk")) {
				toast({
					title: "Hiba",
					description: "Ez a kérdés már szerepel egy felmérésben, ezért nem törölhető!",
				});
			}
		}
		setOpenDialog(false);
		setQuestion({
			question: "",
			id: 0,
			type: "",
			options: "{}",
			connection: "",
			mandatory: false,
			description: "",
		});
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
					subtitle2: "Termék",
					subtitle: "Típus",
					subtitle3: "Kötelező",
				}}
				filters={[
					{ field: "Név", type: "select", label: "Név" },
					{ field: "jsonProducts", type: "text", label: "Termék" },
					{ field: "Típus", type: "select", label: "Típus" },
					{
						field: "Kötelező",
						type: "select",
						label: "Kötelező",
					},
					{
						field: "connection",
						type: "select",
						label: "Kapcsolat",
						options: [
							{ label: "Fix", value: "Fix" },
							{ label: "Termék", value: "Termék" },
						],
					},
				]}
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
				handler={() => {
					setOpenDialog(!openDialog);
					resetQuestion();
				}}
				title={!isNew ? question.question : "Új kérdés"}
				onDelete={!isNew ? deleteQuestion : undefined}
				onSave={!isNew ? updateQuestion : createQuestion}
				onCancel={resetQuestion}>
				<QuestionForm question={question} setQuestion={setQuestion} products={products} />
			</CustomDialog>
		</>
	);

	function resetQuestion(): void {
		return setQuestion({
			question: "",
			id: 0,
			type: "",
			options: "{}",
			connection: "",
			mandatory: false,
			description: "",
		});
	}
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
		<div className='flex flex-col w-full gap-5 h-full overflow-y-scroll px-2'>
			<FormField title='Kérdés'>
				<Input
					value={question.question}
					onChange={(e) => setQuestion((prev) => ({ ...prev, question: e.target.value }))}
				/>
			</FormField>
			<FormField title='Kapcsolat'>
				<AutoComplete
					onSelect={(e) => setQuestion((prev) => ({ ...prev, connection: (e as "Fix" | "Termék") ?? "" }))}
					options={["Termék", "Fix"].map((option) => ({ label: option, value: option }))}
					value={question.connection}
				/>
			</FormField>
			<FormField title='Típus'>
				<AutoComplete
					onSelect={(e) => {
						setQuestion((prev) => ({ ...prev, type: e }));
					}}
					options={Object.keys(typeMap).map((key) => ({
						value: key,
						label: typeMap[key as keyof typeof typeMap] ? typeMap[key as keyof typeof typeMap] : "",
					}))}
					value={question.type}
				/>
			</FormField>
			<OptionChooser options={question.options} setQuestion={setQuestion} type={question.type} />
			<FormField title='Kötelező'>
				<Checkbox
					checked={question.mandatory}
					onCheckedChange={() => setQuestion((prev) => ({ ...prev, mandatory: !prev.mandatory }))}
				/>
			</FormField>
			<FormField title='Leírás'>
				<Textarea
					value={question.description}
					onChange={(e) => setQuestion((prev) => ({ ...prev, description: e.target.value }))}
				/>
			</FormField>
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
					optionDisplayDirection='top'
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
	} else if (type === "LIST" || type === "MULTIPLE_CHOICE" || type === "CHECKBOX") {
		return (
			<FormField title='Opciók'>
				<MultipleChoiceCombobox
					options={[]}
					onChange={(e) => setQuestion((prev) => ({ ...prev, options: e }))}
					value={options}
				/>
			</FormField>
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
