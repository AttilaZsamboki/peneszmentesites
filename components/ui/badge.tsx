import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
	"inline-flex items-center rounded-lg border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
	{
		variants: {
			variant: {
				default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
				secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
				destructive: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
				outline: "text-foreground",
			},
			size: {
				xs: "text-xs",
				sm: "text-sm",
				md: "text-md",
				lg: "text-lg",
			},
			color: {
				yellow: "bg-yellow-700 hover:bg-yellow-700 text-yellow-50",
				green: "bg-green-700 hover:bg-green-600 text-green-50",
				gray: "",
				red: "bg-red-700 hover:bg-red-600 text-red-50",
				blue: "bg-blue-700 hover:bg-blue-600 text-blue-50",
				default: "",
			},
		},
		defaultVariants: {
			variant: "default",
			size: "sm",
			color: "default",
		},
	}
);

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {
	color?: "default" | "yellow" | "green" | "gray" | "red";
}

function Badge({ className, variant, size, color, ...props }: BadgeProps) {
	return <div className={cn(badgeVariants({ variant, size, color }), className)} {...props} />;
}

export { Badge, badgeVariants };
