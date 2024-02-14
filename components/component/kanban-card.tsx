"use client";
import { hufFormatter } from "@/app/[id]/_clientPage";
import { AdatlapData } from "@/app/_utils/types";
import { Button } from "@/components/ui/button";
import { AtSign, Calendar, HardHat, Home, Phone, QrCode, Ruler } from "lucide-react";
import { Separator } from "../ui/separator";
import { Badge } from "../ui/badge";

export default function KanbanCard({ data }: { data: AdatlapData }) {
	return (
		<div className='flex w-full overflow-hidden bg-white rounded-md border-gray-200 border'>
			<div className='flex flex-col flex-shrink-0 w-full p-4 space-y-4'>
				<div className='flex items-center justify-between'>
					<div>
						<h2 className='text-lg font-semibold w-40 truncate'>{data.Name}</h2>
						<Badge className='text-xs'>Készpénz</Badge>
					</div>
					<span className='px-3 py-1 text-sm font-semibold text-white bg-green-600 rounded-md'>
						{hufFormatter.format(data.NetTotal)}
					</span>
				</div>
				<Separator className='opacity-40' />
				<div className='space-y-2'>
					<div className='text-sm flex flex-row items-start'>
						<Home className='w-4 h-4' />:{" "}
						<div>
							{data.FelmeresCim} <b>({data.Tavolsag} km)</b>
						</div>
					</div>
					<div className='text-sm flex flex-row items-center'>
						<Phone className='w-4 h-4' />: {data.Phone}
					</div>
					<div className='text-sm flex flex-row items-center'>
						<AtSign className='w-4 h-4' />: {data.Email}
					</div>
					<div className='text-sm flex flex-row items-center'>
						<QrCode className='w-4 h-4' />: {data.RendelesSzama}
					</div>
					<Separator className='opacity-40' />
					<div className='flex flex-col gap-1'>
						<div className='text-xs flex flex-row items-center'>
							<HardHat className='w-4 h-4' />: {data.RendelesSzama}
						</div>
						<div className='text-xs flex flex-row items-center'>
							<Calendar className='w-4 h-4' />: {data.RendelesSzama}
						</div>
					</div>
					<Separator className='opacity-40' />
					<div className='flex flex-col gap-1'>
						<div className='text-xs flex flex-row items-center'>
							<Ruler className='w-4 h-4' />: {data.RendelesSzama}
						</div>
						<div className='text-xs flex flex-row items-center'>
							<Calendar className='w-4 h-4' />: {data.RendelesSzama}
						</div>
					</div>
				</div>
				<div className='flex flex-row w-full items-center justify-between gap-2'>
					<Button
						variant={"outline"}
						className='border-blue-600 hover:border-blue-700 text-blue-600 hover:text-blue-700'>
						Készpénz
					</Button>
					<Button
						variant={"outline"}
						className='border-green-600 hover:border-green-700 text-green-600 hover:text-green-700'>
						Új felmérés
					</Button>
					<Button
						variant={"outline"}
						className='border-orange-600 hover:border-orange-700 text-orange-600 hover:text-orange-700'>
						Beépítés
					</Button>
				</div>
			</div>
		</div>
	);
}
