import { FilePond, registerPlugin } from "react-filepond";
import React from "react";
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview);

export default function FileUpload({ onUpload }: { onUpload?: (file: any) => void }) {
	return (
		<FilePond
			allowMultiple={true}
			allowReplace={true}
			onaddfile={(err, file) => {
				if (err) {
					console.error(err);
				}
				onUpload ? onUpload(file) : {};
			}}
			server={{
				url: "https://pen.dataupload.xyz/save-image/",
				headers: {
					Authorization: "Bearer your_token", // if you have any headers
				},
			}}
			allowReorder={true}
			allowProcess={true}
			allowBrowse={true}
			instantUpload={true}
			allowRevert={true}
			name='files'
			labelIdle='Tölts fel egy képet!'
		/>
	);
}
