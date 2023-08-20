import React, { useState } from "react";
import { Textarea, Button } from "@material-tailwind/react";
import { FelmeresNotes } from "../[id]/page";

// Import React FilePond
import { FilePond, registerPlugin } from "react-filepond";

// Import FilePond styles
import "filepond/dist/filepond.min.css";

// Import the Image EXIF Orientation and Image Preview plugins
// Note: These need to be installed separately
// `npm i filepond-plugin-image-preview filepond-plugin-image-exif-orientation --save`
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";

// Register the plugins
registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview);

// Our app
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
		<div>
			<div className='App'>
				<FilePond
					allowMultiple={true}
					allowReplace={true}
					server='/api/save-image'
					allowReorder={true}
					allowProcess={true}
					allowBrowse={true}
					instantUpload={true}
					allowRevert={true}
					name='files'
					labelIdle='Tölts fel egy képet!'
				/>
			</div>
			<div className='relative w-full'>
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
						<Button size='sm' className='rounded-md' onClick={saveNote}>
							Mentés
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}
