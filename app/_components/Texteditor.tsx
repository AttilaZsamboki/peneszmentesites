import React, { useState } from "react";
import { Textarea, Button } from "@material-tailwind/react";
import { FelmeresNotes } from "../felmeresek/[id]/page";

import FileUpload from "./FileUpload";

export default function TextEditor({
	adatlapId,
	setNotes,
}: {
	adatlapId: string;
	setNotes: React.Dispatch<React.SetStateAction<FelmeresNotes[]>>;
}) {
	const [text, setText] = useState("");
	const saveNote = async () => {
		const resp = await fetch("https://pen.dataupload.xyz/felmeresek_notes", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				type: "text",
				created_at: new Date().toISOString(),
				adatlap_id: adatlapId,
				value: text,
			}),
		});
		if (resp.ok) {
			const data = await resp.json();
			setText("");
			setNotes((prev) => [...prev, data]);
		}
	};
	return (
		<div className='w-full lg:w-5/6'>
			<FileUpload route='/api/save-image' />
			<div className='w-full'>
				<Textarea
					variant='static'
					color='blue-gray'
					placeholder=''
					rows={8}
					value={text}
					onChange={(e) => setText(e.target.value)}
				/>
				<div className='flex w-full justify-end py-1.5'>
					<div className='flex gap-2'>
						<Button size='sm' color='red' variant='text' className='rounded-md'>
							Mégsem
						</Button>
						<Button size='sm' className='rounded-md' color='gray' onClick={saveNote}>
							Mentés
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}
