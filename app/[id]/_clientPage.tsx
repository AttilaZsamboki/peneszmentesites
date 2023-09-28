"use client";
import { FelmeresQuestions, GridOptions, ScaleOption } from "../page";
import { AdatlapDetails } from "@/app/_utils/MiniCRM";

import Heading from "../_components/Heading";
const Sections = React.lazy(() => import("../_components/Sections"));

import { useGlobalState } from "../_clientLayout";

import React from "react";

import { Typography, Spinner, Switch, Slider, Tabs, TabsHeader, Tab } from "@material-tailwind/react";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { XMarkIcon, CheckIcon, ChevronRightIcon, ChevronLeftIcon } from "@heroicons/react/20/solid";
import { BaseFelmeresData, FelmeresItem, QuestionTemplate } from "../new/_clientPage";

import { Question } from "@/app/questions/page";
import { Template } from "@/app/templates/page";
import MultipleChoice from "@/app/_components/MultipleChoice";
import { Grid } from "@/app/_components/Grid";
import Gallery from "@/app/_components/Gallery";

import { statusMap } from "@/app/_utils/utils";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";
import useBreakpointValue from "../_components/useBreakpoint";
import { Separator } from "@/components/ui/separator";
import {
	DropdownMenuContent,
	DropdownMenuLabel,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
	DropdownMenu,
} from "@/components/ui/dropdown-menu";

export function isJSONParsable(str: string) {
	try {
		JSON.parse(str);
		return true;
	} catch (e) {
		return false;
	}
}

export const hufFormatter = new Intl.NumberFormat("hu-HU", {
	style: "currency",
	currency: "HUF",
});

