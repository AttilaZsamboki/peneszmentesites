"use client";
import {
	Button,
	Card,
	CardBody,
	CardFooter,
	CardHeader,
	Checkbox,
	Dialog,
	Option,
	Select,
	Typography,
} from "@material-tailwind/react";
import AutoComplete from "../_components/AutoComplete";
import Input from "../_components/Input";
import { Product } from "../products/page";
import { Question } from "./page";
import { typeMap } from "../_utils/utils";
import React from "react";
import BaseComponentV2 from "../_components/BaseComponentV2";

import MultipleChoiceCombobox from "../_components/MultipleChoiceList";
import Counter from "../_components/Counter";
import { TrashIcon } from "@heroicons/react/20/solid";
export default function ClientComponent({ data, products }: { data: any; products: Product[] }) {
	const [question, setQuestion] = React.useState<Question>({
		question: "",
		id: 0,
		type: "",
		options: "{}",
		connection: "",
		mandatory: false,
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
			body: JSON.stringify(question),
		});
		if (response.ok) {
			setQuestion({ question: "", id: 0, type: "", options: "{}", connection: "", product: 0, mandatory: false });
			setAllQuestions((prev) => [
				...prev,
				{
					...question,
					subtitle:
						question.connection === "Fix"
							? "Fix"
							: products.find((product) => product.id === question.product)?.sku +
									" - " +
									(products
										.find((product) => product.id === question.product)
										?.name.substring(0, 25) +
										((
											products.find((product) => product.id === question.product)
												? products.find((product) => product.id === question.product)!.name
														.length > 25
												: false
										)
											? "..."
											: "")) ||
							  "" ||
							  "",
					subtitle2: (typeMap as any)[question.type] || "Nincs típus",
					isMandatory: question.mandatory ? "Kötelező" : "Nem kötelező",
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
			await fetch("/api/revalidate?tag=questions");
			setAllQuestions((prev) => {
				const index = prev.findIndex((item) => item.id === question.id);
				const newArr = [...prev];
				newArr[index] = {
					...question,
					subtitle:
						question.connection === "Fix"
							? "Fix"
							: products.find((product) => product.id === question.product)?.sku +
									" - " +
									(products
										.find((product) => product.id === question.product)
										?.name.substring(0, 25) +
										((
											products.find((product) => product.id === question.product)
												? products.find((product) => product.id === question.product)!.name
														.length > 25
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
				handler={() => setOpenDialog(!openDialog)}
				title={!isNew ? question.question : "Új kérdés"}
				onDelete={!isNew ? deleteQuestion : undefined}
				onSave={!isNew ? updateQuestion : createQuestion}
				onCancel={() =>
					setQuestion({ question: "", id: 0, type: "", options: "{}", connection: "", mandatory: false })
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
			{question.connection === "Termék" ? (
				<div>
					<div>Termék</div>
					<AutoComplete
						value={products.find((product) => product.id === question.product)?.name || ""}
						onChange={(e) => e && setQuestion((prev) => ({ ...prev, product: parseInt(e) }))}
						options={products.map((product) => ({ value: product.id.toString(), label: product.name }))}
					/>
				</div>
			) : null}
			<Select
				color='gray'
				label='Típus'
				value={question.type}
				onChange={(e) => setQuestion((prev) => ({ ...prev, type: e || "" }))}>
				<Option value='TEXT'>Szöveg</Option>
				<Option value='LIST'>Lista</Option>
				<Option value='MULTIPLE_CHOICE'>Több választós</Option>
				<Option value='GRID'>Rács</Option>
				<Option value='CHECKBOX_GRID'>Jelölőnégyzetes rács</Option>
				<Option value='SCALE'>Skála</Option>
				<Option value='FILE_UPLOAD'>Fájlfeltöltés</Option>
			</Select>
			<OptionChooser options={question.options} setQuestion={setQuestion} type={question.type} />
			<Checkbox
				checked={question.mandatory}
				onChange={() => setQuestion((prev) => ({ ...prev, mandatory: !prev.mandatory }))}
				crossOrigin=''
				label='Kötelező'
			/>
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

export function CustomDialog({
	open,
	handler,
	children,
	onSave,
	title,
	onCancel,
	onDelete,
}: {
	open: boolean;
	handler: () => void;
	children: React.ReactNode;
	onSave?: () => void;
	title: string;
	onCancel?: () => void;
	onDelete?: () => void;
}) {
	return (
		<Dialog size='lg' open={open} handler={handler} className='bg-transparent shadow-none'>
			<Card className='mx-auto w-full max-w-full max-h-[70%]'>
				<CardHeader variant='gradient' color='gray' className='mb-4 pl-4 grid h-28 place-items-center '>
					<div className='flex flex-row w-full items-center justify-between px-20'>
						<Typography variant='h4' color='white' className='text-left'>
							{title}
						</Typography>
						{onDelete ? (
							<Button onClick={onDelete}>
								<TrashIcon className='w-7 h-7 text-red-700' />
							</Button>
						) : null}
					</div>
				</CardHeader>
				<CardBody className='flex flex-col gap-4 overflow-y-scroll h-[70%]'>{children}</CardBody>
				<CardFooter>
					<div className='flex flex-row justify-end w-full gap-5'>
						<Button
							color='green'
							onClick={() => {
								onSave ? onSave() : {};
								handler();
							}}>
							Mentés
						</Button>
						<Button
							variant='outlined'
							onClick={() => {
								handler();
								onCancel ? onCancel() : {};
							}}>
							Mégsem
						</Button>
					</div>
				</CardFooter>
			</Card>
		</Dialog>
	);
}
