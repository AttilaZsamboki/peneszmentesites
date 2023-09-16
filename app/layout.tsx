import "./globals.css";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-material.css";

import RootLayoutClient from "./_clientLayout";

import type { Metadata } from "next";

import { Analytics } from "@vercel/analytics/react";

export const fetchCache = "force-no-store";

export const metadata: Metadata = {
	title: "Penészmentesítés",
	description: "Generated by create next app",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang='en'>
			<body className='bg-white'>
				<RootLayoutClient>{children}</RootLayoutClient>
				<Analytics />
			</body>
		</html>
	);
}
