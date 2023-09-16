import { Textarea as BaseTextarea } from "@material-tailwind/react";

export default function Textarea({ onChange, value }: { onChange: (e: string) => void; value: string }) {
	return (
		<BaseTextarea
			labelProps={{
				className: "hidden",
			}}
			className='input-field'
			value={value}
			onChange={(e) => onChange(e.target.value)}
		/>
	);
}
