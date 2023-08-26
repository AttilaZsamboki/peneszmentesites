"use client";
import { Option, Select } from "@material-tailwind/react";
import AutoComplete from "../_components/AutoComplete";
import Input from "../_components/Input";
import BaseComponent from "../_components/BaseComponent";
import { Product } from "../products/page";
import { Question } from "./page";
import React from "react";
import MultipleChoiceCombobox from "../_components/MultipleChoiceList";
import Counter from "../_components/Counter";
import { ColDef, ValueGetterParams } from "ag-grid-community";

export default function ClientComponent({ data, products }: { data: Question[]; products: Product[] }) {
	const [question, setQuestion] = React.useState<Question>({
		question: "",
		id: 0,
		type: "",
		options: "{}",
		connection: "",
		product: 0,
	});
	const [upToDateData, setUpToDateData] = React.useState<Question[]>(data);
	const [selectedRow, setSelectedRow] = React.useState<any>(null);

	React.useEffect(() => {
		if (selectedRow) {
			setQuestion(selectedRow[0]);
		}
	}, [selectedRow]);

	const createQuestion = async () => {
		const response = await fetch("http://pen.dataupload.xyz/questions/", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(question),
		});
		if (response.ok) {
			setUpToDateData((prev) => [...prev, question]);
			setQuestion({ question: "", id: 0, type: "", options: "{}", connection: "", product: 0 });
		}
	};

	const typeMap = {
		TEXT: "Szöveg",
		LIST: "Lista",
		MULTIPLE_CHOICE: "Több választós",
		GRID: "Rács",
		CHECKBOX_GRID: "Jelölőnégyzetes rács",
		SCALE: "Skála",
		FILE_UPLOAD: "Fájlfeltöltés",
	};
	const columnDefs: ColDef[] = [
		{ field: "question", headerName: "Kérdés" },
		{
			field: "type",
			headerName: "Típus",
			valueGetter: (params: ValueGetterParams) => typeMap[params.data.type as keyof typeof typeMap],
		},
		{ field: "connection", headerName: "Kapcsolat" },
		{
			headerName: "Termék",
			valueGetter: (params: ValueGetterParams) =>
				products.find((product) => product.id === params.data.product)?.name,
		},
	];

	return (
		<BaseComponent
			filterType='question'
			data={upToDateData}
			createForm={<CreateForm question={question} setQuestion={setQuestion} products={products} />}
			selectedRow={selectedRow}
			onCreate={createQuestion}
			updateForm={<CreateForm question={question} setQuestion={setQuestion} products={products} />}
			onUpdate={async () => {
				const response = await fetch(`http://pen.dataupload.xyz/questions/${question.id}/`, {
					method: "PUT",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(question),
				});
				if (response.ok) {
					setUpToDateData((prev) => prev.map((q) => (q.id === question.id ? question : q)));
				}
			}}
			setSelectedRow={setSelectedRow}
			title='Kérdések'
			columnDefs={columnDefs}
			onDelete={async () => {
				const response = await fetch(`http://pen.dataupload.xyz/questions/${question.id}/`, {
					method: "DELETE",
				});
				if (response.ok) {
					setUpToDateData((prev) => prev.filter((q) => q.id !== question.id));
				}
			}}
		/>
	);
}

function CreateForm({
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
			<Select color='gray' label='Típus' onChange={(e) => setQuestion((prev) => ({ ...prev, type: e || "" }))}>
				<Option value='TEXT'>Szöveg</Option>
				<Option value='LIST'>Lista</Option>
				<Option value='MULTIPLE_CHOICE'>Több választós</Option>
				<Option value='GRID'>Rács</Option>
				<Option value='CHECKBOX_GRID'>Jelölőnégyzetes rács</Option>
				<Option value='SCALE'>Skála</Option>
				<Option value='FILE_UPLOAD'>Fájlfeltöltés</Option>
			</Select>
			<OptionChooser options={question.options} setQuestion={setQuestion} type={question.type} />
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
				/>
			</div>
		);
	} else if (type === "GRID" || type === "CHECKBOX_GRID") {
		return (
			<div className='flex flex-col gap-2'>
				<div className='text-sm'>Oszlopok</div>
				<MultipleChoiceCombobox
					options={[]}
					onChange={(e) =>
						setQuestion((prev) => ({ ...prev, options: { columns: e, rows: prev.options.rows } }))
					}
				/>
				<div className='text-sm'>Sorok</div>
				<MultipleChoiceCombobox
					options={[]}
					onChange={(e) =>
						setQuestion((prev) => ({ ...prev, options: { rows: e, columns: prev.options.columns } }))
					}
				/>
			</div>
		);
	} else if (type === "SCALE") {
		return (
			<div className='flex flex-col gap-2'>
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
