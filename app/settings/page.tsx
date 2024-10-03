"use client";

import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Page() {
	return (
		<div className='space-y-6'>
			<div>
				<h3 className='text-lg font-medium'>Általános Beállítások</h3>
				<p className='text-sm text-muted-foreground'>Manage your API key and system ID.</p>
			</div>
			<div className='space-y-4'>
				<div className='space-y-2'>
					<Label htmlFor='api-key'>API Kulcs</Label>
					<Input id='api-key' type='password' placeholder='Add meg az API kulcsod' />
				</div>
				<div className='space-y-2'>
					<Label htmlFor='system-id'>Rendszer azonosító</Label>
					<Input id='system-id' placeholder='Add meg a Rendszer azonosítód' />
				</div>
			</div>
			<Button>Mentés</Button>
		</div>
	);
}
