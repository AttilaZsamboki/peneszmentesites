export type AdatlapStatusz =
	| "Felmérésre vár"
	| "Ajánlat kiküldve"
	| "Beépítésre vár"
	| "Elszámolásra vár"
	| "Lezárva"
	| "Elutasítva";

export interface AdatlapData {
	Id: number;
	Name: string;
	ContactId: number;
	Cim2: string;
	Telepules: string;
	Iranyitoszam: string;
	Orszag: string;
	Felmero2: string;
	FizetesiMod2: string;
	FizetesiMod3: string;
	Tavolsag: number;
	Total: number;
	Beepitok: string;
	DateTime1953: Date;
	FelmeresIdopontja2: Date;
	RendelesSzama: string;
	FelmeresekSzama?: number;
	Statusz: AdatlapStatusz;
	FelmeresiDij: number;
	FelmeresLink: string | null;
}

export interface Salesmen {
	id: number;
	name: string;
	zip: string;
}
