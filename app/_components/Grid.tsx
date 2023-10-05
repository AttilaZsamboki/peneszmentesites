"use client";
import React from "react";
import { Radio } from "@material-tailwind/react";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export const Grid = ({
	columns,
	rows,
	value,
	radio,
	disabled,
	onChange,
}: {
	columns: string[];
	rows: string[];
	value: { column: string; row: number }[] | "";
	radio: boolean;
	disabled: boolean;
	onChange?: (value: { column: string; row: number }) => void;
}) => {
	return (
		<div className='relative sm:rounded-lg w-full'>
			<div className='overflow-x-auto w-full'>
				<Table
					className={disabled ? "text-sm w-full text-left text-gray-500 dark:text-gray-400" : ""}
					style={{ tableLayout: "fixed" }}>
					<TableHeader>
						<TableRow>
							<TableHead className='lg:w-auto w-[70px]'></TableHead>
							{columns.map((column) => (
								<TableHead scope='col' className='lg:w-auto w-[70px]' key={column}>
									{column}
								</TableHead>
							))}
						</TableRow>
					</TableHeader>
					<TableBody className='w-full'>
						{rows.map((row, index) => (
							<TableRow key={row}>
								<TableCell className='font-medium text-left'>{row}</TableCell>
								{columns.map((column) => (
									<TableCell key={column}>
										<div className='flex items-center'>
											{!radio ? (
												<Checkbox
													name={`${row}-${column}`}
													checked={
														value
															? value
																	.map((v) => v.column === column && v.row === index)
																	.includes(true)
															: false
													}
													disabled={disabled}
													onClick={() => {
														onChange && onChange({ column: column, row: index });
													}}
												/>
											) : (
												<Radio
													name={`${row}-${column}`}
													color='gray'
													checked={
														value
															? value
																	.map((v) => v.column === column && v.row === index)
																	.includes(true)
															: false
													}
													crossOrigin='anonymous'
													disabled={disabled}
													onClick={() => {
														onChange && onChange({ column: column, row: index });
													}}
												/>
											)}
										</div>
									</TableCell>
								))}
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>
		</div>
	);
};
