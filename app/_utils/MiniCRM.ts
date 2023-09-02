import { FelmeresItems } from "../felmeresek/new/_clientPage";

export interface AdatlapDetails {
	Id: number;
	CategoryId: number;
	ContactId: number;
	StatusId: string;
	UserId: string;
	Name: string;
	StatusUpdatedAt: string;
	IsPrivate: number;
	Invited: string;
	Deleted: number;
	CreatedBy: string;
	CreatedAt: string;
	UpdatedBy: string;
	UpdatedAt: string;
	EmailOpen_Phone: string;
	EmailOpen_Tablet: string;
	EmailOpen_iPhone: string;
	EmailOpen_iPad: string;
	EmailOpen_Android: string;
	Serial_Number: string;
	Type: string;
	Url: string;
	MilyenProblemavalFordultHozzank: string;
	Tavolsag: number;
	FelmeresiDij: number;
	FelmeresIdopontja2: string;
	MiAzUgyfelFoSzempontja3: string;
	EgyebSzempontok3: string;
	Cim2: string;
	UtazasiIdoKozponttol: string;
	Alaprajz: string;
	LezarasOka: string;
	LezarasSzovegesen: string;
	Telepules: string;
	Iranyitoszam: string;
	Forras: string;
	Megye: string;
	Orszag: string;
	Felmero2: string;
	DijbekeroPdf2: string;
	DijbekeroSzama2: string;
	DijbekeroMegjegyzes2: string;
	DijbekeroUzenetek: string;
	FizetesiMod2: string;
	KiallitasDatuma: string;
	FizetesiHatarido: string;
	MennyireVoltMegelegedve2: string;
	Pontszam3: number;
	SzovegesErtekeles4: string;
	IngatlanKepe: string;
	Munkalap: string;
	BruttoFelmeresiDij: number;
	MunkalapMegjegyzes: string;
	FelmeresVisszaigazolva: string;
	SzamlaPdf: string;
	SzamlaSorszama2: string;
	KiallitasDatuma2: string;
	SzamlaUzenetek: string;
	SzamlaMegjegyzes: string;
	FelmeresAdatok: string;
	UtvonalAKozponttol: string;
	StreetViewUrl: string;
	BusinessId: number;
	ProjectHash: string;
	ProjectEmail: string;
}

export interface ContactDetails {
	Id: number;
	Type: string;
	FirstName: string;
	LastName: string;
	Name: string;
	Email: string;
	Phone: string;
	Description: string;
	Deleted: number;
	CreatedBy: string;
	CreatedAt: string;
	UpdatedBy: string;
	UpdatedAt: string;
	Url: string;
	BankAccount: string;
	Swift: string;
	RegistrationNumber: string;
	VatNumber: string;
	Industry: string;
	Region: string;
	Employees: number;
	YearlyRevenue: number;
	EUVatNumber: string;
	FoundingYear: number;
	Capital: number;
	MainActivity: string;
	BisnodeTrafficLight: string;
	GroupIdentificationNumber: string;
	NonGovernmentalOrganization: string;
	MegjegyzesACimmelKapcsolatban: string;
	Tags: string[];
}

export interface ToDo {
	Id: number;
	Status: string;
	Comment: string;
	Deadline: string;
	UserId: number;
	Type: number;
	Url: string;
}

export interface ToDoList {
	Count: number;
	Results: ToDo[];
}

export async function fetchMiniCRM(endpoint: string, id?: string, method?: "POST" | "GET" | "PUT", body?: any) {
	var myHeaders = new Headers();
	myHeaders.append("Authorization", process.env.MINICRM_AUTH!);
	myHeaders.append("Content-Type", "application/json");

	var requestOptions = {
		method: "GET",
		headers: myHeaders,
	};
	if (method === "GET" || !method) {
		// if called from client and needed as proxy
		if (typeof window !== "undefined") {
			const resp = await fetch(
				"/api/minicrm-proxy?endpoint=" + endpoint + (id ? "&id=" + id : ""),
				requestOptions
			);
			if (resp.ok) {
				const data = await resp.json();
				return data;
			}
			throw new Error(`Request failed with status ${resp.status}`);
		}
		// if called from server
		const resp = await fetch("https://r3.minicrm.hu/Api/R3/" + endpoint + (id ? "/" + id : ""), requestOptions);
		if (resp.ok) {
			const data = await resp.json();
			return data;
		} else {
			throw new Error(`Request failed with status ${resp.status}`);
		}
	} else if (method === "POST") {
		const resp = await fetch("/api/minicrm-proxy?endpoint=" + endpoint, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(body),
		});
		if (resp.ok) {
			const data = await resp.json();
			return data;
		}
		throw new Error(`Request failed with status ${resp.status}`);
	} else if (method === "PUT") {
		if (typeof window !== "undefined") {
			const resp = await fetch("/api/minicrm-proxy/" + id + "?endpoint=" + endpoint, {
				...requestOptions,
				method: "PUT",
				body: JSON.stringify(body),
			});
			if (resp.ok) {
				const data = await resp.json();
				return data;
			}
			throw new Error(`Request failed with status ${resp.status}`);
		}
		const resp = await fetch("https://r3.minicrm.hu/Api/R3/" + endpoint + (id ? "/" + id : ""), {
			...requestOptions,
			method: "PUT",
			body: JSON.stringify(body),
		});
		if (resp.ok) {
			const data = await resp.json();
			return data;
		} else {
			throw new Error(`Request failed with status ${resp.status}`);
		}
	}
}

