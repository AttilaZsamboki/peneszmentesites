"use client";
import { FelmeresNotes } from "./page";
import { Felmeres } from "../page";

import Heading from "../_components/Heading";
import TextEditor from "../_components/Texteditor";
import FormData from "../_components/FormData";
import Gallery from "../_components/Gallery";
const Sections = React.lazy(() => import("../_components/Sections"));

import { useGlobalState } from "../_clientLayout";

import React from "react";

import { Typography, Spinner, Switch, CardBody, Card, CardHeader } from "@material-tailwind/react";
import { XMarkIcon, CheckIcon } from "@heroicons/react/20/solid";
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
	const { setAlert, setConfirm } = useGlobalState();

	const sections = Array.from(
		new Set(formattedFelmeres.filter((field) => field.value !== "").map((field) => field.section))
	);
	sections.push("Jegyzetek");

	const [originalData, setOriginalData] = React.useState(formattedFelmeres);
	const [filteredData, setFilteredData] = React.useState(
		formattedFelmeres.filter((field) => field.section === sections[0])
	);
	const [filter, setFilter] = React.useState("");
	const [selectedSection, setSelectedSection] = React.useState("");
	const [isLoading, setIsLoading] = React.useState(true);
	const [isEditing, setIsEditing] = React.useState(false);
	const [notes, setNotes] = React.useState<FelmeresNotes[]>(felmeresNotes);
	const [modifiedData, setModifiedData] = React.useState<Felmeres[]>([]);

	const notesParent = React.useRef(null);

	React.useEffect(() => {
		setNotes(felmeresNotes);
	}, [felmeresNotes]);
	React.useEffect(() => {
		setSelectedSection(sections[0]);
	}, []);
	React.useEffect(() => {
		setFilteredData(
			originalData.filter((field) =>
				filter
					? field.field.toLowerCase().includes(filter.toLowerCase()) ||
					  JSON.stringify(field.value).toLowerCase().includes(filter.toLowerCase())
					: field.section === selectedSection
			)
		);
	}, [filter, selectedSection]);
	React.useEffect(() => {
		setIsLoading(false);
	}, []);
	React.useEffect(() => {
		if (notesParent) {
			notesParent.current && autoAnimate(notesParent.current);
		}
	}, [notesParent.current]);

	return (
		<div className='flex flex-row w-ful flex-wrap lg:flex-nowrap justify-center mt-2'>
			<div className='w-full lg:w-1/6 lg:ml-10 flex justify-center lg:justify-normal lg:items-start items-center mt-6'>
				<div className='w-full'>
					<Typography
						variant='h4'
						className='relative bg-clip-border mx-4 rounded-xl overflow-hidden bg-gradient-to-tr from-gray-900 to-gray-800 text-white shadow-gray-900/20 shadow-lg mb-8 py-2 text-center'
						color='gray'>
						{formattedFelmeres.filter((field) => field.field === "Adatlap").map((field) => field.value)}
					</Typography>
					<React.Suspense
						fallback={
							<Sections
								sectionNames={sections}
								selected={selectedSection}
								setSelected={setSelectedSection}
								filter={filter}
								setFilter={setFilter}
								disabled={true}
							/>
						}>
						<div className='relative'>
							<Sections
								sectionNames={sections}
								selected={selectedSection}
								setSelected={setSelectedSection}
								filter={filter}
								setFilter={setFilter}
								disabled={isLoading}
							/>
							{isLoading ? (
								<div className='absolute top-1/3 left-1/2 h-10 w-10'>
									<Spinner color='blue-gray' className='w-10 h-10 relative right-4' />
								</div>
							) : (
								<div></div>
							)}
						</div>
					</React.Suspense>
					<div className='flex flex-row w-full justify-between my-5 p-2 px-4 border rounded-md'>
						<Typography className={`${isLoading ? "text-gray-600" : ""}`} variant='h6'>
							Módosítás
						</Typography>
						{modifiedData.length === 0 ? (
							<Switch
								crossOrigin=''
								disabled={isLoading}
								color='gray'
								onChange={() => setIsEditing(!isEditing)}
							/>
						) : (
							<div className='flex flex-row gap-2'>
								<XMarkIcon
									onClick={() => {
										setConfirm({
											message: "Biztosan elveted a módosításokat?",
											onConfirm: () => {
												setModifiedData([]);
												setIsEditing(false);
											},
										});
									}}
									className='w-6 h-6 cursor-pointer rounded-md bg-red-500 text-white p-1'
								/>
								<CheckIcon
									onClick={() => {
										setConfirm({
											message: modifiedData.filter((field) => !field.value.length).length
												? "Biztosan elmented a módosításokat? (az üresen hagyott mezők törlésre kerülnek)"
												: "Biztosan elmented a módosításokat?",
											onConfirm: () => {
												setIsEditing(false);
												modifiedData.map(async (field) => {
													const resp = await fetch(
														"https://pen.dataupload.xyz/felmeresek/" + field.id + "/",
														{
															method: "PATCH",
															headers: {
																"Content-Type": "application/json",
															},
															body: JSON.stringify({
																value: Array.isArray(field.value)
																	? JSON.stringify(field.value)
																	: field.value,
															}),
														}
													);
													if (resp.ok) {
														setFilteredData((prev) =>
															prev.map((f) => (f.id === field.id ? field : f))
														);
														await fetch(
															"/api/revalidate?tag=" + encodeURIComponent(felmeresId)
														);
														setModifiedData([]);
													} else {
														setAlert({
															message: "Hiba történt a mentés során!",
															level: "error",
														});
													}
												});
											},
										});
									}}
									className='w-6 h-6 rounded-md cursor-pointer bg-green-500 text-white p-1'
								/>
							</div>
						)}
					</div>
				</div>
			</div>
			<div className='lg:mt-6 lg:px-10 w-full'>
				<Card className='shadow-none'>
					<CardBody className='bg-white p-8 lg:rounded-lg bg-transparent bg-opacity-20 lg:border transform'>
						<Heading title={selectedSection ? selectedSection : sections[0]} variant='h3' />
						<FormData
							modifiedData={modifiedData}
							setModifiedData={setModifiedData}
							data={filteredData}
							isEditing={isEditing}
						/>
						{selectedSection === "Jegyzetek" && filter === "" ? (
							<div className='px-4 py-6 sm:px-0 relative w-full pt-10'>
								<div className='flex-col items-center justify-items w-full' ref={notesParent}>
									{notes
										.sort(
											(a, b) =>
												new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
										)
										.map((note) => (
											<div
												className='flex flex-col mb-5 items-center justify-center'
												key={note.id}>
												<Note note={note} setNotes={setNotes} />
											</div>
										))}
									<div className='flex flex-col items-center justify-center w-full mt-16 lg:mt-32'>
										<TextEditor adatlapId={felmeresId} setNotes={setNotes} />
									</div>
								</div>
							</div>
						) : (
							<div></div>
						)}
					</CardBody>
				</Card>
			</div>
		</div>
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
		const resp = await fetch("https://pen.dataupload.xyz/felmeresek_notes/" + note.id + "/", {
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
		<Card className='lg:w-4/6 w-full mt-10'>
			<CardHeader
				variant='gradient'
				color='gray'
				className='flex flex-row justify-between items-center font-semibold p-2'>
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
				<XMarkIcon className='w-6 h-6 mr-2 cursor-pointer' onClick={deleteNote} />
			</CardHeader>
			<CardBody>
				{note.type === "text" ? (
					<div className='text-sm mb-4 leading-6 text-gray-700 break-words' key={note.id}>
						{note.value}
					</div>
				) : note.type === "image" ? (
					<Gallery
						images={[`https://felmeres-note-images.s3.eu-central-1.amazonaws.com/${note.value}`]}
						isVideo={false}
						single={true}
					/>
				) : (
					<div></div>
				)}
			</CardBody>
		</Card>
	);
}
