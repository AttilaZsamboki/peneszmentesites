import { Progress } from "@/components/ui/progress";
import React from "react";

const ScrollProgress = ({ percent }: { percent: number }) => {
	return (
		<div className='container'>
			<div className='fixed inset-x-0 top-0 z-50'>
				<Progress className='rounded-none' value={percent} />
			</div>
		</div>
	);
};

export default ScrollProgress;
