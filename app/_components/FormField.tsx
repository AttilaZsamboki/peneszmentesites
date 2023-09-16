export default function FormField({ title, children }: { title: string; children: React.ReactNode }) {
	return (
		<div>
			<div className='text-sm mb-1'>{title}</div>
			{children}
		</div>
	);
}
