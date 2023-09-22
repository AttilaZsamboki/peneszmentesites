import { useState, useEffect } from "react";
import { DeviceSizes, breakpoints } from "../_utils/utils";

export default function useBreakpointValue() {
	const [currentBreakpoint, setCurrentBreakpoint] = useState<DeviceSizes>("");

	useEffect(() => {
		const handleResize = () => {
			const windowWidth = window.innerWidth;
			setCurrentBreakpoint(breakpoints.find((bp) => bp.max >= windowWidth && bp.min <= windowWidth)?.size || "");
		};

		handleResize();
		window.addEventListener("resize", handleResize);

		return () => {
			window.removeEventListener("resize", handleResize);
		};
	}, []);

	return currentBreakpoint;
}
