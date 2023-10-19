"use client";
import React from "react";
import { FelmeresQuestion, ScaleOption } from "../app/page";
import AutoComplete from "@/app/_components/AutoComplete";
import { Question } from "@/app/questions/page";
import MultipleChoice from "@/app/_components/MultipleChoice";
import { GridOptions } from "../app/page";
import { Grid } from "@/app/_components/Grid";
import FileUpload from "@/app/_components/FileUpload";
import Textarea from "../app/_components/Textarea";
import Gallery from "../app/_components/Gallery";
import { Separator } from "@/components/ui/separator";
import { QuestionTemplate } from "../app/new/_clientPage";

export function QuestionPage({
	questions,
	setData,
	adatlap_id,
	product,
	globalData,
}: {
	product: number | null;
	questions: Question[];
	setData: React.Dispatch<React.SetStateAction<FelmeresQuestion[]>>;
	adatlap_id: number;
	globalData: FelmeresQuestion[];
}) {
	return (
		<div className='flex flex-col gap-10'>
			{questions.map((question, index) => (
				<>
					<QuestionTemplate
						key={question.id}
						title={question.question}
						description={question.description}
						mandatory={question.mandatory}>
						<FieldCreate
							globalData={globalData}
							product={product}
							adatlap_id={adatlap_id}
							question={question}
							setGlobalData={setData}
						/>
					</QuestionTemplate>
					{index === questions.length - 1 ? null : <Separator />}
				</>
			))}
		</div>
	);
}
function FieldCreate({
	question,
	setGlobalData,
	globalData,
	adatlap_id,
	product,
}: {
	question: Question;
	setGlobalData: React.Dispatch<React.SetStateAction<FelmeresQuestion[]>>;
	globalData: FelmeresQuestion[];
	adatlap_id: number;
	product?: number | null;
}) {
	React.useEffect(() => {
		if (!globalData.find((felmeres) => isTrue(felmeres))) {
			setGlobalData((prev) => [
				...prev.filter((felmeres) => !isTrue(felmeres)),
				{
					adatlap_id: adatlap_id,
					id: 0,
					value: "",
					question: question.id,
					product: question.connection === "Fix" ? null : product || 0,
				},
			]);
		}
	}, [product, question.id]);

	const isTrue = (felmeres: FelmeresQuestion) => {
		return (
			felmeres.question === question.id &&
			(question.connection === "Fix" ? true : felmeres.product === product && product !== 0)
		);
	};

	const setterSingle = (value: string) => {
		setGlobalData((prev) => prev.map((felmeres) => (isTrue(felmeres) ? { ...felmeres, value: value } : felmeres)));
	};

	const felmeres = globalData.find((felmeres) => isTrue(felmeres));

	const setterMultipleUnordered = (value: string) => {
		setGlobalData((prev) =>
			prev.map((felmeres) =>
				isTrue(felmeres)
					? {
							...felmeres,
							value: felmeres.value.includes(value)
								? ((felmeres.value as unknown as string[]).filter(
										(v) => v !== value
								  ) as unknown as string)
								: ([...(felmeres.value as unknown as string[]), value] as unknown as string),
					  }
					: felmeres
			)
		);
	};

	const setterSingleOrdered = (value: { column: string; row: number }) => {
		setGlobalData((prev) =>
			prev.map((felmeres) => {
				if (isTrue(felmeres)) {
					return {
						...felmeres,
						value: [
							...((felmeres.value as unknown as Array<{
								column: string;
								row: number;
							}>)
								? (
										felmeres.value as unknown as Array<{
											column: string;
											row: number;
										}>
								  ).filter((v) => v.row !== value.row)
								: []),
							value,
						] as unknown as string,
					};
				} else {
					return felmeres;
				}
			})
		);
	};

	const setterMultipleOrdered = (value: { column: string; row: number }) => {
		setGlobalData((prev) =>
			prev.map((felmeres) =>
				isTrue(felmeres)
					? {
							...felmeres,
							value: (felmeres.value
								? !(
										felmeres.value as unknown as Array<{
											column: string;
											row: number;
										}>
								  ).filter((v) => v.column === value.column && v.row === value.row).length
									? [
											...(felmeres.value as unknown as Array<{
												column: string;
												row: number;
											}>),
											value,
									  ]
									: (
											felmeres.value as unknown as Array<{
												column: string;
												row: number;
											}>
									  ).filter((v) => !(v.column === value.column && v.row === value.row))
								: [value]) as unknown as string,
					  }
					: felmeres
			)
		);
	};

	if (question.type === "TEXT") {
		return <Textarea onChange={(e) => setterSingle(e)} value={felmeres?.value as string} />;
	} else if (question.type === "LIST") {
		return (
			<AutoComplete
				options={(question.options as string[]).map((option) => ({
					label: option,
					value: option,
				}))}
				onSelect={setterSingle}
				value={felmeres?.value as string}
			/>
		);
	} else if (["MULTIPLE_CHOICE", "CHECKBOX", "SCALE"].includes(question.type)) {
		return (
			<MultipleChoice
				name={question.id.toString()}
				options={
					question.type === "SCALE"
						? Array.from({ length: (question.options as ScaleOption).max }, (_, i) => (i + 1).toString())
						: (question.options as string[]).map((option) => option)
				}
				value={felmeres?.value.toString() as string}
				onChange={question.type === "CHECKBOX" ? setterMultipleUnordered : setterSingle}
				radio={question.type === "MULTIPLE_CHOICE" || question.type === "SCALE"}
				orientation={question.type === "SCALE" ? "row" : "column"}
			/>
		);
	} else if (question.type === "GRID" || question.type === "CHECKBOX_GRID") {
		return (
			<Grid
				columns={(question.options as GridOptions).columns}
				rows={(question.options as GridOptions).rows}
				value={felmeres?.value as unknown as { column: string; row: number }[]}
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
	} else if (question.type === "FILE_UPLOAD") {
		return (
			<div className='flex flex-col gap-2'>
				{globalData.find((felmeres) => isTrue(felmeres))?.value ? (
					<Gallery
						media={globalData.find((felmeres) => isTrue(felmeres))?.value as unknown as string[]}
						edit={true}
						onDelete={(index) => {
							setGlobalData((prev) =>
								prev.map((felmeres) =>
									isTrue(felmeres)
										? {
												...felmeres,
												value: (felmeres.value as unknown as string[]).filter(
													(_, i) => i !== index
												) as unknown as string,
										  }
										: felmeres
								)
							);
						}}
					/>
				) : null}
				<FileUpload
					onUpload={(file) =>
						setGlobalData((prev) =>
							prev.map((felmeres) =>
								isTrue(felmeres)
									? {
											...felmeres,
											adatlap_id: adatlap_id,
											question: question.id,
											product: felmeres.product,
											value: [
												...(felmeres.value as unknown as string[]),
												"https://felmeres-note-images.s3.eu-central-1.amazonaws.com/" +
													file.filename,
											] as unknown as string,
									  }
									: felmeres
							)
						)
					}
				/>
			</div>
		);
	}
}
