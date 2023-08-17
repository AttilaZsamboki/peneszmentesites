import { Felmeres } from "../page";
import ClientPage from "./_clientPage";

export default async function Page({ params }: { params: { id: string } }) {
	const data = await fetch("http://pen.dataupload.xyz/felmeresek/" + params.id);
	const felmeres: Felmeres[] = await data.json();
	const formattedFelmeres = felmeres.map((field) =>
		["GRID", "CHECKBOX_GRID", "FILE_UPLOAD"].includes(field.type)
			? {
					...field,
					value: JSON.parse(field.value.replace(/None/g, null as unknown as string).replace(/'/g, '"')),
			  }
			: { ...field }
	);
	return (
		<div className='bg-white'>
			<div className='px-4 sm:px-0 pt-10'>
				<h3 className='text-base font-semibold leading-7 text-gray-900'>Felmérés adatok</h3>
			</div>
			<div className='mt-6 border-t border-gray-100'>
				<ClientPage formattedFelmeres={formattedFelmeres} />
			</div>
		</div>
	);
}
