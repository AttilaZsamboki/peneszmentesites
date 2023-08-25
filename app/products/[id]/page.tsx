import Heading from "@/app/_components/Heading";
import { Product } from "../page";
import ClientPage from "./_clientPage";

export interface ProductAttributes {
	id?: number;
	product_id: number;
	place: boolean;
	place_options: string[];
}

export default async function ProductDetails({ params }: { params: { id: string } }) {
	const response = await fetch(`http://pen.dataupload.xyz/products/${params.id}`);
	const product: Product = await response.json();
	const responseAttributes = await fetch(`http://pen.dataupload.xyz/product_attributes/${params.id}`);
	if (responseAttributes.status === 200) {
		const attributes: ProductAttributes = await responseAttributes.json().then((data) => data[0]);
		return (
			<div className='w-full'>
				<Heading title={product.name} variant='h4' />
				<div className='w-full flex flex-col justify-center items-center'>
					<ClientPage data={attributes} />
				</div>
			</div>
		);
	} else {
		return (
			<div className='w-full'>
				<Heading title={product.name} variant='h4' />
			</div>
		);
	}
}
