/**
 * v0 by Vercel.
 * @see https://v0.dev/t/Yi3tjsSh2Ah
 */
import { Button } from "@/components/ui/button";

export default function Component() {
	return (
		<div className='flex justify-center items-center h-screen bg-gray-100'>
			<div className='bg-white rounded-lg shadow-lg p-6 flex'>
				<div className='flex flex-col mr-10'>
					<div className='text-lg font-semibold mb-4'>Felmerés</div>
					<div className='grid grid-cols-4 gap-4 mb-4'>
						<Button className='bg-gray-200'>11</Button>
						<Button className='bg-gray-200'>12</Button>
						<Button className='bg-gray-200'>13</Button>
						<Button className='bg-gray-200'>14</Button>
						<Button className='bg-gray-300'>15</Button>
						<Button className='bg-gray-200'>16</Button>
						<Button className='bg-gray-300'>17</Button>
						<Button className='bg-gray-200'>18</Button>
						<Button className='bg-[#4ade80] text-white font-bold'>19</Button>
						<Button className='bg-gray-300'>20</Button>
						<Button className='bg-gray-200'>21</Button>
						<Button className='bg-gray-200'>22</Button>
					</div>
					<div className='text-sm'>
						<p>Telefonos segítség</p>
						<p>+ 36 20 405 3013</p>
					</div>
				</div>
				<div className='flex flex-col'>
					<div className='flex justify-between items-center mb-4'>
						<ArrowLeftIcon className='w-4 h-4' />
						<div className='text-lg font-semibold'>Nov</div>
						<ArrowRightIcon className='w-4 h-4' />
					</div>
					<div className='flex flex-col space-y-2 mb-4'>
						<Button className='bg-gray-200'>10:00 - 11:00</Button>
						<Button className='bg-gray-200'>11:00 - 12:00</Button>
						<Button className='bg-gray-200'>15:00 - 16:00</Button>
						<Button className='bg-gray-200'>16:00 - 17:00</Button>
					</div>
					<Button className='bg-[#22c55e] text-white'>Foglalás</Button>
				</div>
			</div>
		</div>
	);
}

function ArrowLeftIcon(props) {
	return (
		<svg
			{...props}
			xmlns='http://www.w3.org/2000/svg'
			width='24'
			height='24'
			viewBox='0 0 24 24'
			fill='none'
			stroke='currentColor'
			strokeWidth='2'
			strokeLinecap='round'
			strokeLinejoin='round'>
			<path d='m12 19-7-7 7-7' />
			<path d='M19 12H5' />
		</svg>
	);
}

function ArrowRightIcon(props) {
	return (
		<svg
			{...props}
			xmlns='http://www.w3.org/2000/svg'
			width='24'
			height='24'
			viewBox='0 0 24 24'
			fill='none'
			stroke='currentColor'
			strokeWidth='2'
			strokeLinecap='round'
			strokeLinejoin='round'>
			<path d='M5 12h14' />
			<path d='m12 5 7 7-7 7' />
		</svg>
	);
}
