import React from "react";
import {
	Pagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";

export function DefaultPagination({
	numPages,
	onPageChange,
}: {
	numPages: number;
	onPageChange: (page: number) => void;
}) {
	const [active, setActive] = React.useState(1);

	const next = () => {
		if (active === numPages) return;

		setActive(active + 1);
	};

	const prev = () => {
		if (active === 1) return;

		setActive(active - 1);
	};

	React.useEffect(() => {
		onPageChange(active);
	}, [active]);

	return (
		<div className='flex items-center gap-4 bg-white border-t bottom-0 fixed z-40 w-full py-2 justify-between lg:justify-center px-4'>
			<Pagination>
				<PaginationContent>
					<PaginationItem>
						<PaginationPrevious
							className={cn(active === 1 ? "opacity-40 bg-gray-200" : "cursor-pointer")}
							onClick={prev}
						/>
					</PaginationItem>
					{active > 2 ? (
						<>
							<PaginationItem>
								<PaginationLink className='cursor-pointer' onClick={() => setActive(1)}>
									1
								</PaginationLink>
							</PaginationItem>
							<PaginationItem>
								<PaginationEllipsis />
							</PaginationItem>
						</>
					) : null}
					{active !== 1 ? (
						<PaginationItem>
							<PaginationLink onClick={() => setActive((prev) => prev - 1)}>{active - 1}</PaginationLink>
						</PaginationItem>
					) : null}
					<PaginationItem>
						<PaginationLink isActive>{active}</PaginationLink>
					</PaginationItem>
					{active != numPages ? (
						<PaginationItem>
							<PaginationLink onClick={() => setActive((prev) => prev + 1)}>{active + 1}</PaginationLink>
						</PaginationItem>
					) : null}
					{active < numPages - 1 ? (
						<>
							<PaginationItem>
								<PaginationEllipsis />
							</PaginationItem>
							<PaginationItem>
								<PaginationLink className='cursor-pointer' onClick={() => setActive(numPages)}>
									{numPages}
								</PaginationLink>
							</PaginationItem>
						</>
					) : null}
					<PaginationItem>
						<PaginationNext
							className={cn(active === numPages ? "opacity-40 bg-gray-200" : "cursor-pointer")}
							onClick={next}
						/>
					</PaginationItem>
				</PaginationContent>
			</Pagination>
		</div>
	);
}
