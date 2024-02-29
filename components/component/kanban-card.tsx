"use client";
import { hufFormatter } from "@/app/[id]/_clientPage";
import { AdatlapData } from "@/app/_utils/types";
import { Button } from "@/components/ui/button";
import { Calendar, HardHat, Home, QrCode, Ruler } from "lucide-react";
import { Separator } from "../ui/separator";
import { Badge } from "../ui/badge";
import { Badge as BadgeMaterial } from "@material-tailwind/react";
import { concatAddress } from "@/app/_utils/MiniCRM";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { AdatlapDialog } from "@/app/adatlapok/Page.1";
import React from "react";

export function ButtonBar({ adatlap, btnClassName }: { adatlap: AdatlapData; btnClassName?: string }) {
	if (adatlap.Statusz === "Lezárva" || adatlap.Statusz === "Elutasítva") return;
	return (
		<div className='flex flex-row w-full items-center justify-between gap-2'>
			<NavButton />
			<FelmeresButton />
			{adatlap.DateTime1953 ? (
				<RendelesButton />
			) : (
				<TooltipProvider>
					<Tooltip>
						<TooltipTrigger>
							<RendelesButton />
						</TooltipTrigger>
						<TooltipContent>Nincs még leszervezve</TooltipContent>
					</Tooltip>
				</TooltipProvider>
			)}
		</div>
	);

	function RendelesButton() {
		if (adatlap.Statusz !== "Beépítésre vár") return;
		return (
			<Button
				variant={"outline"}
				disabled={!adatlap.DateTime1953}
				className={cn(
					"border-orange-600 hover:border-orange-700 text-orange-600 hover:text-orange-700",
					btnClassName
				)}>
				Beépítés
			</Button>
		);
	}

	function FelmeresButton() {
		if (adatlap.Statusz !== "Ajánlat kiküldve" && adatlap.Statusz !== "Felmérésre vár") {
			return (
				<BadgeMaterial content={adatlap.FelmeresekSzama}>
					<Link
						href={
							(adatlap.FelmeresekSzama ?? 0) === 1 && adatlap.FelmeresLink
								? adatlap.FelmeresLink
								: "/?filter=" + adatlap.Id
						}>
						<Button
							variant={"outline"}
							className={cn(
								"border-green-600 hover:border-green-700 text-green-600 hover:text-green-700",
								btnClassName
							)}>
							Felmerések
						</Button>
					</Link>
				</BadgeMaterial>
			);
		} else {
			return (
				<Link href={"/new?adatlap_id=" + adatlap.Id + "&page=1"}>
					<Button
						variant={"outline"}
						className={cn(
							"border-green-600 hover:border-green-700 text-green-600 hover:text-green-700",
							btnClassName
						)}>
						Új felmérés
					</Button>
				</Link>
			);
		}
	}

	function NavButton() {
		if (adatlap.Statusz === "Ajánlat kiküldve" || adatlap.Statusz === "Elszámolásra vár") return;
		return (
			<Button
				variant={"outline"}
				onClick={() => {
					window.open(
						`https://www.google.com/maps/dir/${encodeURIComponent(
							"Budapest, Nagytétényi út 218-220, 1225"
						)}/${encodeURIComponent(concatAddress(adatlap))}`
					);
				}}
				className={cn("border-blue-600 hover:border-blue-700 text-blue-600 hover:text-blue-700", btnClassName)}>
				Navigáció
			</Button>
		);
	}
}

export default function KanbanCard({ adatlap }: { adatlap: AdatlapData }) {
	const [open, setOpen] = React.useState(false);
	return (
		<>
			<div className='flex w-full overflow-hidden bg-white rounded-md border-gray-200 border cursor-pointer' onClick={() => setOpen(true)}>
				<div className='flex flex-col flex-shrink-0 w-full p-4 space-y-4'>
					<div className='flex items-center justify-between'>
						<div>
							<h2 className={cn("text-lg font-semibold", adatlap.Total ? "w-40 truncate" : "")}>
								{adatlap.Name}
							</h2>
							<Badge className='text-xs'>{adatlap.FizetesiMod2}</Badge>
						</div>
						{adatlap.Total ? (
							<span className='px-3 py-1 text-sm font-semibold text-white bg-green-600 rounded-md'>
								{hufFormatter.format(adatlap.Total)}
							</span>
						) : null}
					</div>
					<Separator className='opacity-40' />
					<div className='space-y-2'>
						<div className='text-sm flex flex-row items-start'>
							<Home className='w-4 h-4' />:{"  "}
							<div className='pl-1'>
								{concatAddress(adatlap)} <b>({adatlap.Tavolsag} km)</b>
							</div>
						</div>
						{adatlap.RendelesSzama ? (
							<div className='text-sm flex flex-row items-center'>
								<QrCode className='w-4 h-4' />: {adatlap.RendelesSzama}
							</div>
						) : null}
						<Separator className='opacity-40' />
						{adatlap.Beepitok || adatlap.DateTime1953 ? (
							<>
								<div className='flex flex-col gap-1'>
									<div className='text-xs flex flex-row items-center'>
										<HardHat className='w-4 h-4' />: {adatlap.Beepitok}
									</div>
									<div className='text-xs flex flex-row items-center'>
										<Calendar className='w-4 h-4' />:{" "}
										{adatlap.DateTime1953.toLocaleDateString("hu-HU")}
									</div>
								</div>
								<Separator className='opacity-40' />
							</>
						) : null}
						<div className='flex flex-col gap-1'>
							<div className='text-xs flex flex-row items-center'>
								<Ruler className='w-4 h-4' />: {adatlap.Felmero2}
							</div>
							<div className='text-xs flex flex-row items-center'>
								<Calendar className='w-4 h-4' />:{" "}
								{adatlap.FelmeresIdopontja2.toLocaleDateString("hu-HU")}
							</div>
						</div>
					</div>
					<ButtonBar adatlap={adatlap} />
				</div>
			</div>

			<AdatlapDialog open={open} adatlap={adatlap} onClose={() => setOpen(false)} />
		</>
	);
}
