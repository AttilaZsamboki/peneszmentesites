import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRightIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";
import useBreakpointValue from "./useBreakpoint";

export function DefaultPagination({
	numPages,
	onPageChange,
}: {
	numPages: number;
	onPageChange: (page: number) => void;
}) {
	const [active, setActive] = React.useState(1);
	const deviceSize = useBreakpointValue();

	const getItemProps = (index: number) =>
		({
			color: active === index ? "gray" : "blue",
			onClick: () => setActive(index),
			variant: active === index ? "default" : "solid",
		} as any);

	const next = () => {
		if (active === numPages) return;

		setActive(active + 1);
	};

	const prev = () => {
		if (active === 1) return;

		setActive(active - 1);
	};

	const [start, setStart] = React.useState(1);
	const [end, setEnd] = React.useState(Math.min(numPages, 10));

	React.useEffect(() => {
		if (active <= 5) {
			setStart(1);
			setEnd(Math.min(numPages, 10));
		} else if (active >= numPages - 4) {
			setStart(Math.max(1, numPages - 9));
			setEnd(numPages);
		} else {
			setStart(active - 4);
			setEnd(active + 5);
		}
	}, [active, numPages]);

	React.useEffect(() => {
		onPageChange(active);
	}, [active]);

	return (
		<div className='flex items-center gap-4'>
			<Button className='flex items-center gap-2' onClick={prev} disabled={active === 1}>
				<ArrowLeftIcon strokeWidth={2} className='h-4 w-4' /> {deviceSize === "sm" ? null : "Előző"}
			</Button>
			<div className='flex items-center gap-2'>
				{start > 1 && (
					<>
						<Button {...getItemProps(1)}>1</Button>
						{start > 2 && <span className='text-gray-500'>...</span>}
					</>
				)}
				{deviceSize === "sm" ? (
					<Button {...getItemProps(active)}>{active}</Button>
				) : (
					Array.from({ length: end - start + 1 }, (_, index) => (
						<Button key={index} {...getItemProps(start + index)}>
							{start + index}
						</Button>
					))
				)}
				{end < numPages && (
					<>
						{end < numPages - 1 && <span className='text-gray-500'>...</span>}
						<Button {...getItemProps(numPages)}>{numPages}</Button>
					</>
				)}
			</div>
			<Button className='flex items-center gap-2' onClick={next} disabled={active === end}>
				{deviceSize === "sm" ? null : "Következő"} <ArrowRightIcon strokeWidth={2} className='h-4 w-4' />
			</Button>
		</div>
	);
}
