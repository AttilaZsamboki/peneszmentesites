"use client";
import { FelmeresQuestion, GridOptions } from "../page";
import { AdatlapData } from "../_utils/types";

import Heading from "../_components/Heading";
const Sections = React.lazy(() => import("../_components/Sections"));

import React from "react";

import { Spinner, Tabs, TabsHeader, Tab } from "@material-tailwind/react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BaseFelmeresData, FelmeresItem, FelmeresMunkadíj, QuestionTemplate } from "../new/_clientPage";
import { QuestionPage } from "../../components/QuestionPage";

import { Question } from "@/app/questions/page";
import MultipleChoice from "@/app/_components/MultipleChoice";
import { Grid } from "@/app/_components/Grid";
import Gallery from "@/app/_components/Gallery";

import { FelmeresStatus, statusMap } from "@/app/_utils/utils";
import { toast } from "sonner";
import useBreakpointValue from "../_components/useBreakpoint";
import { Separator } from "@/components/ui/separator";
import { CalendarDays, Download, FileEdit, MoreVerticalIcon, Trash2Icon, Copy } from "lucide-react";
import Link from "next/link";
import { Page2 } from "../new/Page2";
import _ from "lodash";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Product } from "../products/page";
import FileUpload from "../_components/FileUpload";
import ChatComponent, { Chat } from "@/components/chat";
import { Badge } from "@/components/ui/badge";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn, getCookie, useUserWithRole } from "@/lib/utils";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { concatAddress } from "../_utils/MiniCRM";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Munkadíj } from "../munkadij/page";
import { AdatalapInfoCard } from "@/components/component/adatalap-info-card";

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

export type SectionName =
	| ""
	| "Tételek"
	| "Alapadatok"
	| "Fix"
	| "Kérdések"
	| "Kép"
	| "Megjegyzések"
	| "Garancia"
	| number;

export interface PageMap {
	component: JSX.Element;
	title: string;
	id: SectionName;
	subSections?: PageMap[];
	onClick?: () => void;
	label?: React.ReactNode;
	description?: string;
}

export interface FelmeresPictures {
	id: number;
	felmeres: number;
	src: string;
}

export const FelmeresContext = React.createContext<{
	setTotal: React.Dispatch<React.SetStateAction<number>>;
}>({
	setTotal: () => {},
});

