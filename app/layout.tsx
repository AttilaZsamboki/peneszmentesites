import "./globals.css";
import RootLayoutClient from "./_clientLayout";

import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
	title: "Penészmentesítés",
	description: "Generated by create next app",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang='en'>
			<body className='bg-white'>
				<RootLayoutClient>{children}</RootLayoutClient>
			</body>
		</html>
	);
}
