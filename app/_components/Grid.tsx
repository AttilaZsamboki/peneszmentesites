"use client";
import React from "react";
import { Radio, Checkbox } from "@material-tailwind/react";

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
	value: string[];
	radio: boolean;
	disabled: boolean;
	onChange?: (value: { column: string; row: number }) => void;
}) => {
	return (
		<div className='relative sm:rounded-lg w-full'>
			<div className='overflow-x-auto'>
				<table
					className='text-sm w-full text-left text-gray-500 dark:text-gray-400'
					style={{ tableLayout: "fixed" }}>
					<colgroup>
						<col style={{ minWidth: "200px" }} />
						{columns.map((column) => (
							<col key={column} />
						))}
					</colgroup>
					<thead className='text-xs text-gray-700 uppercase dark:bg-gray-700 dark:text-gray-400'>
						<tr>
							<th className=''></th>
							{columns.map((column) => (
								<th scope='col' className='px-6 py-3' key={column}>
									{column}
								</th>
							))}
						</tr>
					</thead>
					<tbody>
						{rows.map((row, index) => (
							<tr
								className='bg-gray-50 border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600'
								key={row}>
								<td
									scope='row'
									className='px-6 bg-gray-50 z-50 py-4 font-medium text-gray-900 dark:text-white break-text'>
									{row}
								</td>
								{columns.map((column) => (
									<td className='w-4 p-4' key={column}>
										<div className='flex items-center'>
											{!radio ? (
												<Checkbox
													name={`${row}-${column}`}
													color='gray'
													checked={value[index] ? value[index].includes(column) : false}
													crossOrigin='anonymous'
													disabled={disabled}
													onClick={() => {
														onChange && onChange({ column: column, row: index });
													}}
												/>
											) : (
												<Radio
													name={`${row}-${column}`}
													color='gray'
													checked={value[index] ? value[index].includes(column) : false}
													crossOrigin='anonymous'
													disabled={disabled}
													onClick={() => {
														onChange && onChange({ column: column, row: index });
													}}
												/>
											)}
										</div>
									</td>
								))}
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
};
