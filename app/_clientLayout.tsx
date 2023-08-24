"use client";
import React from "react";
import { Alert, Button, Typography } from "@material-tailwind/react";
import { ExclamationCircleIcon } from "@heroicons/react/20/solid";
import autoAnimate from "@formkit/auto-animate";

export const GlobalContext = React.createContext<{
	setAlert: React.Dispatch<
		React.SetStateAction<{
			message: string;
			level: "information" | "warning" | "error";
		} | null>
	>;
	setConfirm: React.Dispatch<
		React.SetStateAction<{
			message: string;
			onConfirm: () => void;
			onCancel?: (() => void) | undefined;
		} | null>
	>;
}>({
	setAlert: () => {},
	setConfirm: () => {},
});

export default function RootLayoutClient({ children }: { children: React.ReactNode }) {
	const [alert, setAlert] = React.useState<{
		message: string;
		level: "information" | "warning" | "error";
	} | null>(null);
	const [confirm, setConfirm] = React.useState<{
		message: string;
		onConfirm: () => void;
		onCancel?: () => void;
	} | null>(null);

	return (
		<div>
			{alert && (
				<div className='flex justify-center items-center'>
					<Alert
						open={alert.message ? true : false}
						color={alert.level === "information" ? "blue" : alert.level === "warning" ? "yellow" : "red"}
						className='z-50 top-10 w-2/3 lg:w-1/3 absolute backdrop-filter backdrop-blur-sm'
						icon={<ExclamationCircleIcon className='mt-px h-6 w-6 text-white' />}
						onClose={() => setAlert(null)}>
						<Typography variant='h5' color='white'>
							{alert.level === "information"
								? "Információ"
								: alert.level === "warning"
								? "Figyelmeztetés"
								: "Hiba"}
						</Typography>
						<Typography color='white' className='mt-2 font-normal'>
							{alert.message}
						</Typography>
					</Alert>
				</div>
			)}
			{confirm && (
				<div className='flex justify-center items-center'>
					<Alert
						open={confirm.message ? true : false}
						variant='ghost'
						className='z-50 top-10 w-2/3 h-20 lg:w-1/3 absolute flex flex-row justify-between items-center backdrop-filter backdrop-blur-sm'>
						<Typography className='font-normal w-2/3 text-left'>{confirm.message}</Typography>
						<div className='absolute right-5 bottom-5 items-center w-full flex flex-row justify-end gap-4'>
							<Button
								variant='gradient'
								onClick={() => {
									confirm.onConfirm();
									setConfirm(null);
								}}>
								Igen
							</Button>
							<Button
								color='gray'
								variant='outlined'
								onClick={() => {
									confirm.onCancel && confirm.onCancel();
									setConfirm(null);
								}}>
								Mégsem
							</Button>
						</div>
					</Alert>
				</div>
			)}
			<GlobalContext.Provider value={{ setAlert, setConfirm }}>{children}</GlobalContext.Provider>
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
