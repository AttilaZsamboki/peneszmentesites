"use client";
import { hufFormatter } from "../felmeresek/[id]/_clientPage";
import BaseComponentV2 from "../_components/BaseComponentV2";
import { Button, Checkbox } from "@material-tailwind/react";
import React from "react";
import { Product } from "./page";
import CustomDialog from "../_components/CustomDialog";
import AutoComplete from "../_components/AutoComplete";
import { XMarkIcon } from "@heroicons/react/24/outline";
import Heading from "../_components/Heading";

export interface ProductAttributes {
	id?: number;
	product_id?: number;
	place: boolean;
	place_options: string[];
	product?: number;
}

export default function ClientPage({ data }: { data: { count: number; results: Product[] } }) {
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
				title='Termékek'
				onEditItem={(item) => {
					setOpen(true);
					setProductData(item);
					setAttributeData((prev) => ({ ...prev }));
				}}
				pagination={{
					numPages: Math.ceil(data.count / 10),
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
				<UpdateForm attributeData={attributeData} setAttributeData={setAttributeData} />
			</CustomDialog>
		</>
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
					<div className='-mt-10'>
						<Heading title='Opciók' variant='h4' />
					</div>
					<div className='relative bottom-10'>
						<AutoComplete
							onChange={(value) =>
								setAttributeData((prev) => ({
									...prev,
									place_options: [...prev.place_options, value],
								}))
							}
							create={true}
							options={[]}
						/>
					</div>
					<div className='flex flex-col gap-5'>
						{attributeData.place_options.map((option, index) => (
							<div
								key={index}
								className='flex flex-row w-full items-center justify-between border-b pb-2'>
								<div>{option}</div>
								<Button
									size='sm'
									color='red'
									onClick={() =>
										setAttributeData((prev) => ({
											...prev,
											place_options: prev.place_options.filter((o) => o !== option),
										}))
									}>
									<XMarkIcon className='w-5 h-5 text-white' />
								</Button>
							</div>
						))}
					</div>
				</div>
			) : (
				<div></div>
			)}
		</div>
	);
}
