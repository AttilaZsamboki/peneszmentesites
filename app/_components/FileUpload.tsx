import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import { FilePond, registerPlugin } from "react-filepond";

import "filepond/dist/filepond.min.css";

registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview);

export default function FileUpload({ route }: { route: string }) {
	return (
		<FilePond
			allowMultiple={true}
			allowReplace={true}
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