export default function ClientPage({
	felmeresQuestions,
	felmeresId,
	felmeresNonState,
	felmeresItems,
	adatlap,
	questions,
	products,
	pictures,
	chat,
	munkadíjak,
	felmeresMunkadíjak,
}: {
	felmeresQuestions: FelmeresQuestion[];
	felmeresId: string;
	felmeresNonState: BaseFelmeresData;
	felmeresItems: FelmeresItem[];
	questions: Question[];
	adatlap: AdatlapData;
	products: Product[];
	pictures: FelmeresPictures[];
	chat: Chat[];
	munkadíjak: Munkadíj[];
	felmeresMunkadíjak: FelmeresMunkadíj[];
}) {
	const [total, setTotal] = React.useState(0);
	const [felmeres, setFelmeres] = React.useState(
		felmeresNonState
			? felmeresNonState
			: ({ adatlap_id: 0, status: "DRAFT", type: "Helyi elszívós rendszer" } as BaseFelmeresData)
	);

	const [isEditing, setIsEditing] = React.useState(false);
	const [originalData, setOriginalData] = React.useState(
		felmeresQuestions.map((field) => ({
			...field,
			value: isJSONParsable(field.value) ? JSON.parse(field.value) : field.value,
		}))
	);
	const [filteredData, setFilteredData] = React.useState(
		felmeresQuestions.map((field) => ({
			...field,
			value: isJSONParsable(field.value) ? JSON.parse(field.value) : field.value,
		}))
	);
	const [statePictures, setStatePictures] = React.useState(pictures);
	const [stateChat, setStateChat] = React.useState<Chat[]>(chat);
	const { user } = useUserWithRole();

	const handleSeenChat = async () => {
		const response = await fetch(`https://pen.dataupload.xyz/felmeres-notes/?felmeres_id=${felmeresId}`, {
			method: "PATCH",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				seen: true,
			}),
		});
		if (response.ok) {
			await fetch("/api/revalidate?tag=" + felmeresId);
			setStateChat((prev) => prev.map((message) => ({ ...message, seen: true })));
			await fetch("/api/revalidate?tag=" + felmeresId);
		}
	};
	const sections: PageMap[] = React.useMemo(
		() => [
			{
				component: (
					<Page2
						felmeresMunkadíjak={felmeresMunkadíjak}
						originalMunkadíjak={munkadíjak}
						felmeres={felmeres}
						readonly={true}
						items={felmeresItems.filter((item) => item.type === "Item" || item.type === "Other Material")}
						otherItems={felmeresItems
							.filter((item) => item.type === "Fee")
							.map((item) => ({
								id: item.id ? item.id : 0,
								name: item.name,
								type: item.valueType ? item.valueType : "fixed",
								value: item.netPrice,
							}))}
						discount={
							felmeresItems.find((item) => item.type === "Discount")
								? felmeresItems.find((item) => item.type === "Discount")!.netPrice
								: 0
						}
					/>
				),
				title: "Tételek",
				id: "Tételek",
				onClick: () => setIsEditing(false),
			},
			{
				component: <div></div>,
				id: "Kérdések",
				title: "Kérdések",
				subSections: Array.from(
					new Set(
						felmeresQuestions
							.filter((question) => question.value && question.value !== "")
							.map((question) => question.product)
					)
				).map((product) => ({
					component: isEditing ? (
						<QuestionPage
							questions={questions.filter((question) =>
								felmeresQuestions
									.filter((field) => field.product === product)
									.map((field) => field.question)
									.includes(question.id)
							)}
							setData={setFilteredData}
							adatlap_id={felmeres.adatlap_id}
							globalData={filteredData.map((field) => ({
								...field,
								value: isJSONParsable(field.value) ? JSON.parse(field.value) : field.value,
							}))}
							product={product}
							key={product}
						/>
					) : (
						<QuestionPageRead product={product} questions={questions} data={originalData} key={product} />
					),
					title: products.find((p) => p.id === product)?.sku ?? "Fix kérdések",
					id: product ?? ("Fix" as SectionName),
				})),
			},
			{
				component: (
					<FelmeresPicturesComponent
						felmeres={felmeres}
						pictures={statePictures}
						setPictures={setStatePictures}
					/>
				),
				id: "Kép",
				title: "Képek",
			},
			{
				component: (
					<>
						<QuestionTemplate title='Feltétel'>
							<div className='mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0 '>
								{felmeres.garancia}
							</div>
						</QuestionTemplate>
						{felmeres.garancia_reason ? (
							<QuestionTemplate title='Indoklás'>
								<div className='mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0 '>
									{felmeres.garancia_reason}
								</div>
							</QuestionTemplate>
						) : null}
						<Separator className='my-2' />
						<QuestionTemplate title='Feltétéles beépítés?'>
							<div className='mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0 '>
								{felmeres.is_conditional ? "Igen" : "Nem"}
							</div>
						</QuestionTemplate>
						<QuestionTemplate title='Feltétel oka'>
							<div className='mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0 '>
								{felmeres.condition}
							</div>
						</QuestionTemplate>
					</>
				),
				id: "Garancia",
				title: "Garancia",
			},
			{
				component: <ChatComponent id={felmeres.id.toString()} chat={stateChat} setChat={setStateChat} />,
				id: "Megjegyzések",
				title: "Megjegyzések",
				label: (
					<div className='flex flex-row justify-between w-full items-center gap-2'>
						<div>Megjegyzések</div>
						<TooltipProvider>
							<Tooltip>
								<TooltipTrigger>
									<Badge
										variant={
											stateChat.filter((message) => !message.seen).length
												? "destructive"
												: "outline"
										}
										onClick={handleSeenChat}>
										{stateChat.filter((message) => !message.seen).length}
									</Badge>
								</TooltipTrigger>
								<TooltipContent>
									<p>Olvasottnak jelölés</p>
								</TooltipContent>
							</Tooltip>
						</TooltipProvider>
					</div>
				),
			},
		],
		[felmeres, isEditing, originalData, questions, stateChat, statePictures, products, filteredData]
	);
	const [isAll, setIsAll] = React.useState(true);
	const [selectedSection, setSelectedSection] = React.useState<SectionName>(isAll ? sections[0].id : "");

	const [filter, setFilter] = React.useState("");
	const [isLoading, setIsLoading] = React.useState(true);
	const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);
	const [openCopyDialog, setOpenCopyDialog] = React.useState(false);

	const deviceSize = useBreakpointValue();

	React.useEffect(() => {
		setFilteredData(
			originalData.filter((field) =>
				filter
					? questions
							.find((question) => question.id === field.question)
							?.question.toLowerCase()
							.includes(filter.toLowerCase()) ||
					  JSON.stringify(field.value).toLowerCase().includes(filter.toLowerCase())
					: selectedSection === "Fix"
					? !field.product
					: field.product === selectedSection
			)
		);
	}, [filter, selectedSection]);
	React.useEffect(() => {
		setIsLoading(false);
	}, []);

	const felmeresStatus = felmeres.status ? felmeres.status : "DRAFT";

	const changeStatus = async (status: FelmeresStatus) => {
		const response = await fetch(`https://pen.dataupload.xyz/felmeresek/${felmeresId}/`, {
			method: "PATCH",
			headers: {
				"Content-Type": "application/json",
				"Authorization": `Bearer ${getCookie("jwt")}`,
			},
			body: JSON.stringify({
				status: status,
			}),
		});
		if (response.ok) {
			setFelmeres((prev) => ({ ...prev, status } as BaseFelmeresData));
			await fetch("/api/revalidate?tag=" + felmeresId);
			await fetch("/api/revalidate?path=/");
		}
	};
	const handleDelete = async () => {
		const cookie = getCookie("jwt");
		if (!cookie || !user || user.role !== "Admin") return;
		const response = await fetch(`https://pen.dataupload.xyz/felmeresek/${felmeresId}/`, {
			method: "DELETE",
			headers: {
				"Content-Type": "application/json",
				"Authorization": `Bearer ${cookie}`,
			},
		});
		if (response.ok) {
			await fetch("/api/revalidate?tag=felmeresek");
			window.location.href = "/";
		} else {
			toast.error("Hiba", {
				description: response.status === 403 ? "Nem engedélyezett művelet" : "Hiba történt a törlés során",
			});
		}
	};

	return (
		<div className='w-full overflow-y-scroll overflow-x-hidden lg:h-[98dvh] h-[92dvh]'>
			<div className='flex flex-row w-full flex-wrap lg:flex-nowrap justify-center mt-0 lg:mt-2 lg:px-6 px-0 gap-6'>
				<div className='w-full'>
					<div className='mt-0 w-full'>
						<Card className='lg:rounded-lg rounded-none border-0'>
							<div className='py-3 flex gap-2 justify-between items-center pr-2 lg:pr-4 lg:rounded-t-lg rounded-t-none top-0 sticky z-40 pl-10 bg-blue-800 text-white border-blue-500  w-full backdrop-saturate-200 backdrop-blur-2xl bg-opacity-80 border-b border-white/80'>
								<div className='prose prose-slate prose-img:m-0 prose-img:p-0'>
									<HoverCard>
										<HoverCardTrigger asChild className='mb-0'>
											<h2 className='text-white'>
												<button className='lg:break-keep lg:w-full truncate w-40'>
													{felmeres.name}
												</button>
											</h2>
										</HoverCardTrigger>
										<HoverCardContent className='w-80'>
											<div className='flex justify-between space-x-4'>
												<div className='prose prose-slate space-y-1'>
													<h4 className='text-sm font-semibold hover:underline cursor-pointer'>
														<a
															href={`https://r3.minicrm.hu/119/#Project-23/${adatlap.Id}`}
															target='_blank'>
															{adatlap.Name}
														</a>
													</h4>
													<p className='text-sm w-52 truncate'>{concatAddress(adatlap)}</p>

													<div className='flex items-center pt-2'>
														<CalendarDays className='mr-2 h-4 w-4 opacity-70' />{" "}
														<span className='text-xs text-muted-foreground'>
															{adatlap.CreatedAt}
														</span>
													</div>
												</div>
											</div>
										</HoverCardContent>
									</HoverCard>
								</div>
								<div className='flex flex-row items-center gap-5'>
									<div className='flex flex-row items-center gap-2 justify-center'>
										<DropdownMenu>
											<DropdownMenuTrigger asChild>
												<Button
													color={statusMap[felmeresStatus].color}
													className={cn(
														felmeresStatus === "IN_PROGRESS" ||
															felmeresStatus === "COMPLETED"
															? "cursor-pointer"
															: "cursor-default",
														"uppercase font-semibold w-24 text-xs lg:text-sm lg:w-32 shadow-md"
													)}>
													{statusMap[felmeresStatus].name}
												</Button>
											</DropdownMenuTrigger>
											{felmeres.status === "IN_PROGRESS" || felmeres.status === "COMPLETED" ? (
												<DropdownMenuContent>
													{felmeres.status === "IN_PROGRESS" ? (
														<DropdownMenuItem
															className='uppercase font-bold text-center'
															onClick={() => changeStatus("COMPLETED")}>
															Kész
														</DropdownMenuItem>
													) : felmeres.status === "COMPLETED" ? (
														<DropdownMenuItem
															className='uppercase font-bold text-center'
															onClick={() => changeStatus("IN_PROGRESS")}>
															Folyamatban
														</DropdownMenuItem>
													) : null}
												</DropdownMenuContent>
											) : null}
										</DropdownMenu>

										<DropdownMenu>
											<DropdownMenuTrigger asChild>
												<MoreVerticalIcon className='cursor-pointer' />
											</DropdownMenuTrigger>
											<DropdownMenuContent className='w-56'>
												<DropdownMenuGroup>
													<DropdownMenuItem
														disabled={
															felmeresStatus === "CANCELLED" ||
															felmeres.offer_status === "Elfogadott ajánlat" ||
															felmeres.offer_status == "Sikeres megrendelés"
														}>
														<Link
															href={`/${felmeresId}/edit`}
															className='flex flex-row items-center w-full'>
															<FileEdit className='mr-2 h-4 w-4' />
															Módosítás
														</Link>
													</DropdownMenuItem>

													<DropdownMenuItem onClick={() => setOpenCopyDialog(true)}>
														<Copy className='mr-2 h-4 w-4' />
														<span>Másolás</span>
													</DropdownMenuItem>
													{user?.role === "Admin" ? (
														<DropdownMenuItem onClick={() => setOpenDeleteDialog(true)}>
															<Trash2Icon className='text-red-700 mr-2 h-4 w-4' />
															Törlés
														</DropdownMenuItem>
													) : null}
												</DropdownMenuGroup>
											</DropdownMenuContent>
										</DropdownMenu>
										<AlertDialog
											open={openDeleteDialog}
											onOpenChange={() => setOpenDeleteDialog((prev) => !prev)}>
											<AlertDialogContent>
												<AlertDialogHeader>
													<AlertDialogTitle>
														Biztos hogy törölni akarod a felmérést?
													</AlertDialogTitle>
													<AlertDialogDescription>
														Ez a művelet nem visszavonható.
													</AlertDialogDescription>
												</AlertDialogHeader>
												<AlertDialogFooter>
													<AlertDialogAction onClick={handleDelete}>Törlés</AlertDialogAction>
													<AlertDialogCancel>Mégse</AlertDialogCancel>
												</AlertDialogFooter>
											</AlertDialogContent>
										</AlertDialog>
										<AlertDialog
											open={openCopyDialog}
											onOpenChange={() => setOpenCopyDialog((prev) => !prev)}>
											<AlertDialogContent>
												<AlertDialogHeader>
													<AlertDialogTitle>
														Biztos másolni szeretnéd a felmérést?
													</AlertDialogTitle>
												</AlertDialogHeader>
												<AlertDialogFooter>
													<AlertDialogCancel>Mégsem</AlertDialogCancel>
													<AlertDialogAction
														onClick={async () => {
															const response = await fetch(
																`https://pen.dataupload.xyz/${felmeresId}/copy-felmeres/`,
																{ method: "POST" }
															);
															if (response.ok) {
																const data = await response.json();
																await fetch("/api/revalidate?tag=felmeresek");
																window.location.href = `/${data.id}`;
															} else {
																toast.error("Hiba", {
																	description: "Hiba történt a másolás során",
																});
															}
															setOpenCopyDialog(false);
														}}>
														Igen
													</AlertDialogAction>
												</AlertDialogFooter>
											</AlertDialogContent>
										</AlertDialog>
									</div>
								</div>
							</div>

							<CardContent>
								<FelmeresContext.Provider value={{ setTotal }}>
									{isAll
										? sections.map((section, index) => {
												if (index === 0) {
													return section.component;
												}
												if (section.subSections && section.subSections.length === 0) return;
												return (
													<>
														<Separator className='my-5' />
														<div key={index} className=''>
															<Heading
																id={section.id.toString()}
																variant='h3'
																border={false}
																marginY='my-5'
																title={section.title}
															/>
															{section.component}
														</div>
														{section.subSections
															?.sort(
																(a, b) =>
																	Number(a.id === "Fix") - Number(b.id === "Fix")
															)
															.map((subSection) => {
																return (
																	<div key={subSection.id}>
																		<Heading
																			id={subSection.id.toString()}
																			variant='h5'
																			border={false}
																			marginY='my-5 font-medium text-left ml-0 pl-0 w-full'
																			title={subSection.title}
																		/>
																		{subSection.component}
																	</div>
																);
															})}
													</>
												);
										  })
										: sections
												.map((section) =>
													[...(section.subSections ?? []), section].find(
														(section) => section?.id === selectedSection
													)
												)
												.filter((section) => section !== undefined)[0]?.component}
								</FelmeresContext.Provider>
							</CardContent>
						</Card>
					</div>
				</div>
				{deviceSize !== "sm" ? (
					<AdatalapInfoCard
						datas={{
							accepted:
								felmeres.offer_status === "Elfogadott ajánlat" ||
								felmeres.offer_status == "Sikeres megrendelés"
									? "Igen"
									: "Nem",
							contactName: adatlap.Name,
							status: statusMap[felmeres.status].name,
							rendszer: felmeres.type,
							total: hufFormatter.format(total),
							adatlapId: felmeres.adatlap_id,
							felmero: adatlap.Felmero2,
						}}>
						<Sections
							options={sections
								.map((section) => ({
									label: section.label ?? section.title,
									value: section.id,
									subOptions: section.subSections?.map((sub) => ({
										label: sub.label ?? sub.title,
										value: sub.id,
									})),
									onClick: section.onClick,
								}))
								.filter((section) => (section.subOptions ? section.subOptions.length > 0 : true))}
							href={(value) => `/${felmeresId}#${isAll ? value : ""}`}
							selected={selectedSection}
							setSelected={setSelectedSection as React.Dispatch<React.SetStateAction<string | number>>}
							filter={filter}
							setFilter={setFilter}
						/>
						{isLoading ? (
							<div className='absolute top-1/3 left-1/2 h-10 w-10'>
								<Spinner color='blue-gray' className='w-10 h-10 relative right-4' />
							</div>
						) : (
							<div></div>
						)}
					</AdatalapInfoCard>
				) : (
					<div className='bg-white sm:border-t-0 border-t bottom-0 fixed z-40 w-full pt-2'>
						<Tabs
							value={sections[0].title}
							className='flex flex-row w-full border-b pl-3 lg:pl-6 items-center overflow-x-scroll'>
							{sections.map((section) => (
								<TabsHeader
									key={section.title}
									className='rounded-none bg-transparent p-0'
									onClick={() => setSelectedSection(section.id)}
									indicatorProps={{
										className:
											"bg-transparent border-b-2 border-gray-900 mx-3 shadow-none rounded-none",
									}}>
									<Link href={`/${felmeresId}#${isAll ? section.id : ""}`}>
										<Tab value={section.title} className='pb-2'>
											<div className='hover:bg-gray-100 px-3 py-1 rounded-md truncate max-w-[12rem]'>
												{section.label ?? section.title}
											</div>
										</Tab>
									</Link>
								</TabsHeader>
							))}
						</Tabs>
					</div>
				)}
			</div>
		</div>
	);
}

