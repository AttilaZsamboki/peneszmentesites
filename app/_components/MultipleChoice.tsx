import { Radio, List, ListItem, ListItemPrefix, Typography, Checkbox } from "@material-tailwind/react";

export default function MultipleChoice({
	options,
	value,
	onChange,
	radio,
	disabled,
}: {
	options: any[];
	value: string;
	onChange: (value: string) => void;
	radio?: boolean;
	disabled?: boolean;
}) {
	return (
		<List>
			{options.map((option) => (
				<ListItem className='p-0'>
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
									crossOrigin=''
									name={option}
									id={option}
									ripple={false}
									color='gray'
									onChange={() => onChange(option)}
									checked={value.includes(option)}
									className='hover:before:opacity-0'
									containerProps={{
										className: "p-0",
									}}
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
