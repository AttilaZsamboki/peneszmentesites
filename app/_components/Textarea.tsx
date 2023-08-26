import { Textarea as BaseTextarea } from "@material-tailwind/react";

export default function Textarea({ onChange, value }: { onChange: (e: string) => void; value: string }) {
	return (
		<BaseTextarea
			labelProps={{
				className: "hidden",
			}}
			className='!border !border-gray-300 bg-white text-gray-900 shadow-lg shadow-gray-900/5 ring-4 ring-transparent placeholder:text-gray-500'
			value={value}
			onChange={(e) => onChange(e.target.value)}
		/>
	);
}
