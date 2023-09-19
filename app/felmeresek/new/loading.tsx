"use client";

import Heading from "@/app/_components/Heading";
import { Button, Card, CardBody } from "@material-tailwind/react";
import { QuestionTemplate } from "./_clientPage";
import Skeleton from "react-loading-skeleton";
import LoadingDots from "@/app/_components/LoadingDots";

export default function Loading() {
	return (
		<div className='w-full'>
			<div className='flex flex-row w-full flex-wrap lg:flex-nowrap justify-center mt-2'>
				<div className='lg:mt-6 lg:px-10 lg:w-3/4'>
					<Card className='shadow-none'>
						<CardBody className='bg-white lg:p-8 p-0 lg:rounded-md bg-transparent bg-opacity-20 lg:border transform'>
							<div className='mt-5 lg:mt-0'>
								<Heading title='Alapadatok' marginY='sm:mb-2 lg:mb-12 lg:mt-8' variant='h3' />
							</div>
							<QuestionTemplate title='Adatlap'>
								<Skeleton height={40} />
							</QuestionTemplate>

							<div className='flex flex-row justify-end gap-3 border-t py-4'>
								<Button disabled>
									<LoadingDots />
								</Button>
							</div>
						</CardBody>
					</Card>
				</div>
			</div>
		</div>
	);
}
