"use client";
import { Card, CardBody } from "@material-tailwind/react";
import Heading from "@/app/_components/Heading";
import MultipleChoice from "@/app/_components/MultipleChoice";
import React from "react";
import { Felmeres } from "../page";

export default function Page() {
	const [data, setData] = React.useState<Felmeres[]>([]);
	return (
		<div className='w-full'>
			<div className='flex flex-row w-ful flex-wrap lg:flex-nowrap justify-center mt-2'>
				<div className='lg:mt-6 lg:px-10 w-full'>
					<Card className='shadow-none'>
						<CardBody className='bg-white p-8 lg:rounded-lg bg-transparent bg-opacity-20 lg:border transform'>
							<Heading title='Új felmérés létrehozása' variant='h3' />
							<MultipleChoice
								options={["Helyi elszívós rendszer", "Központi ventillátoros", "Passzív rendszer"]}
								value={data.value}
								onChange={(value) => setData([...data, { ...data, value: value }])}
								radio={true}
							/>
						</CardBody>
					</Card>
				</div>
			</div>
		</div>
	);
}
