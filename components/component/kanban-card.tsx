"use client";
import { hufFormatter } from "@/app/[id]/_clientPage";
import { AdatlapData } from "@/app/_utils/types";
import { Button } from "@/components/ui/button";
import { Calendar, HardHat, Home, Map, Navigation, Phone, QrCode, Ruler } from "lucide-react";
import { Separator } from "../ui/separator";
import { Badge } from "../ui/badge";
import { Badge as BadgeMaterial } from "@material-tailwind/react";
import { ContactDetails, concatAddress } from "@/app/_utils/MiniCRM";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { AdatlapDialog } from "@/app/adatlapok/Page.1";
import React from "react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "../ui/dropdown-menu";

export function ButtonBar({
	adatlap,
	btnClassName,
	phone,
	contact,
}: {
	adatlap: AdatlapData;
	btnClassName?: string;
	phone?: boolean;
	contact?: ContactDetails | null;
}) {
	if (adatlap.Statusz === "Lezárva" || adatlap.Statusz === "Elutasítva") return;
	return (
		<div className='flex flex-row w-full items-center justify-between gap-2'>
			<NavButton />
			<FelmeresButton />
			{adatlap.DateTime1953 ? <RendelesButton /> : null}
			{phone ? (
				<a className='lg:w-1/3 w-auto' href={`tel:${contact?.Phone}`}>
					<Button
						size={"icon"}
						variant={"outline"}
						className={cn("border-red-600 hover:border-red-700 text-red-600 hover:text-red-700")}>
						<Phone className='w-4 h-4' />
					</Button>
				</a>
			) : null}
		</div>
	);

	function RendelesButton() {
		if (adatlap.Statusz !== "Beépítésre vár") return;
		return (
			<Link href={adatlap.FelmeresLink ?? ""}>
				<Button
					variant={"outline"}
					disabled={!adatlap.DateTime1953}
					className={cn(
						"border-orange-600 hover:border-orange-700 text-orange-600 hover:text-orange-700",
						btnClassName
					)}>
					Beépítés
				</Button>
			</Link>
		);
	}

	function FelmeresButton() {
		const isStatusFelmeres = adatlap.Statusz === "Felmérésre vár";
		const isStatusAjanlat = adatlap.Statusz === "Ajánlat kiküldve";
		const buttonClass = cn(
			"border-green-600 hover:border-green-700 text-green-600 hover:text-green-700",
			btnClassName
		);
		const linkHref =
			(adatlap.FelmeresekSzama ?? 0) === 1 && adatlap.FelmeresLink
				? adatlap.FelmeresLink
				: "/?filter=" + adatlap.Id;

		return (
			<>
				{(isStatusAjanlat || !isStatusFelmeres) && (
					<BadgeMaterial content={adatlap.FelmeresekSzama}>
						<Link href={linkHref}>
							<Button variant={"outline"} className={buttonClass}>
								Felmerések
							</Button>
						</Link>
					</BadgeMaterial>
				)}
				{(isStatusFelmeres || isStatusAjanlat) && (
					<Link href={"/new?adatlap_id=" + adatlap.Id + "&page=1"}>
						<Button variant={"outline"} className={buttonClass}>
							Új felmérés
						</Button>
					</Link>
				)}
			</>
		);
	}

	function NavButton() {
		if (adatlap.Statusz === "Ajánlat kiküldve" || adatlap.Statusz === "Elszámolásra vár") return;
		return (
			<DropdownMenu>
				<DropdownMenuTrigger>
					<Button
						variant={"outline"}
						className={cn(
							"border-blue-600 hover:border-blue-700 text-blue-600 hover:text-blue-700",
							btnClassName
						)}>
						Navigáció
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent>
					<DropdownMenuLabel>Opciók</DropdownMenuLabel>
					<DropdownMenuSeparator />
					<DropdownMenuGroup>
						<DropdownMenuItem
							onClick={() => {
								window.open(
									`https://www.google.com/maps/dir/${encodeURIComponent(
										"Budapest, Nagytétényi út 218-220, 1225"
									)}/${encodeURIComponent(concatAddress(adatlap))}`
								);
							}}>
							<Map className='mr-2 h-4 w-4' />
							<span>Google Maps</span>
						</DropdownMenuItem>
						<DropdownMenuItem
							onClick={() => {
								window.open(`https://www.waze.com/ul?q=${concatAddress(adatlap)}&navigate=yes`);
							}}>
							<Navigation className='mr-2 h-4 w-4' />
							<span>Waze</span>
						</DropdownMenuItem>
					</DropdownMenuGroup>
				</DropdownMenuContent>
			</DropdownMenu>
		);
	}
}

export default function KanbanCard({ adatlap }: { adatlap: AdatlapData }) {
	const [open, setOpen] = React.useState(false);
	return (
		<>
			<div className='flex w-full overflow-hidden bg-white rounded-md border-gray-200 border cursor-pointer'>
				<div className='flex flex-col flex-shrink-0 w-full p-4 space-y-4'>
					<div className=' flex flex-col flex-shrink-0 w-full space-y-4' onClick={() => setOpen(true)}>
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
					</div>
					<ButtonBar adatlap={adatlap} />
				</div>
			</div>

			<AdatlapDialog open={open} adatlap={adatlap} onClose={() => setOpen(false)} />
		</>
	);
}
