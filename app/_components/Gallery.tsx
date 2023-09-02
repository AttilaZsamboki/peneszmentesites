import React from "react";
import { Dialog, DialogBody, Carousel } from "@material-tailwind/react";
import { XMarkIcon } from "@heroicons/react/20/solid";
import useBreakpointValue from "./useBreakpoint";

export default function Gallery({ media, single = false }: { media: string[]; single?: boolean }) {
	const [open, setOpen] = React.useState(0);

	const handleOpen = () => setOpen((cur) => cur && 0);

	const size = useBreakpointValue();
	const isVideo = (media: string): boolean => {
		const videoExtensions = [".mp4", ".avi", ".mov"];
		const extension = media.substring(media.lastIndexOf("."));
		return videoExtensions.includes(extension);
	};
	return (
		<>
			{single ? (
				<img className='h-auto max-w-full rounded-lg' src={media[0]} onClick={() => setOpen(0)} />
			) : (
				<div className='grid grid-cols-2 md:grid-cols-3 gap-4'>
					{media.map((media, index) => (
						<div onClick={() => setOpen(index + 1)} key={index}>
							{isVideo(media) ? (
								<video className='h-auto max-w-full rounded-lg' src={media} controls />
							) : (
								<img className='h-auto max-w-full rounded-lg' src={media} />
							)}
						</div>
					))}
				</div>
			)}
			<Dialog size={size === "sm" ? "xl" : "sm"} open={open ? true : false} handler={handleOpen}>
				<DialogBody divider={false} className='p-0 rounded-lg'>
					<Carousel className='rounded-md'>
						<img className='h-auto max-w-full rounded-lg' src={media[open - 1]} />
						{media
							.filter((media, index) => index !== open - 1 && !isVideo(media))
							.map((media, index) => (
								<div onClick={() => setOpen(index + 1)} key={index}>
									<img className='h-auto max-w-full rounded-lg' src={media} />
								</div>
							))}
					</Carousel>

					<div className='absolute top-3 right-3' onClick={handleOpen}>
						<XMarkIcon className='w-7 h-7 text-white' />
					</div>
				</DialogBody>
			</Dialog>
		</>
	);
}
