import { Radio, List, ListItem, ListItemPrefix, Typography } from "@material-tailwind/react";
import { Checkbox } from "@/components/ui/checkbox";

export default function MultipleChoice({
	options,
	value,
	onChange,
	radio,
	disabled,
}: {
	options: string[];
	value: string;
	onChange: (value: string) => void;
	radio?: boolean;
	disabled?: boolean;
}) {
	return (
		<List>
			{options.map((option) => (
				<ListItem key={option} className='p-0'>
					<label htmlFor={option} className='flex w-full cursor-pointer items-center px-3 py-2'>
						<ListItemPrefix className='mr-3'>
							{radio ? (
								<Radio
									crossOrigin=''
									name={option}
									id={option}
									ripple={false}
									color='gray'
									onChange={() => onChange(option)}
									checked={value === option}
									className='hover:before:opacity-0'
									containerProps={{
										className: "p-0",
									}}
									disabled={disabled}
								/>
							) : (
								<Checkbox
									name={option}
									id={option}
									onCheckedChange={() => onChange(option)}
									checked={value ? value.includes(option) : false}
									disabled={disabled}
								/>
							)}
						</ListItemPrefix>
						<Typography color='gray' className='font-medium'>
							{option}
						</Typography>
					</label>
				</ListItem>
			))}
		</List>
	);
}
