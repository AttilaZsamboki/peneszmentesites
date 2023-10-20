import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ArrowLeftIcon, ArrowRightIcon, Trash2 } from "lucide-react";
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
			<Button
				size='icon'
				variant='outline'
				className='absolute left-0 top-1/2 transform -translate-y-1/2 opacity-70'>
				<ArrowLeftIcon className='h-6 w-6' onClick={handlePreviousClick} />
			</Button>
			<img src={images[currentImageIndex]} alt={`Carousel image ${currentImageIndex + 1}`} />
			<Button
				size='icon'
				variant='outline'
				className='absolute right-0 top-1/2 transform -translate-y-1/2 opacity-70'>
				<ArrowRightIcon className='h-6 w-6' onClick={handleNextClick} />
			</Button>
		</div>
	);
}

export default function Gallery({
	media: images,
	single,
	edit,
	onDelete,
	width,
}: {
	media: string[];
	single?: boolean;
	edit?: boolean;
	onDelete?: (index: number) => void;
	width?: number;
}) {
	const [open, setOpen] = useState(false);
	const [selectedImageIndex, setSelectedImageIndex] = useState(0);

	const handleOpen = (index: number) => {
		setSelectedImageIndex(index);
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	const handleDelete = (index: number) => {
		onDelete ? onDelete(index) : null;
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
						<div key={index} className='relative'>
							<div onClick={() => handleOpen(index)}>
								{isVideo(media) ? (
									<video className='h-auto max-w-full rounded-lg' src={media} controls />
								) : (
									<img className='h-auto max-w-full rounded-lg' width={width ?? "full"} src={media} />
								)}
							</div>
							{edit ? (
								<div className='absolute top-2 right-2'>
									<Button size='icon' variant='outline' onClick={() => handleDelete(index)}>
										<Trash2 className='text-red-700' />
									</Button>
								</div>
							) : null}
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
