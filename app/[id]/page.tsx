import DefaultPage from "./defaultpage";

export default function ReadPage({ params }: { params: { id: string } }) {
	return <DefaultPage params={params} edit={false} />;
}
