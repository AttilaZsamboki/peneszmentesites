export default function LoadingDots() {
	return (
		<div className='flex space-x-2 animate-pulse'>
			<div className='w-3 h-3 bg-white rounded-full'></div>
			<div className='w-3 h-3 bg-white rounded-full'></div>
			<div className='w-3 h-3 bg-white rounded-full'></div>
		</div>
	);
}
