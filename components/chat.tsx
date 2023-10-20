import React, { useState, ChangeEvent } from "react";
import { useUser, UserProfile } from "@auth0/nextjs-auth0/client";
import { Input } from "./ui/input";
import { SendHorizonal, X } from "lucide-react";
import Gallery from "@/app/_components/Gallery";
import { cn } from "@/lib/utils";
import { Separator } from "./ui/separator";
import Link from "next/link";
import { useRouter } from "next/navigation";

export interface Chat {
	id: string;
	created_at: string;
	value: string;
	felmeres_id: string;
	user_id: string;
	reply_to?: string;
	type: "text" | "image";
}

export default function ChatComponent({ id, chat }: { id: string; chat: Chat[] }) {
	const { user, error, isLoading } = useUser();
	const [input, setInput] = useState("");
	const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
	const [stateChat, setStateChat] = useState<Chat[]>(chat);
	const [replyTo, setReplyTo] = useState<string | undefined>(undefined);
	const router = useRouter();
	const handleFileUpload = async (event: ChangeEvent<HTMLInputElement>) => {
		const files = Array.from(event.target.files ?? []);
		const formData = new FormData();

		files.forEach((file) => {
			formData.append("files", file);
		});

		const response = await fetch("https://pen.dataupload.xyz/save-image/", {
			method: "POST",
			body: formData,
		});

		if (response.ok) {
			setUploadedFiles((prevFiles) => [...prevFiles, ...files.map((file) => file.name)]);
		} else {
			console.error("File upload failed");
		}
	};

	const saveChat = async () => {
		const response = await fetch("https://pen.dataupload.xyz/felmeres-notes/", {
			method: "POST",
			body: JSON.stringify({
				value: uploadedFiles.length ? JSON.stringify(uploadedFiles) : input,
				created_at: new Date().toISOString(),
				felmeres_id: id,
				type: uploadedFiles.length ? "image" : "text",
				user_id: user?.name,
				reply_to: replyTo,
			}),
			headers: {
				"Content-Type": "application/json",
			},
		});
		if (response.ok) {
			const data = await response.json();
			setStateChat((prevChat) => [...prevChat, data]);
			setUploadedFiles([]);
			setInput("");
			setReplyTo(undefined);
			router.push(`${window.location.href.split("#")[0]}#${data.id}`);
			await fetch("/api/revalidate?tag=" + id);
		}
	};
	function groupMessages(messages: Chat[]) {
		const groupedMessages: Chat[][] = [];
		let group: Chat[] = [];

		messages.forEach((message, index) => {
			if (index === 0) {
				group.push(message);
			} else {
				const prevMessage = messages[index - 1];
				const currentMessage = message;

				const prevMessageDate = new Date(prevMessage.created_at);
				const currentMessageDate = new Date(currentMessage.created_at);

				const diffInMinutes = Math.abs(
					(currentMessageDate.getTime() - prevMessageDate.getTime()) / (1000 * 60)
				);

				if (diffInMinutes <= 5 && prevMessage.user_id === currentMessage.user_id) {
					group.push(message);
				} else {
					groupedMessages.push(group);
					group = [message];
				}
			}

			if (index === messages.length - 1) {
				groupedMessages.push(group);
			}
		});

		return groupedMessages;
	}
	function displayTime(message: Chat) {
		const messageDate = new Date(message.created_at);
		const today = new Date();

		if (
			messageDate.getDate() === today.getDate() &&
			messageDate.getMonth() === today.getMonth() &&
			messageDate.getFullYear() === today.getFullYear()
		) {
			return `${messageDate.getHours()}:${messageDate.getMinutes() < 10 ? "0" : ""}${messageDate.getMinutes()}`;
		} else {
			return messageDate.toDateString();
		}
	}
	const returnMessage = stateChat.find((message) => message.id === replyTo);

	const ImageMessage = ({ message }: { message: Chat }) => (
		<div id={message.id} className={cn("px-4 py-2 max-w-xs lg:max-w-md")}>
			<Gallery
				media={JSON.parse(message.value).map(
					(file: string) => `https://felmeres-note-images.s3.eu-central-1.amazonaws.com/${file}`
				)}
			/>
		</div>
	);
	return (
		<div className='h-[80vh] w-full flex antialiased  bg-white overflow-hidden'>
			<div className='flex-1 flex flex-col'>
				<main className='flex-grow flex flex-row min-h-0'>
					<section className='flex flex-col flex-auto'>
						<div className='chat-body p-4 flex-1 overflow-y-scroll'>
							{groupMessages(stateChat).map((group) => (
								<div key={group[0].id} className='flex flex-col gap-[2px]'>
									<div
										className={cn(
											"text-sm -mb-1 text-gray-800",
											group[0].user_id === user?.name ? "hidden" : ""
										)}>
										{group[0].user_id}
									</div>
									{group.map((message, index) => (
										<div
											key={message.id}
											className={cn(
												user?.name === message.user_id ? "justify-end" : "justify-start",
												"flex flex-row"
											)}>
											{message.user_id === user?.name ? (
												<div className='flex flex-row justify-end'>
													<div className='messages text-sm text-white grid grid-flow-row gap-2'>
														<div className='flex flex-col gap-1'>
															{message.reply_to ? (
																<ReplyBubble message={message} stateChat={stateChat}>
																	<div className='flex items-center flex-row-reverse group'>
																		{message.type === "image" ? (
																			<ImageMessage message={message} />
																		) : (
																			<div
																				id={message.id}
																				className={cn(
																					index === group.length - 1
																						? "rounded-br-full"
																						: "",
																					index === 0
																						? "rounded-tr-full"
																						: "",
																					"px-4 py-2 rounded-l-full bg-blue-700 max-w-xs lg:max-w-md"
																				)}>
																				{message.value}
																			</div>
																		)}
																		<button
																			type='button'
																			onClick={() => setReplyTo(message.id)}
																			className='hidden group-hover:block  flex-shrink-0 focus:outline-none mx-2  rounded-full text-gray-500 hover:text-gray-900 hover:bg-gray-200 bg-gray-300 w-8 h-8 p-2'>
																			<svg
																				viewBox='0 0 20 20'
																				className='w-full h-full fill-current'>
																				<path d='M19,16.685c0,0-2.225-9.732-11-9.732V2.969L1,9.542l7,6.69v-4.357C12.763,11.874,16.516,12.296,19,16.685z' />
																			</svg>
																		</button>
																	</div>
																</ReplyBubble>
															) : (
																<div className='flex items-center flex-row-reverse group'>
																	{message.type === "image" ? (
																		<ImageMessage message={message} />
																	) : (
																		<p
																			id={message.id}
																			className={cn(
																				index === group.length - 1
																					? "rounded-br-full"
																					: "",
																				index === 0 ? "rounded-tr-full" : "",
																				"px-4 py-2 rounded-l-full bg-blue-700 max-w-xs lg:max-w-md"
																			)}>
																			{message.value}
																		</p>
																	)}
																	<button
																		type='button'
																		onClick={() => setReplyTo(message.id)}
																		className='hidden group-hover:block  flex-shrink-0 focus:outline-none mx-2  rounded-full text-gray-500 hover:text-gray-900 hover:bg-gray-200 bg-gray-300 w-8 h-8 p-2'>
																		<svg
																			viewBox='0 0 20 20'
																			className='w-full h-full fill-current'>
																			<path d='M19,16.685c0,0-2.225-9.732-11-9.732V2.969L1,9.542l7,6.69v-4.357C12.763,11.874,16.516,12.296,19,16.685z' />
																		</svg>
																	</button>
																</div>
															)}
														</div>
													</div>
												</div>
											) : (
												<>
													<div className='messages text-sm text-gray-700 grid grid-flow-row gap-2'>
														{message.reply_to ? (
															<ReplyBubble message={message} stateChat={stateChat}>
																<OtherPartnerBubble
																	message={message}
																	index={index}
																	group={group}
																/>
															</ReplyBubble>
														) : (
															<OtherPartnerBubble
																message={message}
																index={index}
																group={group}
															/>
														)}
													</div>
												</>
											)}
										</div>
									))}
									<p className='p-4 text-center text-sm text-gray-500'>
										{displayTime(group[group.length - 1])}
									</p>
								</div>
							))}
						</div>
						{replyTo ? (
							<div className='pb-2'>
								<Separator />
								<div className='flex flex-col gap-1 px-1'>
									<div className='text-sm text-gray-800'>
										{returnMessage?.user_id === user?.name ? (
											"Válasz saját magadnak"
										) : (
											<>
												Válasz <span className='font-bold'>{returnMessage?.user_id}</span>{" "}
												számára
											</>
										)}
									</div>
									<div className='flex flex-row w-full justify-between pr-1'>
										<div className='text-sm text-gray-600'>
											{returnMessage?.type === "image" ? (
												<ImageMessage message={returnMessage} />
											) : (
												<div>{returnMessage?.value}</div>
											)}
										</div>
										<X
											onClick={() => setReplyTo(undefined)}
											className='cursor-pointer w-4 h-4 text-gray-700'
										/>
									</div>
								</div>
							</div>
						) : null}
						<div className='chat-footer flex-none pt-2'>
							<div className='flex flex-row items-center pb-1'>
								<input
									multiple
									onChange={(event) => handleFileUpload(event)}
									type='file'
									id='fileUpload'
									className='hidden'
								/>
								<button
									type='button'
									className='flex flex-shrink-0 focus:outline-none mx-2  text-blue-600 hover:text-blue-700 w-6 h-6'
									onClick={() => document.getElementById("fileUpload")?.click()}>
									<svg viewBox='0 0 20 20' className='w-full h-full fill-current'>
										<path d='M11,13 L8,10 L2,16 L11,16 L18,16 L13,11 L11,13 Z M0,3.99406028 C0,2.8927712 0.898212381,2 1.99079514,2 L18.0092049,2 C19.1086907,2 20,2.89451376 20,3.99406028 L20,16.0059397 C20,17.1072288 19.1017876,18 18.0092049,18 L1.99079514,18 C0.891309342,18 0,17.1054862 0,16.0059397 L0,3.99406028 Z M15,9 C16.1045695,9 17,8.1045695 17,7 C17,5.8954305 16.1045695,5 15,5 C13.8954305,5 13,5.8954305 13,7 C13,8.1045695 13.8954305,9 15,9 Z' />
									</svg>
								</button>
								<div className='relative flex-grow pb-2'>
									<div
										className={cn(
											uploadedFiles.length ? "rounded-xl" : "rounded-full",
											"w-full pr-2 border-0 bg-gray-100 flex flex-col items-center gap-2"
										)}>
										{uploadedFiles.length ? (
											<div className='flex flex-row justify-start w-full'>
												<Gallery
													edit={true}
													onDelete={(file) => {
														setUploadedFiles((prevFiles) =>
															prevFiles.filter((f, index) => index !== file)
														);
													}}
													width={150}
													media={uploadedFiles.map(
														(file) =>
															`https://felmeres-note-images.s3.eu-central-1.amazonaws.com/${file}`
													)}
												/>
											</div>
										) : null}
										<form className='flex flex-row w-full items-center'>
											{uploadedFiles.length ? (
												<div className='rounded-full focus-visible:ring-0 focus-visible:ring-offset-0 py-2 pl-3 pr-10 w-full border-0 bg-gray-100'></div>
											) : (
												<Input
													className='rounded-full focus-visible:ring-0 focus-visible:ring-offset-0 pl-3 w-full border-0 bg-gray-100'
													type='text'
													value={input}
													onChange={(e) => setInput(e.target.value)}
													placeholder='Aa'
												/>
											)}
											<button
												type='submit'
												onClick={(e) => {
													e.preventDefault();
													saveChat();
												}}
												className='flex flex-shrink-0 focus:outline-none  text-blue-600 hover:text-blue-700 w-6 h-6'>
												<SendHorizonal />
											</button>
										</form>
									</div>
								</div>
							</div>
						</div>
					</section>
				</main>
			</div>
		</div>
	);

	function OtherPartnerBubble({
		message,
		index,
		group,
	}: {
		message: Chat;
		index: number;
		group: Chat[];
	}): React.ReactNode {
		return (
			<div className='flex items-center group'>
				{message.type === "image" ? (
					<ImageMessage message={message} />
				) : (
					<p
						id={message.id}
						className={cn(
							index === group.length - 1 ? "rounded-bl-full" : "",
							index === 0 ? "rounded-tl-full" : "",
							"px-4 py-2 rounded-r-full bg-gray-200 max-w-xs lg:max-w-md text-gray-900"
						)}>
						{message.value}
					</p>
				)}
				<button
					type='button'
					onClick={() => setReplyTo(message.id)}
					className='hidden group-hover:block  flex-shrink-0 focus:outline-none mx-2  rounded-full text-gray-500 hover:text-gray-900 hover:bg-gray-200 bg-gray-300 w-8 h-8 p-2'>
					<svg viewBox='0 0 20 20' className='w-full h-full fill-current'>
						<path d='M19,16.685c0,0-2.225-9.732-11-9.732V2.969L1,9.542l7,6.69v-4.357C12.763,11.874,16.516,12.296,19,16.685z' />
					</svg>
				</button>
			</div>
		);
	}

	function ReplyBubble({
		message,
		stateChat,
		children,
	}: {
		message: Chat;
		stateChat: Chat[];
		children: React.ReactNode;
	}) {
		const replyMessage = stateChat.find((message2) => message2.id === message.reply_to);
		return (
			<div className=' bg-gray-200 rounded-xl p-2 mt-2 flex flex-col gap-1'>
				<Link
					href={`${window ? window.location.href.split("#")[0] : "https://app.peneszmentesites.hu"}#${
						replyMessage?.id
					}`}>
					{replyMessage?.type === "image" ? (
						<ImageMessage message={replyMessage} />
					) : (
						<div className='text-gray-600'>{replyMessage?.value}</div>
					)}
				</Link>
				{children}
			</div>
		);
	}
}
