import React from "react";
import { Dialog, DialogBody } from "@material-tailwind/react";
import { XMarkIcon, Square2StackIcon } from "@heroicons/react/20/solid";

export default function Gallery({ images, isVideo }: { images: string[]; isVideo: boolean }) {
	const [open, setOpen] = React.useState("");

	const handleOpen = () => setOpen((cur) => cur && "");

	return (
		<>
			<div className='grid grid-cols-2 md:grid-cols-3 gap-4'>
				{images.map((image) => (
					<div onClick={() => setOpen(image)} key={image}>
						{isVideo ? (
							<div style={{ position: "relative" }}>
								<video
									className='h-auto max-w-full rounded-lg'
									src={`https://drive.google.com/uc?export=view&id=${image}`}
									controls
								/>
								<Square2StackIcon className='w-8 h-8 absolute top-0 right-0 text-white' />
							</div>
						) : (
							<img
								className='h-auto max-w-full rounded-lg'
								src={`https://drive.google.com/uc?export=view&id=${image}`}
							/>
						)}
					</div>
				))}
			</div>
			<Dialog size='xl' open={open ? true : false} handler={handleOpen}>
				<DialogBody divider={true} className='p-0'>
					<div>
						{isVideo ? (
							<video
								className='h-auto max-w-full rounded-lg'
								src={`https://drive.google.com/uc?export=view&id=${open}`}
								controls
							/>
						) : (
							<img
								className='h-auto max-w-full rounded-lg'
								src={`https://drive.google.com/uc?export=view&id=${open}`}
							/>
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
