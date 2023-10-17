"use client";

import { Separator } from "@/components/ui/separator";
import Skeleton from "react-loading-skeleton";

export default function Loading() {
	return (
		<div className='flex flex-row w-full flex-wrap lg:flex-nowrap justify-center mt-2'>
			<div className='lg:mt-6 w-11/12 lg:px-10 lg:w-1/4'>
				<div className='rounded-lg border bg-card text-card-foreground shadow-sm'>
					<div className='flex flex-col space-y-1.5 p-6'>
						<h3 className='text-2xl font-semibold leading-none tracking-tight'>Alapadatok</h3>
					</div>
					<Separator className='mb-4' />
					<div className='p-8 transform'>
						<div className='flex flex-col items-center gap-5'>
							<div className='space-y-2'>
								<div className='text-base flex flex-row font-medium leading-6 text-gray-900'>
									<label className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'>
										Adatlap
									</label>
								</div>
								<div className='flex justify-end w-full items-center'>
									<div className='w-full'>
										<div className='relative w-full'>
											<div className='rounded-md'>
												<Skeleton height={36} width={224} />
											</div>
										</div>
									</div>
								</div>
								<p id=':r2o:-form-item-description' className='text-[0.8rem] text-muted-foreground'></p>
							</div>
						</div>
						<div className='flex flex-row justify-end gap-3 py-4'>
							<button
								className='inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2'
								disabled={true}>
								Következő
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
