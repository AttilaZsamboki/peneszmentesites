"use client";

export default function Heading({
	id,
	title,
	variant,
	width = "w-11/12",
	children,
	border = true,
	marginY,
}: {
	id?: string;
	title: string;
	variant: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
	width?: string;
	children?: React.ReactNode;
	border?: boolean;
	marginY?: string;
}) {
	return (
		<div
			id={id}
			className={`flex lg:flex-row flex-col justify-between items-center w-full mb-2 ${
				border ? "border-b" : ""
			}`}>
			<div className='flex flex-col justify-items items-center w-full'>
				<div
					className={`flex flex-col ${width} px-2 lg:items-start sm:items-center justify-center ${
						marginY ? marginY : ""
					} lg:justify-between text-center`}>
					<div
						className={`font-semibold text-gradient-to-tr from-gray-900 to-gray-800 lg:my-0 text-left prose prose-slate lg:prose-lg`}>
						<Title />
					</div>
				</div>
			</div>
			{children}
		</div>
	);
	function Title() {
		switch (variant) {
			case "h1":
				return <h1>{title}</h1>;
			case "h2":
				return <h2>{title}</h2>;
			case "h3":
				return <h3>{title}</h3>;
			case "h4":
				return <h4>{title}</h4>;
			case "h5":
				return <h5>{title}</h5>;
			case "h6":
				return <h6>{title}</h6>;
			default:
				return <h1>{title}</h1>;
		}
	}
}
