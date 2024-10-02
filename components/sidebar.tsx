"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import jwt from "jsonwebtoken";
import { Bell, ChevronDown, ChevronUp, FactoryIcon, ShoppingCartIcon, X } from "lucide-react";
import { cn, createJWT, getCookie, useUserWithRole } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { ArchiveBoxIcon } from "@heroicons/react/20/solid";
import { OnboardingSurveyComponent } from "./onboarding-survey";
import { DialogTrigger } from "./ui/dialog";

interface Route {
	name: string;
	href: string;
	icon: any;
	subRoutes: {
		name: string;
		href: string[];
	}[];
}

export function SidebarComponent({ children }: { children: React.ReactNode }) {
	const [isOpen, setIsOpen] = useState(false);
	const [searchValue, setSearchValue] = useState("");
	const [showOnboarding, setShowOnboarding] = useState(true);

	useEffect(() => {
		const handleResize = () => {
			if (window.innerWidth <= 420) {
				setIsOpen(false);
			}
		};

		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	const toggleSidebar = () => {
		setIsOpen(!isOpen);
	};

	const { user, error, isLoading } = useUserWithRole();

	if (!user && !isLoading) {
		window.location.href = "/api/auth/login";
		return null;
	}
	if (user && user.sub) {
		const JWT = getCookie("jwt");
		if (!JWT) {
			document.cookie = `jwt=${createJWT(user.sub)}; path=/`;
		} else if (JWT) {
			try {
				jwt.verify(JWT, process.env.NEXT_PUBLIC_SECRET as string);
			} catch (err) {
				document.cookie = `jwt=${createJWT(user.sub)}; path=/`;
			}
		}
	}
	const dismissOnboarding = () => {
		setShowOnboarding(false);
	};

	return (
		<>
			<div className={`sidebar ${isOpen ? "open" : ""}`}>
				<div className='logo-details'>
					<FactoryIcon className='bx bxl-c-plus-plus icon text-white mr-3' />
					<div className='logo_name'>Acme Inc.</div>
					<i className='bx bx-menu' id='btn' onClick={toggleSidebar}></i>
				</div>
				<ul className='nav-list'>
					<li>
						<i className='bx bx-search'></i>
						<input
							type='text'
							placeholder='Search...'
							value={searchValue}
							onChange={(e) => setSearchValue(e.target.value)}
						/>
						<span className='tooltip'>Search</span>
					</li>
					<NavItem icon='bx-grid-alt' text='Főpanel' href={"/adatlapok"} />
					<SubMenu icon='bx-user' text='Adatok'>
						<NavItem text='Felmérések' isChild href='/' />
						<NavItem text='Kérdések' isChild href='/questions' />
						<NavItem text='Sablonok' isChild href='/templates' />
						<NavItem text='Munkadíjak' isChild href='/munkadij' />
					</SubMenu>
					<NavItem icon='bx-cart-alt' text='Termékek' href='/products' />
					<NavItem icon='bx-folder' text='File Manager' tooltip='Files' href='test' />
					<NavItem icon='bx-chat' text='Messages' />
					<SubMenu icon='bx-pie-chart-alt-2' text='Analytics'>
						<NavItem text='Sales' isChild />
						<NavItem text='Traffic' isChild />
						<NavItem text='Conversions' isChild />
					</SubMenu>
					<NavItem icon='bx-heart' text='Saved' />
					<NavItem icon='bx-cog' text='Beállítások' href='settings' />
					{showOnboarding && isOpen && (
						<li className='onboarding-notification'>
							<OnboardingSurveyComponent>
								<div className='flex items-center justify-between p-2 bg-blue-100 rounded-md'>
									<div className='flex items-center'>
										<Bell size={16} className='text-blue-500 mr-2' />
										<span className='text-sm text-blue-700'>Complete onboarding</span>
									</div>
									<button onClick={dismissOnboarding} className='text-blue-500 hover:text-blue-700'>
										<X size={16} />
									</button>
								</div>
							</OnboardingSurveyComponent>
						</li>
					)}
					<li className='profile'>
						<div className='profile-details'>
							{isLoading ? (
								<Avatar />
							) : (
								<Avatar className='mr-2'>
									<AvatarImage src={user!.picture ?? ""} />
									<AvatarFallback>{user!.nickname}</AvatarFallback>
								</Avatar>
							)}
							<div className='name_job'>
								<div className='name'>{user?.name}</div>
								<div className='job'>{String(user?.role)}</div>
							</div>
						</div>

						<a href='/api/auth/logout' id='log_out' className='flex items-center justify-center w-full'>
							<i className='bx bx-log-out'></i>
						</a>
					</li>
				</ul>
			</div>
			<section className='home-section'>{children}</section>
		</>
	);
}

function NavItem({
	icon,
	text,
	tooltip = text,
	isChild,
	href,
}: {
	icon?: string;
	text: string;
	tooltip?: string;
	isChild?: boolean;
	href?: string;
}) {
	return (
		<li>
			<Link href={href ?? "#"} className='flex items-center'>
				{icon && <i className={`bx ${icon}`}></i>}
				<span className={cn("links_name", isChild ? "pl-2" : "")}>{text}</span>
			</Link>
			<span className='tooltip'>{tooltip}</span>
		</li>
	);
}

function SubMenu({
	icon,
	text,
	children,
	className,
}: {
	icon: string;
	text: string;
	children: React.ReactNode;
	className?: string;
}) {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<li className={className}>
			<div className='flex items-center justify-between cursor-pointer' onClick={() => setIsOpen(!isOpen)}>
				<div className='flex items-center'>
					<i className={`bx ${icon}`}></i>
					<span className='links_name'>{text}</span>
				</div>
				{isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
			</div>
			{isOpen && <ul className='sub-menu '>{children}</ul>}
			<span className='tooltip'>{text}</span>
		</li>
	);
}
