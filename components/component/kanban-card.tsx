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

export default function KanbanCard({ adatlap }: { adatlap: AdatlapData }) {
	return (
		<div className='flex w-full overflow-hidden bg-white rounded-md border-gray-200 border'>
			<div className='flex flex-col flex-shrink-0 w-full p-4 space-y-4'>
				<div className='flex items-center justify-between'>
					<div>
						<h2 className={cn("text-lg font-semibold", adatlap.RendelesStatusz ? "w-40 truncate" : "")}>
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
									<Calendar className='w-4 h-4' />: {adatlap.DateTime1953.toLocaleDateString("hu-HU")}
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
							<Calendar className='w-4 h-4' />: {adatlap.FelmeresIdopontja2.replace("T", " ")}
						</div>
					</div>
				</div>
				<ButtonBar />
			</div>
		</div>
	);

	function ButtonBar() {
		if (adatlap.RendelesStatusz === "Lezárva") return;
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
	}

	function NavButton() {
		if (
			(adatlap.RendelesStatusz !== "Beépítésre vár" &&
				adatlap.RendelesStatusz !== "Szervezésre vár" &&
				adatlap.RendelesStatusz) ||
			(adatlap.AjanlatKikuldve && !adatlap.RendelesSzama)
		)
			return;
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
				className='border-blue-600 hover:border-blue-700 text-blue-600 hover:text-blue-700'>
				Navigáció
			</Button>
		);
	}

	function RendelesButton() {
		if (
			!adatlap.RendelesStatusz ||
			(adatlap.RendelesStatusz !== "Beépítésre vár" && adatlap.RendelesStatusz !== "Szervezésre vár")
		)
			return;
		return (
			<Button
				variant={"outline"}
				disabled={!adatlap.DateTime1953}
				className='border-orange-600 hover:border-orange-700 text-orange-600 hover:text-orange-700'>
				Beépítés
			</Button>
		);
	}

	function FelmeresButton() {
		if (adatlap.RendelesStatusz) {
			return (
				<BadgeMaterial content={adatlap.FelmeresekSzama}>
					<Link href={"/?filter=" + adatlap.Id}>
						<Button
							variant={"outline"}
							className='border-green-600 hover:border-green-700 text-green-600 hover:text-green-700'>
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
						className='border-green-600 hover:border-green-700 text-green-600 hover:text-green-700'>
						Új felmérés
					</Button>
				</Link>
			);
		}
	}
}
