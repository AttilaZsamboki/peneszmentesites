"use client";
import { Felmeres, ListOption, GridOptions, ScaleOption } from "../page";
import { Grid } from "../_components/Grid";
import { Checkbox, Slider, Card, CardBody, CardHeader, Typography, Spinner } from "@material-tailwind/react";
import Gallery from "../_components/Gallery";
import React from "react";
import TextEditor from "../_components/Texteditor";
import { FelmeresNotes } from "./page";
import { XMarkIcon } from "@heroicons/react/20/solid";
import autoAnimate from "@formkit/auto-animate";
import Heading from "../_components/Heading";
const Sections = React.lazy(() => import("../_components/Sections"));

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
	const tabsParent = React.useRef(null);
	React.useEffect(() => {
		setNotes(felmeresNotes);
	}, [felmeresNotes]);
	React.useEffect(() => {
		if (notesParent) {
			notesParent.current && autoAnimate(notesParent.current);
		}
		if (tabsParent) {
			setTimeout(() => tabsParent.current && autoAnimate(tabsParent.current), 2000);
		}
	}, []);
	const sections = Array.from(
		new Set(formattedFelmeres.filter((field) => field.value !== "").map((field) => field.section))
	);
	sections.push("Jegyzetek");
	const [selectedSection, setSelectedSection] = React.useState("");
	React.useEffect(() => {
		setSelectedSection(sections[0]);
	}, []);
	const [originalData, setOriginalData] = React.useState(formattedFelmeres);
	const [filteredData, setFilteredData] = React.useState(
		formattedFelmeres.filter((field) => field.section === sections[0])
	);

	const [filter, setFilter] = React.useState("");
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
	const [isLoading, setIsLoading] = React.useState(true);
	React.useEffect(() => {
		setIsLoading(false);
	}, []);

	return (
		<div className='flex flex-row w-ful flex-wrap lg:flex-nowrap justify-center mt-2'>
			<div className='w-full lg:w-1/6 lg:ml-10 flex justify-center lg:justify-normal lg:items-start items-center mt-6'>
				<div className='w-full'>
					<Typography
						variant='h4'
						className='relative bg-clip-border mx-4 rounded-xl overflow-hidden bg-gradient-to-tr from-blue-gray-900 to-blue-gray-800 text-white shadow-gray-900/20 shadow-lg mb-8 py-2 text-center'
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
				</div>
			</div>
			<div className='lg:mt-6 lg:px-10 w-full '>
				<Card className='shadow-none'>
					<CardBody className='bg-white p-8 lg:rounded-lg bg-transparent bg-opacity-20 lg:border transform'>
						<Heading title={selectedSection ? selectedSection : sections[0]} variant='h3' />
						<dl className='divide-y divide-gray-100 pt-10' ref={tabsParent}>
							{filteredData
								.filter((field) => field.value !== "")
								.map((field) => {
									if (["TEXT", "LIST", "MULTIPLE_CHOICE"].includes(field.type)) {
										return (
											<div
												className='px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0'
												key={field.id}>
												<dt className='text-base font-medium leading-6 text-gray-900'>
													{field.field}
												</dt>
												<dd className='mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0 lg:text-right'>
													{field.value}
												</dd>
											</div>
										);
									} else if (field.type === "CHECKBOX") {
										return (
											<div
												className='px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0 lg:grid-cols-2'
												key={field.id}>
												<div className='text-base font-medium leading-6 text-gray-900'>
													{field.field}
												</div>
												<div className='mt-4 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0'>
													{(field.options as ListOption[]).map((option) => (
														<Checkbox
															key={option.label}
															label={option.label}
															checked={field.value.includes(option.value)}
															color='blue-gray'
															crossOrigin='anonymous'
															disabled
														/>
													))}
												</div>
											</div>
										);
									} else if (field.type === "GRID" || field.type === "CHECKBOX_GRID") {
										return (
											<div
												className='px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0 lg:grid-cols-4'
												key={field.id}>
												<div className='text-base mb-4 font-medium leading-6 text-gray-900'>
													{field.field}
												</div>
												<div className='col-span-3'>
													<Grid
														columns={(field.options as GridOptions).columns}
														rows={(field.options as GridOptions).rows}
														value={field.value as unknown as string[]}
														radio={field.type === "CHECKBOX_GRID" ? false : true}
														disabled
													/>
												</div>
											</div>
										);
									} else if (field.type === "SCALE") {
										return (
											<div
												className='px-4 py-6 sm:grid sm:grid-cols-3 lg:grid-cols-2 sm:gap-4 sm:px-0'
												key={field.id}>
												<div className='text-base sm:mb-4 lg:mb-0 font-medium leading-6 text-gray-900'>
													{field.field}
												</div>
												<div className='flex flex-col justify-center space-y-2 lg:w-full lg:col-span-2'>
													<div className='mt-1 text-md leading-6 text-gray-700 sm:col-span-2 sm:mt-0 lg:text-right'>
														{field.value}
													</div>
													<Slider
														value={
															(parseInt(field.value) /
																(field.options as ScaleOption).max) *
															100
														}
														style={{ color: "#ADBCC3" }}
													/>
												</div>
											</div>
										);
									} else if (field.type === "FILE_UPLOAD") {
										return (
											<div
												className='px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0'
												key={field.id}>
												<div className='text-base mb-4 font-medium leading-6 text-gray-900'>
													{field.field}
												</div>
												<div className='lg:col-span-2'>
													<Gallery
														images={(field.value as unknown as string[]).map(
															(media) =>
																`https://drive.google.com/uc?export=view&id=${media}`
														)}
														isVideo={field.field === "Készíts videót és töltsd fel!"}
													/>
												</div>
											</div>
										);
									}
								})}
							{selectedSection === "Jegyzetek" && filter === "" ? (
								<div className='px-4 py-6 sm:px-0 relative w-full pt-10' ref={notesParent}>
									<div className='flex-col items-center justify-items w-full'>
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
						</dl>
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
				color='blue-gray'
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
