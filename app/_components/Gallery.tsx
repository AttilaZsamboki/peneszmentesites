import React from "react";
import { Dialog, DialogBody } from "@material-tailwind/react";
import { XMarkIcon, Square2StackIcon } from "@heroicons/react/20/solid";

export default function Gallery({
	images,
	isVideo,
	single = false,
}: {
	images: string[];
	isVideo: boolean;
	single?: boolean;
}) {
	const [open, setOpen] = React.useState("");

	const handleOpen = () => setOpen((cur) => cur && "");

	return (
		<>
			{single ? (
				<img className='h-auto max-w-full rounded-lg' src={images[0]} onClick={() => setOpen(images[0])} />
			) : (
				<div className='grid grid-cols-2 md:grid-cols-3 gap-4'>
					{images.map((media) => (
						<div onClick={() => setOpen(media)} key={media}>
							{isVideo ? (
								<div style={{ position: "relative" }}>
									<video className='h-auto max-w-full rounded-lg' src={media} controls />
									<Square2StackIcon className='w-8 h-8 absolute top-0 right-0 text-white' />
								</div>
							) : (
								<img className='h-auto max-w-full rounded-lg' src={media} />
							)}
						</div>
					))}
				</div>
			)}
			<Dialog size='xl' open={open ? true : false} handler={handleOpen}>
				<DialogBody divider={true} className='p-0 rounded-lg'>
					<div>
						{isVideo ? (
							<video className='h-auto max-w-full rounded-lg' src={open} controls />
						) : (
							<img className='h-auto max-w-full rounded-lg' src={open} />
						)}
						<div className='absolute top-3 right-3' onClick={handleOpen}>
							<XMarkIcon className='w-8 h-8' />
						</div>
					</div>
				</DialogBody>
			</Dialog>
		</>
	);
}
