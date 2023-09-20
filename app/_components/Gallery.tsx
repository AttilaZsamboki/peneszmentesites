import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";
import React, { useState } from "react";

function Carousel({ images, selectedImageIndex }: { images: string[]; selectedImageIndex: number }) {
	const [currentImageIndex, setCurrentImageIndex] = useState(selectedImageIndex);

	const handlePreviousClick = () => {
		setCurrentImageIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : images.length - 1));
	};

	const handleNextClick = () => {
		setCurrentImageIndex((prevIndex) => (prevIndex < images.length - 1 ? prevIndex + 1 : 0));
	};

	return (
		<div className='relative'>
			<ArrowLeftIcon
				className='w-6 h-6 absolute left-0 top-1/2 transform -translate-y-1/2 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground'
				onClick={handlePreviousClick}
			/>
			<img src={images[currentImageIndex]} alt={`Carousel image ${currentImageIndex + 1}`} />
			<ArrowRightIcon
				className='h-6 w-6 absolute right-0 top-1/2 transform -translate-y-1/2 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground'
				onClick={handleNextClick}
			/>
		</div>
	);
}

export default function Gallery({ media: images, single }: { media: string[]; single?: boolean }) {
	const [open, setOpen] = useState(false);
	const [selectedImageIndex, setSelectedImageIndex] = useState(0);

	const handleOpen = (index: number) => {
		setSelectedImageIndex(index);
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};
	const isVideo = (media: string): boolean => {
		const videoExtensions = [".mp4", ".avi", ".mov"];
		const extension = media.substring(media.lastIndexOf("."));
		return videoExtensions.includes(extension);
	};

	return (
		<div>
			{single ? (
				<img className='h-auto max-w-full rounded-lg' src={images[0]} onClick={() => handleOpen(0)} />
			) : (
				<div className='grid grid-cols-2 md:grid-cols-3 gap-4'>
					{images.map((media, index) => (
						<div onClick={() => handleOpen(index)} key={index}>
							{isVideo(media) ? (
								<video className='h-auto max-w-full rounded-lg' src={media} controls />
							) : (
								<img className='h-auto max-w-full rounded-lg' src={media} />
							)}
						</div>
					))}
				</div>
			)}

			{open && (
				<Dialog open={open} onOpenChange={handleClose}>
					<DialogContent>
						<Carousel images={images} selectedImageIndex={selectedImageIndex} />
					</DialogContent>
				</Dialog>
			)}
		</div>
	);
}
