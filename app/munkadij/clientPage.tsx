"use client";
import { toast } from "sonner";
import { hufFormatter } from "../[id]/_clientPage";
import BaseComponentV2 from "../_components/BaseComponentV2";
import CustomDialog from "../_components/CustomDialog";
import { Munkadíj, MunkadíjValueType } from "./page";
import { useMemo, useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { SelectContent, SelectGroup, SelectItem, Select, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Settings, useSettings, useUserWithRole } from "@/lib/utils";
import React from "react";

export default function ClientPage({ munkadijak }: { munkadijak: Munkadíj[] }) {
	const [openDialog, setOpenDialog] = useState(false);
	const user = useUserWithRole();
	const nullSelected: Munkadíj = {
		type: "",
		value: 0,
		description: "",
		id: 0,
		value_type: "hour",
		num_people: 1,
	};
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
			toast("Sikeres törlés");
			setStateMunkadíjak((prev) => prev.filter((oldMunkadijak) => oldMunkadijak.id !== selected?.id));
			await revalidateCache();
		}
	};
	const updateMunkadíj = async () => {
		const response = await fetch(`https://pen.dataupload.xyz/munkadij/${selected?.id}/`, {
			method: "PUT",
			body: JSON.stringify({ ...selected, value: parseFloat(selected.value.toString()) } as Munkadíj),
			headers: {
				"Content-Type": "application/json",
			},
		});
		if (response.ok) {
			toast("Sikeres frissítés");
			setStateMunkadíjak((prev) =>
				prev.map((oldMunkadijak) => (oldMunkadijak.id === selected?.id ? selected : oldMunkadijak))
			);
			await revalidateCache();
		}
	};
	const createMunkadíj = async () => {
		const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}.dataupload.xyz/munkadij/`, {
			method: "POST",
			body: JSON.stringify({ ...selected, system: user.user?.system }),
			headers: {
				"Content-Type": "application/json",
			},
		});
		if (response.ok) {
			const data: Munkadíj = await response.json();
			toast("Sikeres mentés");
			setStateMunkadíjak((prev) => [...prev, data]);
			await revalidateCache();
		}
	};

	const settings = useSettings() ?? ({ Óradíj: "18000" } as Settings);
	const formattedMunkadíjak = stateMunkadíjak.map((munkadíj) => ({
		...munkadíj,
		formattedValue: hufFormatter.format(
			munkadíj.value_type === "fix" ? munkadíj.value : munkadíj.value * parseInt(settings["Óradíj"] ?? 0)
		),
		idStr: munkadíj.id.toString(),
		numPeople: munkadíj.value_type === "hour" ? `${munkadíj.value} óra` : "",
	}));
	return (
		<>
			<BaseComponentV2
				columns={[
					{ field: "id", headerName: "Azonosító", width: 130, flex: 0 },
					{ field: "type", headerName: "Típus" },
					{ field: "formattedValue", headerName: "Összeg" },
					{ field: "description", headerName: "Leírás", width: 500, flex: 0 },
				]}
				variant='grid'
				data={formattedMunkadíjak}
				editType='dialog'
				itemContent={{
					id: "id",
					subtitle3: "numPeople",
					title: "type",
					subtitle2: "formattedValue",
					subtitle: "description",
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
				filters={[
					{
						field: "idStr",
						label: "Munkadíj",
						type: "select",
						options: formattedMunkadíjak.map((munkadíj) => ({
							label: munkadíj.type,
							value: munkadíj.id.toString(),
						})),
					},
				]}
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
								toast.error("Biztos törölni akarod a sablont?", {
									action: { label: "Igen", onClick: deleteMunkadij },
								});
						  }
						: undefined
				}
				disabledSubmit={!selected?.type || !selected.value}
				onSave={selected?.id ? updateMunkadíj : createMunkadíj}
				onCancel={resetSelected}>
				<MunkadíjForm munkadíj={selected} setMunkadíj={setSelected} />
			</CustomDialog>
		</>
	);
}

export function MunkadíjForm({
	munkadíj,
	setMunkadíj,
}: {
	munkadíj: Munkadíj;
	setMunkadíj: React.Dispatch<React.SetStateAction<Munkadíj>>;
}) {
	const settings = useSettings() ?? ({ Óradíj: "18000" } as Settings);
	return (
		<div className='grid gap-4 py-4'>
			<div className='grid grid-cols-4 items-center gap-4'>
				<Label htmlFor='type' className='text-right'>
					Típus
				</Label>
				<Input
					id='type'
					value={munkadíj?.type}
					onChange={(e) => setMunkadíj((prev) => ({ ...prev, type: e.target.value }))}
					className='col-span-3'
				/>
			</div>
			<div className='grid grid-cols-4 items-center gap-4'>
				<Label htmlFor='value_type' className='text-right'>
					Ősszeg típus
				</Label>
				<Select
					onValueChange={(value) =>
						setMunkadíj((prev) => ({ ...prev, value_type: value as MunkadíjValueType }))
					}
					value={munkadíj.value_type}>
					<SelectTrigger className='w-full'>
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						<SelectGroup>
							<SelectItem value='hour'>Óradíj</SelectItem>
							<SelectItem value='fix'>Fix összeg</SelectItem>
						</SelectGroup>
					</SelectContent>
				</Select>
			</div>
			<div className='grid grid-cols-4 items-center gap-4'>
				<Label htmlFor='value' className='text-right'>
					{munkadíj.value_type === "fix" ? "Összeg" : "Óra"}
				</Label>
				<Input
					id='value'
					type='text'
					value={munkadíj?.value}
					onChange={(e) =>
						setMunkadíj((prev) => ({
							...prev,
							value: e.target.value as unknown as number,
						}))
					}
					className='col-span-3'
				/>
			</div>
			{munkadíj.value_type === "hour" ? (
				<div className='grid grid-cols-4 items-center gap-4'>
					<Label htmlFor='num_people' className='text-right'>
						Ember
					</Label>
					<Input
						id='num_people'
						type='number'
						value={munkadíj?.num_people}
						onChange={(e) =>
							setMunkadíj((prev) => ({
								...prev,
								num_people: e.target.value as unknown as number,
							}))
						}
						className='col-span-3'
					/>
				</div>
			) : null}
			{munkadíj.value_type === "hour" ? (
				<div className='grid grid-cols-4 items-center gap-4'>
					<Label htmlFor='total' className='text-right'>
						Összeg
					</Label>
					<p id='total' className='prose prose-sm col-span-1 text-left'>
						{hufFormatter.format(
							munkadíj.value * (munkadíj.num_people ?? 0) * parseInt(settings["Óradíj"] ?? 0)
						)}
					</p>
				</div>
			) : null}

			<div className='grid grid-cols-4 items-center gap-4'>
				<Label htmlFor='description' className='text-right'>
					Leírás
				</Label>
				<Textarea
					value={munkadíj?.description}
					onChange={(e) => setMunkadíj((prev) => ({ ...prev, description: e.target.value }))}
					className='col-span-3'
				/>
			</div>
		</div>
	);
}
