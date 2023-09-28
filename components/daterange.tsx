import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { DateRange } from "@/app/_components/StackedList";

export default function DateRangePicker({
	value,
	className = "",
	onChange,
	numberOfMonths = 2,
}: {
	value?: DateRange;
	className?: string;
	onChange?: (value: { from: Date; to: Date }) => void;
	numberOfMonths?: number;
}) {
	return (
		<div className={`grid gap-2 ${className}`}>
			<Popover>
				<PopoverTrigger asChild>
					<Button
						id='date'
						variant={"outline"}
						className={`
								w-full justify-start text-left font-normal
								${!value && "text-muted-foreground"}
							`}>
						<CalendarIcon className='mr-2 h-4 w-4' />
						{value?.from ? (
							value.to ? (
								<>
									{format(value.from, "LLL dd, y")} - {format(value.to, "LLL dd, y")}
								</>
							) : (
								format(value.from, "LLL dd, y")
							)
						) : (
							<span>Válaszz egy dátumot</span>
						)}
					</Button>
				</PopoverTrigger>
				<PopoverContent className='w-auto p-0 mr-2' align='start'>
					<Calendar
						initialFocus
						mode='range'
						defaultMonth={value?.from}
						selected={value}
						onSelect={(value) => (onChange ? onChange(value as { from: Date; to: Date }) : () => {})}
						numberOfMonths={numberOfMonths}
					/>
				</PopoverContent>
			</Popover>
		</div>
	);
}
