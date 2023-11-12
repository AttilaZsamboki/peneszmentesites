"use client";
import { toast } from "@/components/ui/use-toast";
import { hufFormatter } from "../[id]/_clientPage";
import BaseComponentV2 from "../_components/BaseComponentV2";
import CustomDialog from "../_components/CustomDialog";
import { Product } from "../products/page";
import { Munkadíj } from "./page";
import { useState } from "react";
import { ToastAction } from "@radix-ui/react-toast";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function ClientPage({ munkadijak, products }: { munkadijak: Munkadíj[]; products: Product[] }) {
	const [openDialog, setOpenDialog] = useState(false);
	const nullSelected = { type: "", value: 0, product: 0, description: "", id: 0 };
	const [selected, setSelected] = useState<Munkadíj>(nullSelected);
	const [stateMunkadíjak, setStateMunkadíjak] = useState<Munkadíj[]>(munkadijak);

	const resetSelected = () => {
		setSelected(nullSelected);
	};
	const revalidateCache = async () => {
		await fetch("/api/revalidate?tag=munkadijak");
	};
	const deleteMunkadij = async () => {
		const response = await fetch(`https://pen.dataupload.xyz/munkadij/${selected?.id}/`, {
			method: "DELETE",
		});
		if (response.ok) {
			toast({
				title: "Sikeres törlés",
			});
			setStateMunkadíjak((prev) => prev.filter((oldMunkadijak) => oldMunkadijak.id !== selected?.id));
			await revalidateCache();
		}
	};
	const updateMunkadíj = async () => {
		const response = await fetch(`https://pen.dataupload.xyz/munkadij/${selected?.id}/`, {
			method: "PUT",
			body: JSON.stringify(selected),
			headers: {
				"Content-Type": "application/json",
			},
		});
		if (response.ok) {
			toast({
				title: "Sikeres frissítés",
			});
			setStateMunkadíjak((prev) =>
				prev.map((oldMunkadijak) => (oldMunkadijak.id === selected?.id ? selected : oldMunkadijak))
			);
			await revalidateCache();
		}
	};
	const createMunkadíj = async () => {
		const response = await fetch("https://pen.dataupload.xyz/munkadij/", {
			method: "POST",
			body: JSON.stringify(selected),
			headers: {
				"Content-Type": "application/json",
			},
		});
		if (response.ok) {
			const data: Munkadíj = await response.json();
			toast({
				title: "Sikeres mentés",
			});
			setStateMunkadíjak((prev) => [...prev, data]);
			await revalidateCache();
		}
	};

	const formattedMunkadíjak = stateMunkadíjak.map((munkadíj) => ({
		...munkadíj,
		formattedValue: hufFormatter.format(munkadíj.value),
	}));
	return (
		<>
			<BaseComponentV2
				data={formattedMunkadíjak}
				editType='dialog'
				itemContent={{
					id: "id",
					subtitle: "description",
					title: "type",
					subtitle2: "formattedValue",
				}}
				title='Munkadíjak'
				createButtonTitle='Új munkadíj'
				onCreateNew={() => {
					setOpenDialog(true);
				}}
				onEditItem={(item) => {
					setSelected(item);
					setOpenDialog(true);
				}}
			/>
			<CustomDialog
				open={openDialog}
				handler={() => {
					setOpenDialog(!openDialog);
					resetSelected();
				}}
				title={selected?.id ? selected.type : "Új sablon"}
				onDelete={
					selected?.id
						? () => {
								setOpenDialog(false);
								toast({
									title: "Biztos törölni akarod a sablont?",
									variant: "destructive",
									action: (
										<ToastAction onClick={deleteMunkadij} altText='delete'>
											Igen
										</ToastAction>
									),
								});
						  }
						: undefined
				}
				disabledSubmit={!selected?.type || !selected.value}
				onSave={selected?.id ? updateMunkadíj : createMunkadíj}
				onCancel={resetSelected}>
				<div className='grid gap-4 py-4'>
					<div className='grid grid-cols-4 items-center gap-4'>
						<Label htmlFor='type' className='text-right'>
							Típus
						</Label>
						<Input
							id='type'
							value={selected.type}
							onChange={(e) => setSelected((prev) => ({ ...prev, type: e.target.value }))}
							className='col-span-3'
						/>
					</div>
					<div className='grid grid-cols-4 items-center gap-4'>
						<Label htmlFor='value' className='text-right'>
							Összeg
						</Label>
						<Input
							id='value'
							value={selected.value}
							onChange={(e) => setSelected((prev) => ({ ...prev, value: parseInt(e.target.value) }))}
							className='col-span-3'
						/>
					</div>

					<div className='grid grid-cols-4 items-center gap-4'>
						<Label htmlFor='description' className='text-right'>
							Leírás
						</Label>
						<Textarea
							value={selected.description}
							onChange={(e) => setSelected((prev) => ({ ...prev, description: e.target.value }))}
							className='col-span-3'
						/>
					</div>
				</div>
			</CustomDialog>
		</>
	);
}