function QuestionPageRead({
	questions,
	data,
	product,
}: {
	questions: Question[];
	data: FelmeresQuestion[];
	product: number | null;
}) {
	return (
		<div className='flex flex-col gap-10'>
			{data
				.filter((d) => d.product === product)
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

function FieldViewing({ data, question }: { data: FelmeresQuestion; question: Question }) {
	if (["TEXT", "LIST", "MULTIPLE_CHOICE", "SCALE"].includes(question.type)) {
		return <div className='mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0 '>{data.value}</div>;
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
				value={data.value as unknown as { column: string; row: number }[]}
				radio={question.type === "CHECKBOX_GRID" ? false : true}
				disabled
			/>
		);
	} else if (question.type === "FILE_UPLOAD") {
		return (
			<div className='lg:col-span-2'>
				<div className='w-full flex flex-row justify-end pb-4'>
					<Button size='icon' color='blue' onClick={() => handleDownload(data.value as unknown as string[])}>
						<Download />
					</Button>
				</div>
				<Gallery media={data.value as unknown as string[]} />
			</div>
		);
	}
}

export function FelmeresPicturesComponent({
	pictures,
	setPictures,
	felmeres,
	save = true,
	onUploadSuccess,
	onUpload,
}: {
	pictures: FelmeresPictures[];
	setPictures: React.Dispatch<React.SetStateAction<FelmeresPictures[]>>;
	felmeres: BaseFelmeresData;
	save?: boolean;
	onUploadSuccess?: (file: any) => void;
	onUpload?: (file: any) => void;
}) {
	return (
		<div className='flex flex-col gap-2 w-full'>
			<div className='w-full flex flex-row justify-end pb-4'>
				<Button size='icon' color='blue' onClick={() => handleDownload(pictures.map((pic) => pic.src))}>
					<Download />
				</Button>
			</div>

			<Gallery
				media={pictures.map((pic) => pic.src)}
				edit={true}
				onDelete={async (index) => {
					const pic = pictures[index];
					if (!pic.id && !save) {
						setPictures((prev) => prev.filter((pic, i) => i !== index));
						return;
					}
					const resp = await fetch("https://pen.dataupload.xyz/felmeres-pictures/" + pictures[index].id, {
						method: "DELETE",
					});
					if (resp.ok) {
						setPictures((prev) => prev.filter((pic, i) => i !== index));
						await fetch("/api/revalidate?tag=" + felmeres.id);
					}
				}}
			/>
			<FileUpload
				felmeresId={felmeres.id.toString()}
				onUploadSuccess={(e, file) => (onUploadSuccess ? onUploadSuccess(file) : undefined)}
				onUpload={async (file) => {
					onUpload ? onUpload(file) : {};
					const prefixFilename =
						"https://felmeres-note-images.s3.eu-central-1.amazonaws.com/" + felmeres.id + file.filename;
					if (!save) {
						setPictures((prev) => [
							...prev,
							{
								id: 0,
								felmeres: 0,
								src: prefixFilename,
							},
						]);
						return;
					}
					const resp = await fetch("https://pen.dataupload.xyz/felmeres-pictures/", {
						method: "POST",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify({
							felmeres: felmeres.id,
							src: prefixFilename,
						}),
					});
					if (resp.ok) {
						const data = await resp.json();
						setPictures((prev) => [
							...prev,
							{
								id: data.id,
								felmeres: felmeres.id,
								src: prefixFilename,
							},
						]);
						await fetch("/api/revalidate?tag=" + felmeres.id);
					}
				}}
			/>
		</div>
	);
}

const handleDownload = async (pictures: string[]) => {
	for (const pic of pictures) {
		fetch(pic, {
			method: "GET",
			cache: "no-store",
		})
			.then((response) => response.blob())
			.catch((error) => console.error(error))
			.then((blob) => {
				if (blob === undefined) return;
				// Create blob link to download
				const url = window.URL.createObjectURL(new Blob([blob]));
				const link = document.createElement("a");
				link.href = url;
				link.setAttribute("download", pic.split("/").pop() ?? "");

				// Append to html link element page
				document.body.appendChild(link);

				// Start download
				link.click();

				// Clean up and remove the link
				link.parentNode?.removeChild(link);
			});
	}
};
