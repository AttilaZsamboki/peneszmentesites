import { CalendarIcon } from "lucide-react";
import {
	format,
	addWeeks,
	subWeeks,
	startOfWeek,
	endOfWeek,
	startOfDay,
	endOfDay,
	startOfMonth,
	endOfMonth,
} from "date-fns";
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
	const handlePresetClick = (preset: string) => {
		let fromDate: Date;
		let toDate: Date;

		switch (preset) {
			case "today":
				fromDate = startOfDay(new Date());
				toDate = endOfDay(new Date());
				break;
			case "thisWeek":
				fromDate = startOfWeek(new Date());
				toDate = endOfWeek(new Date());
				break;
			case "nextWeek":
				fromDate = startOfWeek(addWeeks(new Date(), 1));
				toDate = endOfWeek(addWeeks(new Date(), 1));
				break;
			case "lastWeek":
				fromDate = startOfWeek(subWeeks(new Date(), 1));
				toDate = endOfWeek(subWeeks(new Date(), 1));
				break;
			case "thisMonth":
				fromDate = startOfMonth(new Date());
				toDate = endOfMonth(new Date());
				break;
			default:
				return;
		}

		if (onChange) {
			onChange({ from: fromDate, to: toDate });
		}
	};

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
					<div className='flex flex-wrap items-center flex-row justify-between px-2 pt-2 gap-2'>
						<Button variant={"ghost"} onClick={() => handlePresetClick("today")}>
							Ma
						</Button>
						<Button variant={"ghost"} onClick={() => handlePresetClick("thisWeek")}>
							Ez a hét
						</Button>
						<Button variant={"ghost"} onClick={() => handlePresetClick("nextWeek")}>
							Jövő hét
						</Button>
						<Button variant={"ghost"} onClick={() => handlePresetClick("lastWeek")}>
							Ezelőtti hét
						</Button>
						<Button variant={"ghost"} onClick={() => handlePresetClick("thisMonth")}>
							Ez a hónap
						</Button>
					</div>
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
