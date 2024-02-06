import { Button } from "@/components/ui/button";
import { AtSign, Home, Phone, QrCode } from "lucide-react";

export default function KanbanCard() {
	return (
		<div className='flex w-full overflow-hidden bg-white rounded-md border-gray-200 border'>
			<div className='flex flex-col flex-shrink-0 w-72 p-4 space-y-4'>
				<div className='flex items-center justify-between'>
					<h2 className='text-lg font-semibold'>Kiváncsi Sándor</h2>
					<span className='px-3 py-1 text-sm font-semibold text-white bg-green-600 rounded-md'>
						543 123 Ft
					</span>
				</div>
				<div className='space-y-2'>
					<div className='text-sm flex flex-row items-center'>
						<Home className='w-4 h-4' />: Nagyigmánd 1234 Utca 1 (124 km){"\n              "}
					</div>
					<div className='text-sm flex flex-row items-center'>
						<Phone className='w-4 h-4' />: +36 20 123 4567{"\n              "}
					</div>
					<div className='text-sm flex flex-row items-center'>
						<AtSign className='w-4 h-4' />: maniyika@gmail.com{"\n              "}
					</div>
					<div className='text-sm flex flex-row items-center'>
						<QrCode className='w-4 h-4' />: ORD-2023-000001{"\n              "}
					</div>
				</div>
				<Button className='bg-blue-600 hover:bg-blue-700 text-white'>Készpénz</Button>
			</div>
		</div>
	);
}
