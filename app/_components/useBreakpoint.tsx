import { useState, useEffect } from "react";

export default function useBreakpointValue() {
	const breakpoints = [
		{ size: "sm", min: 0, max: 768 },
		{ size: "md", min: 768, max: 1024 },
		{ size: "lg", min: 1024, max: 1280 },
		{ size: "xl", min: 1280, max: 1536 },
		{ size: "2xl", min: 1536, max: 9999 },
	];
	const [currentBreakpoint, setCurrentBreakpoint] = useState("");

	useEffect(() => {
		const handleResize = () => {
			const windowWidth = window.innerWidth;
			setCurrentBreakpoint(breakpoints.find((bp) => bp.max >= windowWidth && bp.min <= windowWidth)?.size || "");
		};

		handleResize(); // Initial call to set the breakpoint on mount

		window.addEventListener("resize", handleResize);

		return () => {
			window.removeEventListener("resize", handleResize);
		};
	}, []);

	return currentBreakpoint;
}
