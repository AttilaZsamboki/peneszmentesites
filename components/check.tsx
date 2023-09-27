import { MotionValue, motion, useMotionValue, useTransform } from "framer-motion";

export function Checkmark({
	width = 258,
	height = 258,
	startingColor = ["#FFCC66", "#FFCC66"],
}: {
	width?: number;
	height?: number;
	startingColor?: string[];
}) {
	const progress = useMotionValue(100);
	const circleLength = useTransform(progress, [0, 100], [0, 1]);
	const checkmarkPathLength = useTransform(progress, [0, 95, 100], [0, 0, 1]);
	const circleColor = useTransform(progress, [0, 95, 100], [...startingColor, "#4CAF50"]);

	return (
		<>
			<motion.div initial={{ x: 0 }} animate={{ x: 100 }} style={{ x: progress }} transition={{ duration: 1 }} />
			<motion.svg xmlns='http://www.w3.org/2000/svg' width={width} height={height} viewBox='0 0 258 258'>
				<motion.path
					transform='translate(60 85)'
					d='M3 50L45 92L134 3'
					fill='transparent'
					stroke='#7BB86F'
					strokeWidth={8}
					style={{ pathLength: checkmarkPathLength }}
				/>
				<motion.path
					d='M 130 6 C 198.483 6 254 61.517 254 130 C 254 198.483 198.483 254 130 254 C 61.517 254 6 198.483 6 130 C 6 61.517 61.517 6 130 6 Z'
					fill='transparent'
					strokeWidth='8'
					stroke={circleColor}
					style={{
						pathLength: circleLength,
					}}
				/>
			</motion.svg>
		</>
	);
}
