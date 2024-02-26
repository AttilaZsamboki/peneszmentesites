export interface AdatlapData {
	Id: number;
	Name: string;
	StatusId: number;
	ContactId: number;
	Cim2: string;
	FelmeresiDij: number;
	Telepules: string;
	Iranyitoszam: string;
	Orszag: string;
	Felmero2: string;
	IngatlanKepe: string;
	CreatedAt: string;
	FizetesiMod2: string;
	Tavolsag: number;
	Total: number;
	Phone: string;
	Email: string;
	Beepitok: string;
	DateTime1953: Date;
	FelmeresIdopontja2: string;
	RendelesSzama: string;
	RendelesStatusz?: "Beépítésre vár" | "Szervezésre vár" | "Elszámolásra vár" | "Lezárva";
	FelmeresekSzama?: number;
	AjanlatKikuldve?: number;
	AjanlatElutasitva?: boolean;
}
