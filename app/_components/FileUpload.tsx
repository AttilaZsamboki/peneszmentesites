import { FilePond, registerPlugin } from "react-filepond";
import React from "react";
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import { FilePondErrorDescription, FilePondFile } from "filepond";
registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview);

export default function FileUpload({
	onUpload,
	onUploadSuccess,
	felmeresId = "",
}: {
	onUpload?: (file: any) => void;
	onUploadSuccess?: (error: FilePondErrorDescription | null, file: FilePondFile) => void;
	felmeresId?: string;
}) {
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
				url: "https://pen.dataupload.xyz/save-image/?felmeres_id=" + felmeresId,
			}}
			onprocessfile={(error, file) => (onUploadSuccess ? onUploadSuccess(error, file) : {})}
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
