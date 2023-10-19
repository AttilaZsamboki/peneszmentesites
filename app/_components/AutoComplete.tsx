"use client";
import React from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown, Plus, X } from "lucide-react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { cn } from "@/lib/utils";

export default function AutoComplete({
	options,
	value,
	onSelect,
	onChange,
	create = false,
	deselectable = true,
	width = "200px",
	side,
	label,
}: {
	options: { label: string; value: string }[];
	value?: string;
	onSelect?: (value: string) => void;
	onChange?: (value: string) => void;
	create?: boolean;
	deselectable?: boolean;
	width?: string;
	side?: "left" | "right" | "top" | "bottom";
	label?: string;
}) {
	const [open, setOpen] = React.useState(false);
	const [inputValue, setInputValue] = React.useState("");

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					variant='outline'
					role='combobox'
					aria-expanded={open}
					style={{ width: width }}
					className='justify-between'>
					{value ? options.find((option) => option.label === value)?.label : label ?? "Keress.."}
					<div className='flex items-center'>
						{value && deselectable && (
							<X
								className='mr-2 h-4 w-4 shrink-0 opacity-50 cursor-pointer'
								onClick={(e) => {
									e.stopPropagation();
									onSelect && onSelect("");
								}}
							/>
						)}
						<ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
					</div>
				</Button>
			</PopoverTrigger>
			<PopoverContent side={side} style={{ width: width }} className='p-0'>
				<Command
					onChange={(e) => {
						setInputValue((e.target as unknown as { value: string }).value);
					}}
					filter={(value, search) => {
						return search
							.toLowerCase()
							.split(" ")
							.map((search) =>
								options
									.find((option) => option.value.toLowerCase() === value)
									?.label.toLowerCase()
									.includes(search)
							)
							.every((value) => value)
							? 1
							: 0;
					}}>
					<CommandInput
						onValueChange={(value) => (onChange ? onChange(value) : null)}
						placeholder='Keress valamit...'
					/>
					<CommandEmpty>
						{create && inputValue ? (
							<div className='flex flex-row justify-between items-center px-4'>
								<div>Létrehozás &ldquo;{inputValue}&rdquo;</div>
								<Button
									onClick={() => {
										onSelect ? onSelect(inputValue) : null;
										setOpen(false);
									}}
									size='icon'
									variant='outline'>
									<Plus className='h-4 w-4' />
								</Button>
							</div>
						) : (
							"Nincs találat"
						)}
					</CommandEmpty>
					<CommandGroup className='h-60 overflow-y-scroll'>
						{options.map((option) => (
							<CommandItem
								key={option.value}
								value={option.value}
								onSelect={() => {
									onSelect ? onSelect(option.value) : null;
									setOpen(false);
								}}>
								{value ? (
									<Check
										className={cn(
											"mr-2 h-4 w-4",
											value === option.label ? "opacity-100" : "opacity-0"
										)}
									/>
								) : (
									<div className='mr-2'></div>
								)}
								{option.label}
							</CommandItem>
						))}
					</CommandGroup>
				</Command>
			</PopoverContent>
		</Popover>
	);
}
