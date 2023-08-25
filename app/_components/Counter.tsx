export default function Counter({
	value,
	onChange,
	min,
	max,
	step,
	label,
}: {
	value: number;
	onChange: (value: number) => void;
	min?: number;
	max?: number;
	step?: number;
	label?: string;
}) {
	return (
		<div className='custom-number-input h-10 w-full flex flex-row justify-between items-center'>
			<label htmlFor='custom-input-number' className='w-full text-gray-700 text-sm font-semibold'>
				{label ? label : ""}
			</label>
			<div className='flex flex-row h-10 w-full rounded-lg relative bg-transparent mt-1'>
				<button
					onClick={() => onChange(value === 0 ? 0 : value - (step ? step : 1))}
					data-action='decrement'
					className=' bg-gray-300 text-gray-600 hover:text-gray-700 hover:bg-gray-400 h-full w-20 rounded-l cursor-pointer outline-none'>
					<span className='m-auto text-2xl font-thin'>−</span>
				</button>
				<input
					onChange={(e) => onChange(parseInt(e.target.value))}
					type='number'
					className='focus:outline-none text-center w-full bg-gray-300 font-semibold text-md hover:text-black focus:text-black  md:text-basecursor-default flex items-center text-gray-700  outline-none'
					name='custom-input-number'
					value={value}
				/>
				<button
					onClick={() => onChange(value + (step ? step : 1))}
					data-action='increment'
					className='bg-gray-300 text-gray-600 hover:text-gray-700 hover:bg-gray-400 h-full w-20 rounded-r cursor-pointer'>
					<span className='m-auto text-2xl font-thin'>+</span>
				</button>
			</div>
		</div>
	);
}
