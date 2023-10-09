import { Radio, List, ListItem, ListItemPrefix } from "@material-tailwind/react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

export default function MultipleChoice({
	options,
	value,
	onChange,
	radio,
	disabled,
	orientation,
	name,
}: {
	options: string[];
	value: string;
	onChange: (value: string) => void;
	radio?: boolean;
	disabled?: boolean;
	orientation?: "row" | "column";
	name?: string;
}) {
	return (
		<List className={orientation === "row" ? "flex flex-row" : ""}>
			{options.map((option) => (
				<ListItem key={"666"} className={`p-0 ${orientation === "row" ? "lg:w-20 w-10" : ""}`}>
					<label
						htmlFor={option + name}
						className={`flex w-full ${
							orientation === "row" ? "flex-col" : ""
						} cursor-pointer items-center px-3 py-2`}>
						<ListItemPrefix className={orientation === "row" ? "m-3" : "mr-3"}>
							{radio ? (
								<Radio
									crossOrigin=''
									name={option + name}
									id={option + name}
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
									id={option + name}
									onCheckedChange={() => onChange(option)}
									checked={value ? value.includes(option) : false}
									disabled={disabled}
								/>
							)}
						</ListItemPrefix>
						<Label
							htmlFor={option + name}
							className={`font-medium ${orientation === "row" ? "order-first text-center" : ""}`}>
							{option}
						</Label>
					</label>
				</ListItem>
			))}
		</List>
	);
}
