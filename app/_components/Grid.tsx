"use client";
import React from "react";
import { Radio, Checkbox } from "@material-tailwind/react";

export const Grid = ({
	columns,
	rows,
	value,
	radio,
}: {
	columns: string[];
	rows: string[];
	value: string[];
	radio: boolean;
}) => {
	return (
		<div className='relative overflow-x-auto sm:rounded-lg'>
			<table className='w-full text-sm text-left text-gray-500 dark:text-gray-400'>
				<thead className='text-xs text-gray-700 uppercase  dark:bg-gray-700 dark:text-gray-400'>
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
								className='px-6 bg-gray-50 z-50 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white'>
								{row}
							</td>
							{columns.map((column) => (
								<td className='w-4 p-4' key={column}>
									<div className='flex items-center'>
										{radio ? (
											<Checkbox
												name={`${row}-${column}`}
												color='blue-gray'
												checked={value[index] ? value[index].includes(column) : false}
												crossOrigin='anonymous'
											/>
										) : (
											<Radio
												name={`${row}-${column}`}
												color='blue-gray'
												checked={value[index] ? value[index].includes(column) : false}
												crossOrigin='anonymous'
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
	);
};