export async function fetchAdatlapDetails(adatlap_id: string) {
	return await fetchMiniCRM("Project", adatlap_id, "GET");
}

export async function fetchContactDetails(contact_id: string) {
	return await fetchMiniCRM("Contact", contact_id, "GET");
}

export async function fetchAllContactDetails(contact_ids: string[]) {
	return await Promise.all(contact_ids.map(async (id) => await fetchContactDetails(id)));
}

export async function assembleOfferXML(
	status: "Vázlat" | "Elfogadásra vár" | "Elfogadott ajánlat" | "Elutasítva" | "Sztornózva",
	userId = 39636,
	contactId: string,
	items: FelmeresItems[],
	adatlapId: string
) {
	const randomId = Math.floor(Math.random() * 1000000);
	const statusMap = {
		"Vázlat": 2894,
		"Elfogadásra vár": 2895,
		"Elfogadott ajánlat": 2896,
		"Elutasítva": 3014,
		"Sztornózva": 2897,
	};
	if (!contactId || !adatlapId) {
		return;
	}
	const adatlap: AdatlapDetails = await fetchAdatlapDetails(adatlapId);
	const contactData: ContactDetails = await fetchContactDetails(contactId);

	const xmlString = `<?xml version="1.0" encoding="UTF-8"?>
<Projects>
    <Project Id="${randomId}">
        <StatusId>3099</StatusId>
        <Name>${adatlap.Name}</Name>
        <ContactId>${contactData.Id}</ContactId>
        <UserId>${userId}</UserId>
        <CategoryId>32</CategoryId>
        <Contacts>
            <Contact Id="${randomId}">
                <FirstName>${contactData.FirstName}</FirstName>
                <LastName>${contactData.LastName}</LastName>
                <Type>${contactData.Type}</Type>
                <Email>${contactData.Email}</Email>
                <Phone>${contactData.Phone}</Phone>
            </Contact>
        </Contacts>
        <Offers>
            <Offer Id="${randomId}">
                <Number>${adatlap.Name}</Number>
                <CurrencyCode>HUF</CurrencyCode>
                <!-- Performace date of order [required date] -->
                <Performance>2015-09-22 12:15:13</Performance>
                <Status>${statusMap[status]}</Status>
                <!-- Data of Customer -->
                <Customer>
                    <!-- Name of Customer [required string] -->
                    <Name>${contactData.LastName} ${contactData.FirstName}</Name>
                    <!-- Country of customer [required string] -->
                    <CountryId>${adatlap.Orszag}</CountryId>
                    <!-- Postalcode of customer [required string] -->
                    <PostalCode>${adatlap.Iranyitoszam}</PostalCode>
                    <!-- City of customer [required string] -->
                    <City>${adatlap.Telepules}</City>
                    <!-- Address of customer [required string] -->
                    <Address>${adatlap.Cim2}</Address>
                </Customer>
                <!-- Data of product -->
                <Products>
                    <!-- Id = External id of product [required int] -->
                    ${items
						.map(
							(item) => `<Product Id="${item.productId}">
                        <!-- Name of product [required int] -->
                        <Name>${item.name}</Name>
                        <!-- SKU code of product [optional string]-->
                        <SKU>${item.sku}</SKU>
                        <!-- Nett price of product [required int] -->
                        <PriceNet>${item.netPrice}</PriceNet>
                        <!-- Quantity of product [required int] -->
                        <Quantity>${item.inputValues
							.map((value) => value.ammount)
							.reduce((a, b) => a + b, 0)}</Quantity>
                        <!-- Unit of product [required string] -->
                        <Unit>darab</Unit>
                        <!-- VAT of product [required int] -->
                        <VAT>27%</VAT>
                        <!-- Folder of product in MiniCRM. If it does not exist, then it is created automaticly [required string] -->
                        <FolderName>Default products</FolderName>
                    </Product>`
						)
						.join("\n")}
                </Products>
				<Project>
					<Felmeresid>${adatlap.Id}</Felmeresid>
				</Project>
            </Offer>
        </Offers>
    </Project>
</Projects>`;
	return await fetch("/api/minicrm-proxy?endpoint=XML", {
		method: "POST",
		headers: {
			"Content-Type": "application/xml",
		},
		body: xmlString,
	});
}

export async function list_to_dos(adatlap_id: string, criteria?: (todo: ToDo) => boolean) {
	const todos: ToDoList = await fetchMiniCRM("ToDoList", adatlap_id, "GET");
	if (criteria) {
		return todos["Results"].filter((todo) => criteria(todo));
	}
	return todos["Results"];
}
