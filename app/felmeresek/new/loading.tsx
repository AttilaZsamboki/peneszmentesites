"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { QuestionTemplate } from "./_clientPage";
import Skeleton from "react-loading-skeleton";
import LoadingDots from "@/app/_components/LoadingDots";

export default function Loading() {
	return (
		<div className='w-full'>
			<div className='flex flex-row w-full flex-wrap lg:flex-nowrap justify-center mt-2'>
				<div className='lg:mt-6 lg:px-10 lg:w-1/4'>
					<Card>
						<CardHeader className='mt-5 lg:mt-0'>
							<CardTitle>Alapadatok</CardTitle>
						</CardHeader>
						<CardContent className='lg:p-8 p-0 transform'>
							<QuestionTemplate title='Adatlap'>
								<Skeleton height={40} />
							</QuestionTemplate>

							<div className='flex flex-row justify-end gap-3 border-t py-4'>
								<Button disabled>
									<LoadingDots />
								</Button>
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}
