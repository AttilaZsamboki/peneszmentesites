"use client";
import React from "react";
import AutoComplete from "@/app/_components/AutoComplete";
import { Question } from "@/app/questions/page";
import Input from "@/app/_components/Input";
import MultipleChoice from "@/app/_components/MultipleChoice";
import { FelmeresQuestions, GridOptions, ScaleOption } from "../felmeresek/page";
import { Grid } from "@/app/_components/Grid";
import FileUpload from "@/app/_components/FileUpload";

export default function FieldCreate({
	question,
	setGlobalData,
	adatlap_id,
	product,
}: {
	question: Question;
	setGlobalData: React.Dispatch<React.SetStateAction<FelmeresQuestions[]>>;
	adatlap_id: number;
	product?: string;
}) {
	const [data, setData] = React.useState<FelmeresQuestions>({
		adatlap_id: 0,
		id: 0,
		value: "",
		question: question.id,
		section: product ? product : "Fix",
	});
	const [randomId, setRandomId] = React.useState("");
	console.log(data);

	React.useEffect(() => {
		setGlobalData((prev) => [...prev.filter((felmeres) => felmeres.question !== question.id), data]);
	}, [data]);
	React.useEffect(() => {
		setRandomId(Math.floor(Math.random() * Date.now()).toString());
	}, []);
	React.useEffect(() => {
		setData({ ...data, section: product ? product : "Fix" });
	}, [product]);
	React.useEffect(() => {
		setData({ ...data, question: question.id });
	}, [question]);
	React.useEffect(() => {
		setData({ ...data, adatlap_id: adatlap_id });
	}, [adatlap_id]);

	const setterSingle = (value: string) => {
		setData((prev) => ({ ...prev, value: value }));
	};
	const setterMultipleUnordered = (value: string) => {
		let values = [""];
		if (data.value.includes(value) && values.length) {
			values = (data.value as unknown as string[]).filter((v) => v !== value);
		} else {
			values = [...(data.value as unknown as string[]), value];
		}
		setData(
			(prev) =>
				({
					...prev,
					value: values,
				} as unknown as FelmeresQuestions)
		);
	};
	const setterSingleOrdered = (value: { column: string; row: number }) => {
		setData(
			(prev) =>
				({
					...prev,
					value: [
						...((prev.value as unknown as Array<{ column: string; row: number }>)
							? (prev.value as unknown as Array<{ column: string; row: number }>).filter(
									(v) => v.row !== value.row
							  )
							: []),
						value,
					],
				} as unknown as FelmeresQuestions)
		);
	};
	const setterMultipleOrdered = (value: { column: string; row: number }) => {
		setData(
			(prev) =>
				({
					...data,
					value: prev.value
						? !(prev.value as unknown as Array<{ column: string; row: number }>).filter(
								(v) => v.column === value.column && v.row === value.row
						  ).length
							? [...(prev.value as unknown as Array<{ column: string; row: number }>), value]
							: (prev.value as unknown as Array<{ column: string; row: number }>).filter(
									(v) => !(v.column === value.column && v.row === value.row)
							  )
						: [value],
				} as unknown as FelmeresQuestions)
		);
	};
	if (question.type === "TEXT") {
		return <Input onChange={(e) => setterSingle(e.target.value)} value={data.value} variant='simple' />;
	} else if (question.type === "LIST") {
		return (
			<AutoComplete
				options={(question.options as string[]).map((option) => ({ label: option, value: option }))}
				onChange={setterSingle}
				value={data.value}
			/>
		);
	} else if (["MULTIPLE_CHOICE", "CHECKBOX"].includes(question.type)) {
		return (
			<MultipleChoice
				options={(question.options as string[]).map((option) => option)}
				value={data.value}
				onChange={question.type === "CHECKBOX" ? setterMultipleUnordered : setterSingle}
				radio={question.type === "MULTIPLE_CHOICE"}
			/>
		);
	} else if (question.type === "GRID" || question.type === "CHECKBOX_GRID") {
		return (
			<Grid
				columns={(question.options as GridOptions).columns}
				rows={(question.options as GridOptions).rows}
				value={data.value as unknown as { column: string; row: number }[]}
				onChange={(value) => {
					if (question.type === "CHECKBOX_GRID") {
						setterMultipleOrdered(value);
					} else {
						setterSingleOrdered(value);
					}
				}}
				radio={question.type === "CHECKBOX_GRID" ? false : true}
				disabled={false}
			/>
		);
	} else if (question.type === "SCALE") {
		return (
			<MultipleChoice
				options={Array.from({ length: (question.options as ScaleOption).max }, (_, i) => (i + 1).toString())}
				value={data.value}
				onChange={setterSingle}
				radio={true}
			/>
		);
	} else if (question.type === "FILE_UPLOAD") {
		return (
			<FileUpload
				route={`/api/save-image?id=${randomId}`}
				onUpload={() =>
					setData({
						adatlap_id: adatlap_id,
						id: 0,
						question: question.id,
						section: "Fix",
						value: "https://felmeres-note-images.s3.eu-central-1.amazonaws.com/" + randomId,
					})
				}
			/>
		);
	}
}
