import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import { FilePond, registerPlugin } from "react-filepond";
import React from "react";

import "filepond/dist/filepond.min.css";

registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview);

export default function FileUpload({ route, onUpload }: { route: string; onUpload?: (file: any) => void }) {
	return (
		<FilePond
			allowMultiple={true}
			allowReplace={true}
			onaddfile={(err, file) => {
				onUpload ? onUpload(file) : {};
			}}
			server={route}
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
