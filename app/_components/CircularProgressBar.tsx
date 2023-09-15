import React from "react";

const ScrollProgress = ({ percent }: { percent: number }) => {
	const circumference = 30 * 2 * Math.PI;

	return (
		<div className='container'>
			<div className='fixed inset-x-0 top-0 z-50'>
				<div
					className={`h-1 ${percent !== 100 ? "bg-blue-500" : "bg-green-500"}`}
					style={{ width: `${percent}%` }}></div>
			</div>
			<div>
				{percent ? (
					<div className='fixed inline-flex items-center justify-center overflow-hidden rounded-full bottom-5 left-5 z-50'>
						<svg className='w-20 h-20'>
							<circle
								className='text-gray-300'
								strokeWidth='5'
								stroke='currentColor'
								fill='transparent'
								r='30'
								cx='40'
								cy='40'
							/>
							<circle
								className={percent !== 100 ? `text-blue-600` : `text-green-600`}
								strokeWidth='5'
								strokeDasharray={circumference}
								strokeDashoffset={circumference - (percent / 100) * circumference}
								strokeLinecap='round'
								stroke='currentColor'
								fill='transparent'
								r='30'
								cx='40'
								cy='40'
							/>
						</svg>
						<span
							className={`absolute text-xl ${
								percent !== 100 ? "text-blue-700" : "text-green-700"
							}`}>{`${percent}%`}</span>
					</div>
				) : null}
			</div>
		</div>
	);
};

export default ScrollProgress;
