"use server";

import { getSession } from "@auth0/nextjs-auth0";
import { cookies } from "next/headers";

export async function fetchUserCookie() {
	const session = await getSession();
	if (!cookies().get("system")) {
		const resp = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}.dataupload.xyz/user/${session?.user.sub}`);
		const data = await resp.json();
		cookies().set("system", data.system);
	}
}
