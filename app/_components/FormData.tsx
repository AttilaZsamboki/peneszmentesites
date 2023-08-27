import { GridOptions, ScaleOption } from "../felmeresek/page";
import { FelmeresQuestions } from "../felmeresek/page";

import { Grid } from "./Grid";
import Gallery from "./Gallery";
import Input from "./Input";

import React from "react";
import { Slider } from "@material-tailwind/react";
import AutoComplete from "./AutoComplete";
import MultipleChoice from "./MultipleChoice";
import FileUpload from "./FileUpload";

export default function FormData({
	data,
	isEditing,
	modifiedData,
	setModifiedData,
}: {
	data: FelmeresQuestions[];
	isEditing: boolean;
	modifiedData: FelmeresQuestions[];
	setModifiedData: React.Dispatch<React.SetStateAction<FelmeresQuestions[]>>;
}) {
	return (
		<div className='divide-y divide-gray-100 pt-10'>
			{data
				.filter((field) => field.value !== "")
				.sort((a, b) => a.id - b.id)
				.map((field) => (
					<div className='px-4 py-6 flex flex-row sm:gap-4 sm:px-0' key={field.id}>
						<div className='text-base font-medium leading-6 text-gray-900 w-1/3'>{field.field}</div>
						<div className='flex justify-end w-full items-center'>
							<div
								className={`${
									["GRID", "CHECKBOX_GRID", "FILE_UPLOAD"].includes(field.type) ? "w-full" : "w-1/3"
								}`}>
								{isEditing ? (
									<FieldEditing
										modifiedData={modifiedData}
										setModifiedData={setModifiedData}
										data={field}
									/>
								) : (
									<FieldViewing data={field} />
								)}
							</div>
						</div>
					</div>
				))}
		</div>
	);
}

function FieldViewing({ data }: { data: FelmeresQuestions }) {
	if (["TEXT", "LIST", "MULTIPLE_CHOICE"].includes(data.type)) {
		return (
			<dd className='mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0 lg:text-right'>{data.value}</dd>
		);
	} else if (data.type === "CHECKBOX") {
		return (
			<MultipleChoice
				options={(data.options as string[]).map((option) => option)}
				value={data.value}
				onChange={() => {}}
				radio={false}
				disabled
			/>
		);
	} else if (data.type === "GRID" || data.type === "CHECKBOX_GRID") {
		return (
			<Grid
				columns={(data.options as GridOptions).columns}
				rows={(data.options as GridOptions).rows}
				value={data.value as unknown as string[]}
				radio={data.type === "CHECKBOX_GRID" ? false : true}
				disabled
			/>
		);
	} else if (data.type === "SCALE") {
		return (
			<div className='flex flex-col justify-center space-y-2 lg:w-full lg:col-span-2 cursor-default'>
				<div className='mt-1 text-md leading-6 text-gray-700 sm:col-span-2 sm:mt-0 lg:text-right'>
					{data.value}
				</div>
				<Slider
					value={(parseInt(data.value) / (data.options as ScaleOption).max) * 100}
					style={{ color: "#ADBCC3" }}
				/>
			</div>
		);
	} else if (data.type === "FILE_UPLOAD") {
		return (
			<div className='lg:col-span-2'>
				<Gallery
					images={(data.value as unknown as string[]).map((media) => {
						if (media.substring(0, 4) !== "KÉZI") {
							return `https://drive.google.com/uc?export=view&id=${media}`;
						} else {
							return `https://felmeres-note-images.s3.eu-central-1.amazonaws.com/${media.substring(4)}`;
						}
					})}
					isVideo={data.field === "Készíts videót és töltsd fel!"}
				/>
			</div>
		);
	}
}

function FieldEditing({
	data,
	modifiedData,
	setModifiedData,
}: {
	data: FelmeresQuestions;
	modifiedData: FelmeresQuestions[];
	setModifiedData: React.Dispatch<React.SetStateAction<FelmeresQuestions[]>>;
}) {
	const field = modifiedData.find((field) => field.id === data.id)
		? modifiedData.find((field) => field.id === data.id)!
		: data;
	const setterSingle = (value: string) => {
		setModifiedData((prev) => [...prev.filter((field) => field.id !== data.id), { ...data, value: value }]);
	};
	const setterMultipleUnordered = (value: string) => {
		let values = [""];
		if (field.value.includes(value) && values.length) {
			values = (field.value as unknown as string[]).filter((v) => v !== value);
		} else {
			values = [...(field.value as unknown as string[]), value];
		}
		setModifiedData((prev) => [
			...prev.filter((field) => field.id !== data.id),
			{
				...data,
				value: values,
			} as unknown as FelmeresQuestions,
		]);
	};
	const setterSingleOrdered = (value: { column: string; row: number }) => {
		setModifiedData((prev) => [
			...prev.filter((field) => field.id !== data.id),
			{
				...data,
				value: (field.value as unknown as string[]).map((v, i) => {
					if (i === value.row) {
						if (v === value.column) {
							return null;
						}
						return value.column;
					} else {
						return v;
					}
				}),
			} as unknown as FelmeresQuestions,
		]);
	};
	const setterMultipleOrdered = (value: { column: string; row: number }) => {
		setModifiedData((prev) => [
			...prev.filter((field) => field.id !== data.id),
			{
				...data,
				value: (field.value as unknown as string[]).map((v, i) => {
					if (i === value.row) {
						if (v ? v.includes(value.column) : false) {
							return (v as unknown as string[]).filter((c) => c !== value.column);
						}
						return [...((v as unknown as string[]) || [""]), value.column];
					} else {
						return v;
					}
				}),
			} as unknown as FelmeresQuestions,
		]);
	};
	if (data.type === "TEXT") {
		return <Input onChange={(e) => setterSingle(e.target.value)} value={field.value} variant='simple' />;
	} else if (data.type === "LIST") {
		return (
			<AutoComplete
				options={(data.options as string[]).map((option) => ({ label: option, value: option }))}
				onChange={setterSingle}
				value={field.value}
			/>
		);
	} else if (["MULTIPLE_CHOICE", "CHECKBOX"].includes(data.type)) {
		return (
			<MultipleChoice
				options={(data.options as string[]).map((option) => option)}
				value={field.value}
				onChange={data.type === "CHECKBOX" ? setterMultipleUnordered : setterSingle}
				radio={data.type === "MULTIPLE_CHOICE"}
			/>
		);
	} else if (data.type === "GRID" || data.type === "CHECKBOX_GRID") {
		return (
			<Grid
				columns={(data.options as GridOptions).columns}
				rows={(data.options as GridOptions).rows}
				value={field.value as unknown as string[]}
				onChange={(value) => {
					if (data.type === "CHECKBOX_GRID") {
						setterMultipleOrdered(value);
					} else {
						setterSingleOrdered(value);
					}
				}}
				radio={data.type === "CHECKBOX_GRID" ? false : true}
				disabled={false}
			/>
		);
	} else if (data.type === "SCALE") {
		return (
			<MultipleChoice
				options={Array.from({ length: (data.options as ScaleOption).max }, (_, i) => (i + 1).toString())}
				value={field.value}
				onChange={setterSingle}
				radio={true}
			/>
		);
	} else if (data.type === "FILE_UPLOAD") {
		return <FileUpload route={`/api/update-images?id=${encodeURIComponent(data.id)}`} />;
	}
}