export default function ClientPage({
	felmeresQuestions,
	felmeresId,
	felmeresNonState,
	felmeresItems,
	adatlap,
	questions,
	template,
}: {
	felmeresQuestions: FelmeresQuestions[];
	felmeresId: string;
	felmeresNonState: BaseFelmeresData;
	felmeresItems: FelmeresItem[];
	questions: Question[];
	adatlap: AdatlapDetails;
	template: Template;
}) {
	interface PageMap {
		component: JSX.Element;
		title: string;
	}
	const [felmeres, setFelmeres] = React.useState(
		felmeresNonState
			? felmeresNonState
			: ({ adatlap_id: 0, status: "DRAFT", template: 0, type: "Helyi elszívós rendszer" } as BaseFelmeresData)
	);

	const sections: PageMap[] = [
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

	const { toast } = useToast();
	const [originalData, setOriginalData] = React.useState(felmeresQuestions);
	const [filteredData, setFilteredData] = React.useState(
		felmeresQuestions.filter((field) => field.section === sections[0].title)
	);
	const [filter, setFilter] = React.useState("");
	const [selectedSection, setSelectedSection] = React.useState("");
	const [isLoading, setIsLoading] = React.useState(true);
	const [isEditing, setIsEditing] = React.useState(false);
	const [modifiedData, setModifiedData] = React.useState<FelmeresQuestions[]>([]);

	const deviceSize = useBreakpointValue();
	const [isAll, setIsAll] = React.useState(false);

	React.useEffect(() => {
		setSelectedSection(sections[0].title);
	}, [isAll]);
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

	const felmeresStatus = felmeres.status ? felmeres.status : "DRAFT";

	const changeStatus = async (status: string) => {
		const response = await fetch(`https://pen.dataupload.xyz/felmeresek/${felmeresId}/`, {
			method: "PATCH",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				status: status,
			}),
		});
		if (response.ok) {
			setFelmeres((prev) => ({ ...prev, status } as BaseFelmeresData));
			await fetch("/api/revalidate?tag=" + encodeURIComponent(felmeresId));
			await fetch("/api/revalidate?tag=felmeresek");
		}
	};

	return (
		<div className='w-full overflow-y-scroll overflow-x-hidden lg:h-[93dvh] h-[80dvh]'>
			<div className='flex flex-row w-ful flex-wrap lg:flex-nowrap justify-center mt-2'>
				<div className='w-full'>
					<div className='mt-6 lg:px-10 px-3 w-full'>
						<Card>
							<CardHeader>
								<div className='flex gap-5 flex-row items-center justify-between w-full flex-wrap'>
									<div className='flex flex-row items-center gap-5'>
										<CardTitle>{adatlap.Name}</CardTitle>
										<DropdownMenu>
											<DropdownMenuTrigger asChild>
												<Button
													color={statusMap[felmeresStatus].color}
													className='uppercase font-semibold w-32'>
													{statusMap[felmeresStatus].name}
												</Button>
											</DropdownMenuTrigger>
											<DropdownMenuContent className='w-56'>
												<DropdownMenuLabel>Felmérés státusza</DropdownMenuLabel>
												<DropdownMenuSeparator />
												<DropdownMenuRadioGroup
													value={felmeresStatus}
													onValueChange={changeStatus}>
													{Object.entries(statusMap).map(([key, value]) => (
														<DropdownMenuRadioItem key={key} value={key}>
															{value.name}
														</DropdownMenuRadioItem>
													))}
												</DropdownMenuRadioGroup>
											</DropdownMenuContent>
										</DropdownMenu>
									</div>
									{deviceSize === "sm" ? <Separator /> : null}
									<div className='flex w-full lg:w-1/4 lg:justify-normal justify-center h-5 items-center space-x-4 lg:text-md lg:font-medium text-sm'>
										<div>{adatlap.Felmero2 ?? ""}</div>
										<Separator orientation='vertical' />
										<div>{felmeres.type}</div>
										<Separator orientation='vertical' />
										<div>{template.name}</div>
									</div>
								</div>
							</CardHeader>
							<Separator className='mb-4' />
							<CardContent>
								{isAll
									? sections.map((section, index) => {
											if (index === 0) {
												return section.component;
											}
											return (
												<div key={index} className='border-t'>
													<Heading
														variant='h3'
														border={false}
														marginY='my-5'
														title={section.title}
													/>
													{section.component}
												</div>
											);
									  })
									: sections.find((section) => section.title === selectedSection)?.component}
							</CardContent>
						</Card>
					</div>
				</div>
				{deviceSize !== "sm" ? (
					<div className='w-full lg:w-3/12 lg:mr-10 flex justify-center lg:justify-normal lg:items-start items-center lg:px-0 px-3 mt-6'>
						<div className='w-full sticky top-8 '>
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
							<div className='flex flex-row w-full justify-between my-5 p-2 px-4 border rounded-md bg-white'>
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
												toast({
													title: "Biztosan elveted a módosításokat?",
													action: (
														<ToastAction
															altText='yes'
															onClick={() => {
																setModifiedData([]);
																setIsEditing(false);
															}}>
															Igen
														</ToastAction>
													),
												});
											}}
											className='w-6 h-6 cursor-pointer rounded-md bg-red-500 text-white p-1'
										/>
										<CheckIcon
											onClick={() => {
												toast({
													title: modifiedData.filter((field) => !field.value.length).length
														? "Biztosan elmented a módosításokat? (az üresen hagyott mezők törlésre kerülnek)"
														: "Biztosan elmented a módosításokat?",
													action: (
														<ToastAction
															altText='yes'
															onClick={() => {
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
																			prev.map((f) =>
																				f.id === field.id ? field : f
																			)
																		);
																		await fetch(
																			"/api/revalidate?tag=" +
																				encodeURIComponent(felmeresId)
																		);
																		setModifiedData([]);
																	} else {
																		toast({
																			title: "Hiba",
																			description:
																				"Hiba történt a változtatások metnése során",
																		});
																	}
																});
															}}>
															Igen
														</ToastAction>
													),
												});
											}}
											className='w-6 h-6 rounded-md cursor-pointer bg-green-500 text-white p-1'
										/>
									</div>
								)}
							</div>
							<div className='flex flex-row w-full justify-between bg-white my-5 p-2 px-4 border rounded-md items-center'>
								<Typography className={`${isLoading ? "text-gray-600" : ""}`} variant='h6'>
									Minden
								</Typography>
								<Checkbox
									disabled={isLoading}
									onCheckedChange={() => {
										setIsAll(!isAll);
										setSelectedSection(isAll ? sections[0].title : "");
									}}
								/>
							</div>
						</div>
					</div>
				) : (
					<div className='bg-white sm:border-t-0 border-t bottom-0 fixed z-40 w-full pt-2'>
						<Tabs
							value={sections[0].title}
							className='flex flex-row w-full border-b pl-3 lg:pl-6 items-center overflow-x-scroll'>
							{sections.map((section) => (
								<TabsHeader
									key={section.title}
									className='rounded-none bg-transparent p-0'
									onClick={() => setSelectedSection(section.title)}
									indicatorProps={{
										className:
											"bg-transparent border-b-2 border-gray-900 mx-3 shadow-none rounded-none",
									}}>
									<Tab value={section.title} className='pb-2'>
										<div className='hover:bg-gray-100 px-3 py-1 rounded-md truncate max-w-[12rem]'>
											{section.title}
										</div>
									</Tab>
								</TabsHeader>
							))}
						</Tabs>
					</div>
				)}
			</div>
		</div>
	);
}

function Page2({ items }: { items: FelmeresItem[] }) {
	const TABLE_HEAD = ["Név", "Darab + Hely", "Nettó egység", "Nettó összesen"];

	return (
		<Card className='my-5 rounded-sm'>
			<div className='w-full lg:overflow-hidden overflow-x-scroll'>
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
												<div key={inputValue.id} className='flex flex-row'>
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

function QuestionPage({
	questions,
	data,
	product,
}: {
	questions: Question[];
	data: FelmeresQuestions[];
	product: string;
}) {
	return (
		<div className='flex flex-col gap-10'>
			{data
				.filter((d) => d.section === product)
				.map((d) => {
					const question = questions.find((question) => question.id === d.question)!;
					return (
						<QuestionTemplate key={d.id} title={question.question}>
							<FieldViewing data={d} question={question} />
						</QuestionTemplate>
					);
				})}
		</div>
	);
}

function FieldViewing({ data, question }: { data: FelmeresQuestions; question: Question }) {
	if (["TEXT", "LIST", "MULTIPLE_CHOICE", "SCALE"].includes(question.type)) {
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
	} else if (question.type === "FILE_UPLOAD") {
		return (
			<div className='lg:col-span-2'>
				<Gallery
					media={isJSONParsable(data.value) ? (JSON.parse(data.value) as unknown as string[]) : [data.value]}
				/>
			</div>
		);
	}
}
