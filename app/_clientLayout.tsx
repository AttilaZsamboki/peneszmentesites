"use client";
import React from "react";
import { ArchiveBoxIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { usePathname } from "next/navigation";
import CircularProgressBar from "./_components/CircularProgressBar";
import { Toaster } from "@/components/ui/sonner";
import { ChevronDown, Menu, ShoppingCartIcon } from "lucide-react";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { Separator } from "@/components/ui/separator";
import useBreakpointValue from "./_components/useBreakpoint";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getCookie, createJWT, useLocalStorageState, useUserWithRole, Role } from "@/lib/utils";
import { QueryClient, QueryClientProvider } from "react-query";
import jwt from "jsonwebtoken";
import Image from "next/image";
import { SidebarComponent } from "@/components/sidebar";

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
