import { FelmeresItem } from "../new/_clientPage";
import { AdatlapDetails } from "./types";

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
		caches: "force-store" as RequestCache,
		next: { revalidate: 360 },
	};
	if (method === "GET" || !method) {
		if (endpoint === "Project" || !endpoint) {
			const resp = await fetch(`https://pen.dataupload.xyz/minicrm-adatlapok/${id ? id : ""}`);
			if (resp.ok) {
				const data: AdatlapDetails[] = await resp.json();
				if (id) {
					return data;
				}
				const filteredData = data.map((item) => {
					const filteredItem = Object.entries(item)
						.map(([key, value]) => (value ? { [key]: key === "Id" ? parseInt(value) : value } : null))
						.filter((value) => value !== null);
					return Object.assign({}, ...filteredItem);
				});

				return filteredData;
			}
		}
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
			throw new Error(`Request failed with status ${resp.status}. Reason: ${resp.statusText}`);
		}
		// if called from server
		const resp = await fetch("https://r3.minicrm.hu/Api/R3/" + endpoint + (id ? "/" + id : ""), requestOptions);
		if (resp.ok) {
			const data = await resp.json();
			return data;
		}
		if (resp.status === 429) {
			console.log("Too many requests");
		}
		return null;
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

export const miniCrmStatusMap = {
	"Vázlat": 2894,
	"Elfogadásra vár": 2895,
	"Elfogadott ajánlat": 2896,
	"Sikeres megrendelés": 3112,
	"Elutasítva": 3014,
	"Sztornózva": 2897,
};

export async function assembleOfferXML(
	status: "Vázlat" | "Elfogadásra vár" | "Elfogadott ajánlat" | "Elutasítva" | "Sztornózva",
	userId = 39636,
	contactId: string,
	items: FelmeresItem[],
	adatlapId: string,
	subject?: string,
	templateName?: string,
	felmeresId?: number,
	description: string = ""
) {
	const randomId = Math.floor(Math.random() * 1000000);
	if (!contactId || !adatlapId) {
		return;
	}
	const adatlap: AdatlapDetails = await fetchAdatlapDetails(adatlapId);
	const contactData: ContactDetails = await fetchContactDetails(contactId);
	const date = new Date(new Date().setDate(new Date().getDate() + 30));

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
				<Number>${adatlap.Name} - ${templateName ? templateName.substring(0, 20) : "Egyéni"}</Number>
                <CurrencyCode>HUF</CurrencyCode>
				<Subject>${subject}</Subject>
                <Performance>${date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate()}</Performance>
				<Prompt>${date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate()}</Prompt>
                <Status>${miniCrmStatusMap[status]}</Status>
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
							(item) => `<Product Id="${item.product ? item.product : Math.floor(Math.random() * 1000)}">
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
					<Felmeresid>${felmeresId}</Felmeresid>
					<UserId>${adatlap.Felmero2 ?? ""}</UserId>
					<KapcsolodoFelmeres>https://app.peneszmentesites.hu/${felmeresId}</KapcsolodoFelmeres>
					<ArajanlatMegjegyzes>${description}</ArajanlatMegjegyzes>
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

export function concatAddress(adatlap: AdatlapDetails) {
	return `${adatlap.Cim2} ${adatlap.Telepules} ${adatlap.Iranyitoszam}`;
}
