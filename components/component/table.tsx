"use client";
import { hufFormatter } from "@/app/[id]/_clientPage";
import { concatAddress } from "@/app/_utils/MiniCRM";
import { AdatlapData } from "@/app/_utils/types";
import { TableHead, TableRow, TableHeader, TableCell, TableBody, Table } from "@/components/ui/table";

export function Grid({ data }: { data: AdatlapData[] }) {
	return (
		<main className='flex flex-col gap-6 p-4 md:p-6'>
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Név</TableHead>
						<TableHead>Cím</TableHead>
						<TableHead>Felmérő</TableHead>
						<TableHead>{`Bee\u{301}pítők`}</TableHead>
						<TableHead>Felmérés dátuma</TableHead>
						<TableHead>{`Bee\u{301}pítés dátuma`}</TableHead>
						<TableHead className='text-right'>{`Bee\u{301}pítés bruttó összege`}</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{data.map((adatlap) => (
						<TableRow>
							<TableCell className='font-medium'>{adatlap.Name}</TableCell>
							<TableCell>{concatAddress(adatlap)}</TableCell>
							<TableCell>{adatlap.Felmero2}</TableCell>
							<TableCell>{adatlap.Beepitok}</TableCell>
							<TableCell>{adatlap.FelmeresIdopontja2}</TableCell>
							<TableCell>{adatlap.DateTime1953}</TableCell>
							<TableCell className='text-right'>{hufFormatter.format(adatlap.Total)}</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</main>
	);
}
