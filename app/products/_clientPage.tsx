"use client";
import BaseComponent from "../_components/BaseComponent";
import MultipleChoiceCombobox from "../_components/MultipleChoiceList";
import { ProductAttributes } from "./[id]/page";
import { Checkbox, Typography, select } from "@material-tailwind/react";
import React from "react";

export default function ClientPage({ data, title, columnDefs }: { data: any[]; title: string; columnDefs: any[] }) {
	const [selectedRow, setSelectedRow] = React.useState<any>(null);
	const [attributeData, setAttributeData] = React.useState<ProductAttributes>({
		id: 0,
		place_options: [],
		product_id: 0,
		place: false,
	});

	React.useEffect(() => {
		if (selectedRow) {
			const fetchAttributes = async () => {
				const resp = await fetch(`https://pen.dataupload.xyz/product_attributes/${selectedRow[0].id}`);
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
							product_id: 0,
							place: false,
						});
					}
				}
			};
			fetchAttributes();
		}
	}, [selectedRow]);

	const submitChanges = async () => {
		const payload = JSON.stringify({
			...attributeData,
			place_options: JSON.stringify(attributeData.place_options).replace("[", "{").replace("]", "}"),
			product: selectedRow[0].id,
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
		await fetch("/api/revalidate?tag=product-attributes");
	};
	return (
		<div className='w-full flex flex-col justify-center items-center'>
			<BaseComponent
				data={data}
				title={title}
				columnDefs={columnDefs}
				selectedRow={selectedRow}
				filterType='product'
				updateForm={<UpdateForm attributeData={attributeData} setAttributeData={setAttributeData} />}
				onUpdate={submitChanges}
				setSelectedRow={setSelectedRow}
			/>
		</div>
	);
}

function UpdateForm({
	attributeData,
	setAttributeData,
}: {
	attributeData: ProductAttributes;
	setAttributeData: React.Dispatch<React.SetStateAction<ProductAttributes>>;
}) {
	return (
		<div className='-ml-2.5 flex flex-col'>
			<Checkbox
				label='Hely'
				checked={attributeData ? attributeData.place : false}
				onChange={() =>
					setAttributeData((prev) => ({
						...prev,
						place: !prev.place,
					}))
				}
				crossOrigin=''
			/>
			{attributeData.place ? (
				<div className='border-t pt-2 mt-1'>
					<Typography className='mb-1'>Hely opciók</Typography>
					<MultipleChoiceCombobox
						onChange={(value) =>
							setAttributeData((prev) => ({
								...prev,
								place_options: value,
							}))
						}
						options={attributeData.place_options.map((option) => ({
							value: option,
							label: option,
						}))}
					/>
				</div>
			) : (
				<div></div>
			)}
		</div>
	);
}
