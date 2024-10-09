"use client";
import React, { useEffect } from "react";
import CircularProgressBar from "./_components/CircularProgressBar";
import { Toaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "react-query";
import { SidebarComponent } from "@/components/sidebar";
import { useUser } from "@auth0/nextjs-auth0/client";
import { fetchUserCookie } from "./actions";

interface Progress {
	percent: number;
}

export const GlobalContext = React.createContext<{
	setProgress: React.Dispatch<React.SetStateAction<Progress>>;
	progress: Progress;
}>({
	setProgress: () => {},
	progress: { percent: 0 },
});

export default function RootLayoutClient({ children }: { children: React.ReactNode }) {
	useEffect(() => {
		fetchUserCookie();
	}, []);

	const [progress, setProgress] = React.useState<Progress>({ percent: 0 });

	React.useEffect(() => {
		if (progress.percent === 100) {
			setTimeout(() => {
				setProgress({ percent: 0 });
			}, 2500);
		}
	}, [progress.percent]);

	const queryClient = new QueryClient();
	return (
		<div className='overflow-hidden h-[100dvh]'>
			{progress.percent ? <CircularProgressBar percent={progress.percent} /> : null}
			<div className='flex w-full h-full'>
				<SidebarComponent>
					<div className='flex flex-col w-full relative z-10'>
						<GlobalContext.Provider value={{ setProgress, progress }}>
							<QueryClientProvider client={queryClient}>
								<div className='w-full'>{children}</div>
							</QueryClientProvider>
							<Toaster />
						</GlobalContext.Provider>
					</div>
				</SidebarComponent>
			</div>
		</div>
	);
}

export function useGlobalState() {
	const context = React.useContext(GlobalContext);
	if (context === undefined) {
		throw new Error("useNavbarState must be used within a NavbarProvider");
	}
	return context;
}
