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
					<TableRow>
						<TableCell className='font-medium'>Kiss József</TableCell>
						<TableCell>{`Budapest, Fo\u{30b} utca 1.`}</TableCell>
						<TableCell>Kovács Béla</TableCell>
						<TableCell>Szabó Gábor, Tóth István</TableCell>
						<TableCell>2024.02.01.</TableCell>
						<TableCell>2024.02.10.</TableCell>
						<TableCell className='text-right'>500.000 Ft</TableCell>
					</TableRow>
					<TableRow>
						<TableCell className='font-medium'>Nagy Anna</TableCell>
						<TableCell>Debrecen, Kossuth utca 20.</TableCell>
						<TableCell>Szabó Gábor</TableCell>
						<TableCell>Kovács Béla, Tóth István</TableCell>
						<TableCell>2024.01.15.</TableCell>
						<TableCell>2024.01.30.</TableCell>
						<TableCell className='text-right'>450.000 Ft</TableCell>
					</TableRow>
				</TableBody>
			</Table>
		</main>
	);
}
