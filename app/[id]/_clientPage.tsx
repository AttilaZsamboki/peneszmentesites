"use client";
import { Felmeres, ListOption, GridOptions, ScaleOption } from "../page";
import { Grid } from "../_components/Grid";
import { Checkbox, Slider, Card, CardBody, CardHeader } from "@material-tailwind/react";
import Gallery from "../_components/Gallery";
import React from "react";
import TextEditor from "../_components/Texteditor";
import { FelmeresNotes } from "./page";
import { XMarkIcon } from "@heroicons/react/20/solid";
import autoAnimate from "@formkit/auto-animate";

export default function ClientPage({
	formattedFelmeres,
	felmeresNotes,
	felmeresId,
}: {
	formattedFelmeres: Felmeres[];
	felmeresNotes: FelmeresNotes[];
	felmeresId: string;
}) {
	const [notes, setNotes] = React.useState<FelmeresNotes[]>(felmeresNotes);
	const notesParent = React.useRef(null);
	React.useEffect(() => {
		setNotes(felmeresNotes);
	}, [felmeresNotes]);
	React.useEffect(() => {
		if (notesParent) {
			notesParent.current && autoAnimate(notesParent.current);
		}
	}, []);
	return (
		<dl className='divide-y divide-gray-100'>
			{formattedFelmeres
				.filter((field) => field.value !== "")
				.map((field) => {
					if (["TEXT", "LIST", "MULTIPLE_CHOICE"].includes(field.type)) {
						return (
							<div className='px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0' key={field.id}>
								<dt className='text-base font-medium leading-6 text-gray-900'>{field.field}</dt>
								<dd className='mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0'>
									{field.value}
								</dd>
							</div>
						);
					} else if (field.type === "CHECKBOX") {
						return (
							<div className='px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0' key={field.id}>
								<div className='text-base font-medium leading-6 text-gray-900'>{field.field}</div>
								<div className='mt-4 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0'>
									<div className='grid grid-cols-2 gap-4'>
										{(field.options as ListOption[]).map((option) => (
											<Checkbox
												key={option.label}
												label={option.label}
												checked={field.value.includes(option.value)}
												color='blue-gray'
												crossOrigin='anonymous'
											/>
										))}
									</div>
								</div>
							</div>
						);
					} else if (field.type === "GRID" || field.type === "CHECKBOX_GRID") {
						return (
							<div className='px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0' key={field.id}>
								<div className='text-base mb-4 font-medium leading-6 text-gray-900'>{field.field}</div>
								<Grid
									columns={(field.options as GridOptions).columns}
									rows={(field.options as GridOptions).rows}
									value={field.value as unknown as string[]}
									radio={field.type === "CHECKBOX_GRID" ? false : true}
								/>
							</div>
						);
					} else if (field.type === "SCALE") {
						const percent = `${
							((parseInt(field.value) - (field.options as ScaleOption).min) /
								(field.options as ScaleOption).max) *
							100
						}%`;
						return (
							<div className='px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0' key={field.id}>
								<div className='text-base mb-4 font-medium leading-6 text-gray-900'>{field.field}</div>
								<div className='flex flex-row justify-between'>
									<div>{(field.options as ScaleOption).min}</div>
									<div>{(field.options as ScaleOption).max}</div>
									<div className={`absolute ml-4`} style={{ left: percent }}>
										{field.value}
									</div>
								</div>
								<Slider
									min={(field.options as ScaleOption).min}
									max={(field.options as ScaleOption).max}
									value={field.value}
									color='blue-gray'
								/>
							</div>
						);
					} else if (field.type === "FILE_UPLOAD") {
						return (
							<div className='px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0' key={field.id}>
								<div className='text-base mb-4 font-medium leading-6 text-gray-900'>{field.field}</div>
								<Gallery
									images={(field.value as unknown as string[]).map(
										(media) => `https://drive.google.com/uc?export=view&id=${media}`
									)}
									isVideo={field.field === "Készíts videót és töltsd fel!"}
								/>
							</div>
						);
					}
				})}
			<div className='px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0 relative' ref={notesParent}>
				<div className='text-lg mb-6 font-bold leading-6 text-gray-900 text-center'>Jegyzetek</div>
				{notes
					.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
					.map((note) => (
						<div className='flex flex-col mb-5 items-center justify-center' key={note.id}>
							<Note note={note} setNotes={setNotes} />
						</div>
					))}
				<TextEditor adatlapId={felmeresId} setNotes={setNotes} />
			</div>
		</dl>
	);
}

function Note({
	note,
	setNotes,
}: {
	note: FelmeresNotes;
	setNotes: React.Dispatch<React.SetStateAction<FelmeresNotes[]>>;
}) {
	const deleteNote = async () => {
		const resp = await fetch("http://pen.dataupload.xyz/felmeresek_notes/" + note.id + "/", {
			method: "DELETE",
			headers: {
				"Content-Type": "application/json",
			},
		});
		if (resp.ok) {
			setNotes((prev) => prev.filter((n) => n.id !== note.id));
		}
	};
	return (
		<Card className='w-full mt-10'>
			<CardHeader color='blue-gray' className='flex flex-row justify-between items-center font-semibold p-2'>
				<div className='text-sm ml-2'>
					{new Date(note.created_at).toLocaleString("hu-HU", {
						year: "numeric",
						month: "short",
						day: "numeric",
						hour: "numeric",
						minute: "numeric",
						hour12: false,
					})}
				</div>
				<XMarkIcon className='w-6 h-6 mr-2' onClick={deleteNote} />
			</CardHeader>
			<CardBody>
				{note.type === "text" ? (
					<div className='text-sm mb-4 leading-6 text-gray-700' key={note.id}>
						{note.value}
					</div>
				) : note.type === "image" ? (
					<img className='mb-4' src={`/images/${note.value}`} alt='note' key={note.id} />
				) : note.type === "images" ? (
					<Gallery
						images={JSON.parse(note.value).map((image: string) => `/images/${image}`)}
						isVideo={false}
					/>
				) : (
					<div></div>
				)}
			</CardBody>
		</Card>
	);
}
