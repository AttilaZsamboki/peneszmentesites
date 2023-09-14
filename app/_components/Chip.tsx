import { Chip as MaterialChip } from "@material-tailwind/react";
import { color } from "@material-tailwind/react/types/components/alert";

export default function Chip({ value, color }: { value: string; color: string }) {
	return (
		<MaterialChip
			className='relative bg-clip-border rounded-md overflow-hidden bg-gradient-to-tr text-white shadow-none py-2 text-center'
			value={value}
			size='lg'
			color={color as color}
		/>
	);
}
