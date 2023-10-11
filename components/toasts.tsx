import { CornerUpLeft } from "lucide-react";
import Link from "next/link";

export const OpenCreatedToast = ({
	path,
	query,
	inNewTab,
}: {
	path: string;
	query?: { [key: string]: string };
	inNewTab?: boolean;
}) => {
	if (inNewTab) {
		return (
			<a
				target='_blank'
				href={
					path +
					"?" +
					Object.entries(query ?? {})
						.map(([key, value]) => `${key}=${value}`)
						.join("&")
				}>
				<Body />
			</a>
		);
	}
	return (
		<Link href={{ pathname: path, query: query }}>
			<Body />
		</Link>
	);
	function Body() {
		return (
			<div className='flex flex-row gap-2 items-center justify-start cursor-pointer pt-2'>
				<CornerUpLeft className='w-4 h-4 text-gray-800' />
				<div className='font-bold text-xs text-gray-700'>Megnyitás</div>
			</div>
		);
	}
};
