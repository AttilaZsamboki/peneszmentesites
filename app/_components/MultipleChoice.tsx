import { Radio, List, ListItem, ListItemPrefix, Typography } from "@material-tailwind/react";
import { Checkbox } from "@/components/ui/checkbox";

export default function MultipleChoice({
	options,
	value,
	onChange,
	radio,
	disabled,
	orientation,
}: {
	options: string[];
	value: string;
	onChange: (value: string) => void;
	radio?: boolean;
	disabled?: boolean;
	orientation?: "row" | "column";
}) {
	return (
		<List className={orientation === "row" ? "flex flex-row" : ""}>
			{options.map((option) => (
				<ListItem key={option} className={`p-0 ${orientation === "row" ? "lg:w-20 w-10" : ""}`}>
					<label
						htmlFor={option}
						className={`flex w-full ${
							orientation === "row" ? "flex-col" : ""
						} cursor-pointer items-center px-3 py-2`}>
						<ListItemPrefix className={orientation === "row" ? "m-3" : "mr-3"}>
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
						<Typography
							color='gray'
							className={`font-medium ${orientation === "row" ? "order-first text-center" : ""}`}>
							{option}
						</Typography>
					</label>
				</ListItem>
			))}
		</List>
	);
}
