export default function Heading({ title }: { title: string }) {
	return (
		<div className='flex flex-col items-start justify-between w-11/12 p-2 mt-10 mb-5 text-left'>
			<div className='text-3xl font-extrabold tracking-tight text-slate-900'>{title}</div>
		</div>
	);
}
