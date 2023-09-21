import { useState, useEffect } from "react";
import { breakpoints } from "../_utils/utils";

export default function useBreakpointValue() {
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
