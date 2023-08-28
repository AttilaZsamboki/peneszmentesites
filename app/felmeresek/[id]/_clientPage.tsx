"use client";
import { AdatlapDetails, FelmeresQuestions, GridOptions, ScaleOption } from "../page";

import Heading from "../../_components/Heading";
const Sections = React.lazy(() => import("../../_components/Sections"));

import { useGlobalState } from "../../_clientLayout";

import React from "react";

import { Typography, Spinner, Switch, CardBody, Card, CardHeader, Slider, Checkbox } from "@material-tailwind/react";
import { XMarkIcon, CheckIcon } from "@heroicons/react/20/solid";
import { BaseFelmeresData, FelmeresItems } from "../new/_clientPage";
import { Question, isJSONParsable } from "@/app/questions/page";
import { Template } from "@/app/templates/page";
import MultipleChoice from "@/app/_components/MultipleChoice";
import { Grid } from "@/app/_components/Grid";
import Gallery from "@/app/_components/Gallery";

export const hufFormatter = new Intl.NumberFormat("hu-HU", {
	style: "currency",
	currency: "HUF",
});

export default function ClientPage({
	felmeresQuestions,
	felmeresId,
	felmeres,
	felmeresItems,
	adatlap,
	questions,
	template,
}: {
	felmeresQuestions: FelmeresQuestions[];
	felmeresId: string;
	felmeres: BaseFelmeresData;
	felmeresItems: FelmeresItems[];
	questions: Question[];
	adatlap: AdatlapDetails;
	template: Template;
}) {
	const { setAlert, setConfirm } = useGlobalState();
	interface PageMap {
		component: JSX.Element;
		title: string;
	}

	const sections: PageMap[] = [
		{
			component: <Page1 felmeres={felmeres} adatlap={adatlap} template={template} />,
			title: "Alapadatok",
		},
		{
			component: <Page2 items={felmeresItems} />,
			title: "Tételek",
		},
		...Array.from(
			new Set(
				felmeresQuestions
					.filter((question) => question.value && question.value !== "")
					.map((question) => question.section)
			)
		).map((product) => ({
			component: <QuestionPage product={product} questions={questions} data={felmeresQuestions} />,
			title: product,
		})),
	];

	const [originalData, setOriginalData] = React.useState(felmeresQuestions);
	const [filteredData, setFilteredData] = React.useState(
		felmeresQuestions.filter((field) => field.section === sections[0].title)
	);
	const [filter, setFilter] = React.useState("");
	const [selectedSection, setSelectedSection] = React.useState("");
	const [isLoading, setIsLoading] = React.useState(true);
	const [isEditing, setIsEditing] = React.useState(false);
	const [modifiedData, setModifiedData] = React.useState<FelmeresQuestions[]>([]);
	const [isAll, setIsAll] = React.useState(false);

	React.useEffect(() => {
		setSelectedSection(sections[0].title);
	}, []);
	React.useEffect(() => {
		setFilteredData(
			originalData.filter((field) =>
				filter
					? questions
							.find((question) => question.id === field.question)
							?.question.toLowerCase()
							.includes(filter.toLowerCase()) ||
					  JSON.stringify(field.value).toLowerCase().includes(filter.toLowerCase())
					: field.section === selectedSection
			)
		);
	}, [filter, selectedSection]);
	React.useEffect(() => {
		setIsLoading(false);
	}, []);

	return (
		<div className='w-full'>
			<div className='flex flex-row w-ful flex-wrap lg:flex-nowrap justify-center mt-2'>
				<div className='lg:mt-6 lg:px-10 w-full'>
					<Card className='shadow-none'>
						<CardBody className='bg-white p-8 lg:rounded-lg bg-transparent bg-opacity-20 lg:border transform'>
							<Heading
								title={
									selectedSection
										? sections.find((section) => section.title === selectedSection)!.title
										: sections[0].title
								}
								variant='h3'
								border={false}
							/>
							{isAll
								? sections.map((section, index) => {
										if (index === 0) {
											return section.component;
										}
										return (
											<div className='border-t'>
												<Heading variant='h3' border={false} title={section.title} />
												{section.component}
											</div>
										);
								  })
								: sections.find((section) => section.title === selectedSection)?.component}
						</CardBody>
					</Card>
				</div>
				<div className='w-full lg:w-3/12 lg:mr-10 flex justify-center lg:justify-normal lg:items-start items-center mt-6'>
					<div className='w-full sticky top-8'>
						<Typography
							variant='h4'
							className='relative bg-clip-border mx-4 rounded-xl overflow-hidden bg-gradient-to-tr from-gray-900 to-gray-800 text-white shadow-gray-900/20 shadow-lg mb-8 py-2 text-center'
							color='gray'>
							{adatlap.Name}
						</Typography>
						<React.Suspense
							fallback={
								<Sections
									sectionNames={sections.map((section) => section.title)}
									selected={selectedSection}
									setSelected={setSelectedSection}
									filter={filter}
									setFilter={setFilter}
									disabled={true}
								/>
							}>
							<div className='relative'>
								<Sections
									sectionNames={sections.map((section) => section.title)}
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
															"https://pen.dataupload.xyz/felmeres_questions/" +
																field.id +
																"/",
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
						<div className='flex flex-row w-full justify-between my-5 p-2 px-4 border rounded-md items-center'>
							<Typography className={`${isLoading ? "text-gray-600" : ""}`} variant='h6'>
								Minden
							</Typography>
							<Checkbox
								crossOrigin=''
								disabled={isLoading}
								color='gray'
								onChange={() => {
									setIsAll(!isAll);
								}}
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

function Page1({
	adatlap,
	template,
	felmeres,
}: {
	adatlap: AdatlapDetails;
	template: Template;
	felmeres: BaseFelmeresData;
}) {
	return (
		<>
			<QuestionTemplate title='Adatlap'>
				<div>{adatlap.Name}</div>
			</QuestionTemplate>
			<QuestionTemplate title='Milyen rendszert tervezel?'>
				<div>{felmeres.type}</div>
			</QuestionTemplate>
			<QuestionTemplate title='Sablon'>
				<div>{template.name}</div>
			</QuestionTemplate>
		</>
	);
}

function Page2({ items }: { items: FelmeresItems[] }) {
	const TABLE_HEAD = ["Név", "Darab + Hely", "Nettó egység", "Nettó összesen"];

	return (
		<Card className='my-5'>
			<div className=''>
				<table className='w-full min-w-max table-auto text-left max-w-20 overflow-x-scroll'>
					<thead>
						<tr>
							{TABLE_HEAD.map((head) => (
								<th key={head} className='border-b border-blue-gray-100 bg-blue-gray-50 p-4'>
									<Typography
										variant='small'
										color='blue-gray'
										className='font-normal leading-none opacity-70'>
										{head}
									</Typography>
								</th>
							))}
						</tr>
					</thead>
					<tbody>
						{items
							.sort((a, b) => a.productId - b.productId)
							.map(({ name, place, inputValues, netPrice }, index) => {
								const isLast = index === items.length - 1;
								const classes = isLast ? "p-4" : "p-4 border-b border-blue-gray-50";

								return (
									<tr key={name}>
										<td className={classes}>
											<Typography
												variant='small'
												color='blue-gray'
												className='font-normal max-w-[30rem]'>
												{name}
											</Typography>
										</td>
										{inputValues
											.sort((a, b) => a.id - b.id)
											.map((inputValue) => (
												<div className='flex flex-row'>
													<td className={classes}>
														<div>{inputValue.ammount}</div>
													</td>
													{place ? (
														<td
															className={
																classes + " flex flex-row w-full items-center gap-2"
															}>
															<div className='font-normal flex flex-col gap-2 max-w-[17rem]'>
																<div className='flex-row flex items-center gap-2'>
																	<div>{inputValue.value}</div>
																</div>
															</div>
														</td>
													) : null}
												</div>
											))}
										<td className={classes}>
											<Typography
												variant='small'
												color='blue-gray'
												className='font-normal max-w-[30rem]'>
												{hufFormatter.format(netPrice)}
											</Typography>
										</td>
										<td className={classes}>
											<Typography
												variant='small'
												color='blue-gray'
												className='font-normal max-w-[30rem]'>
												{hufFormatter.format(
													netPrice * inputValues.reduce((a, b) => a + b.ammount, 0)
												)}
											</Typography>
										</td>
									</tr>
								);
							})}
					</tbody>
					<tfoot className='bg-gray'>
						<tr>
							<td className='border-b border-blue-gray-100 bg-blue-gray-50 p-4'>Össz:</td>
							<td className='border-b border-blue-gray-100 bg-blue-gray-50 p-4'></td>
							<td className='border-b border-blue-gray-100 bg-blue-gray-50 p-4'></td>
							<td className='border-b border-blue-gray-100 bg-blue-gray-50 p-4'>
								<Typography
									variant='small'
									color='blue-gray'
									className='font-normal leading-none opacity-70'>
									{hufFormatter.format(
										items
											.map(
												({ inputValues, netPrice }) =>
													netPrice * inputValues.reduce((a, b) => a + b.ammount, 0)
											)
											.reduce((a, b) => a + b, 0)
									)}
								</Typography>
							</td>
						</tr>
					</tfoot>
				</table>
			</div>
		</Card>
	);
}

function QuestionTemplate({ children, title, type }: { children: React.ReactNode; title: string; type?: string }) {
	return (
		<div className='px-4 py-6 flex flex-row sm:gap-4 sm:px-0'>
			<div className='text-base font-medium leading-6 text-gray-900 w-1/3'>{title}</div>
			<div className='flex justify-end w-full items-center'>
				<div
					className={`${["GRID", "CHECKBOX_GRID", "FILE_UPLOAD"].includes(type ?? "") ? "w-full" : "w-1/3"}`}>
					{children}
				</div>
			</div>
		</div>
	);
}

function QuestionPage({
	questions,
	data,
	product,
}: {
	questions: Question[];
	data: FelmeresQuestions[];
	product: string;
}) {
	return data
		.filter((d) => d.section === product)
		.map((d) => {
			const question = questions.find((question) => question.id === d.question)!;
			return (
				<QuestionTemplate title={question.question} type={question.type}>
					<FieldViewing data={d} question={question} />
				</QuestionTemplate>
			);
		});
}

function FieldViewing({ data, question }: { data: FelmeresQuestions; question: Question }) {
	if (["TEXT", "LIST", "MULTIPLE_CHOICE"].includes(question.type)) {
		return (
			<dd className='mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0 lg:text-right'>{data.value}</dd>
		);
	} else if (question.type === "CHECKBOX") {
		return (
			<MultipleChoice
				options={(question.options as string[]).map((option) => option)}
				value={data.value}
				onChange={() => {}}
				radio={false}
				disabled
			/>
		);
	} else if (question.type === "GRID" || question.type === "CHECKBOX_GRID") {
		return (
			<Grid
				columns={(question.options as GridOptions).columns}
				rows={(question.options as GridOptions).rows}
				value={
					isJSONParsable(data.value)
						? (JSON.parse(data.value) as unknown as { column: string; row: number }[])
						: []
				}
				radio={question.type === "CHECKBOX_GRID" ? false : true}
				disabled
			/>
		);
	} else if (question.type === "SCALE") {
		return (
			<div className='flex flex-col justify-center space-y-2 lg:w-full lg:col-span-2 cursor-default'>
				<div className='mt-1 text-md leading-6 text-gray-700 sm:col-span-2 sm:mt-0 lg:text-right'>
					{data.value}
				</div>
				<Slider
					value={(parseInt(data.value) / (question.options as ScaleOption).max) * 100}
					style={{ color: "#ADBCC3" }}
				/>
			</div>
		);
	} else if (question.type === "FILE_UPLOAD") {
		return (
			<div className='lg:col-span-2'>
				<Gallery
					images={isJSONParsable(data.value) ? (JSON.parse(data.value) as unknown as string[]) : []}
					isVideo={false}
				/>
			</div>
		);
	}
}
